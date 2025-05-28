-- ========================================================
-- INSERT : transactions depuis invoices
-- ========================================================
CREATE OR REPLACE FUNCTION insert_transactions_from_invoices()
RETURNS TRIGGER AS $$
DECLARE
  tr_status transaction_status_enum;
BEGIN
  -- Mappe le statut de invoice vers transaction
  CASE NEW.status
    WHEN 'requested' THEN tr_status := 'requested';
    WHEN 'pending' THEN tr_status := 'pending';
    WHEN 'done' THEN tr_status := 'done';
    WHEN 'failed' THEN tr_status := 'failed';
    ELSE tr_status := 'requested';
  END CASE;

  -- Insère la transaction liée
  INSERT INTO public.transactions (
    profile_id,
    type,
    ref_id,
    status,
    note,
    label
  )
  VALUES (
    NEW.profile_id,
    'invoice',
    NEW.id,
    tr_status,
    'Création automatique via trigger invoice (INSERT)',
    'none'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_insert_transactions_from_invoices ON public.invoices;
CREATE TRIGGER trg_insert_transactions_from_invoices
AFTER INSERT ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION insert_transactions_from_invoices();

-- ========================================================
-- UPDATE : transactions depuis invoices + gestion dollar_balance
-- ========================================================
CREATE OR REPLACE FUNCTION update_transactions_from_invoices()
RETURNS TRIGGER AS $$
DECLARE
  tr_status transaction_status_enum;
BEGIN
  -- Mappe le statut de invoice vers transaction
  CASE NEW.status
    WHEN 'requested' THEN tr_status := 'requested';
    WHEN 'pending' THEN tr_status := 'pending';
    WHEN 'done' THEN tr_status := 'done';
    WHEN 'failed' THEN tr_status := 'failed';
    ELSE tr_status := 'requested';
  END CASE;

  -- Insère une nouvelle transaction à chaque update de statut
  INSERT INTO public.transactions (
    profile_id,
    type,
    ref_id,
    status,
    note,
    label
  )
  VALUES (
    NEW.profile_id,
    'invoice',
    NEW.id,
    tr_status,
    CONCAT('Mise à jour facture → statut = ', NEW.status),
    'none'
  );

  -- Créditer si statut devient 'done'
  IF NEW.status = 'done' AND OLD.status IS DISTINCT FROM 'done' THEN
    UPDATE public.profiles
    SET token_balance = token_balance + NEW.amount
    WHERE id = NEW.profile_id;

  -- Retirer si statut n'est plus 'done'
  ELSIF OLD.status = 'done' AND NEW.status IS DISTINCT FROM 'done' THEN
    UPDATE public.profiles
    SET token_balance = GREATEST(token_balance - NEW.amount, 0)
    WHERE id = NEW.profile_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_transactions_from_invoices ON public.invoices;
CREATE TRIGGER trg_update_transactions_from_invoices
AFTER UPDATE ON public.invoices
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_transactions_from_invoices();

-- ========================================================
-- INSERT : transactions depuis purchases
-- ========================================================
CREATE OR REPLACE FUNCTION insert_transactions_from_purchases()
RETURNS TRIGGER AS $$
DECLARE
  tr_status transaction_status_enum;
BEGIN
  -- Mappe le statut de purchase vers transaction
  CASE NEW.status
    WHEN 'requested' THEN tr_status := 'requested';
    WHEN 'pending' THEN tr_status := 'pending';
    WHEN 'done' THEN tr_status := 'done';
    WHEN 'failed' THEN tr_status := 'failed';
    ELSE tr_status := 'requested';
  END CASE;

  INSERT INTO public.transactions (
    profile_id,
    type,
    ref_id,
    status,
    note,
    label
  )
  VALUES (
    NEW.profile_id,
    'purchase',
    NEW.id,
    tr_status,
    'Création automatique via trigger purchase (INSERT)',
    'none'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_insert_transactions_from_purchases ON public.purchases;
CREATE TRIGGER trg_insert_transactions_from_purchases
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION insert_transactions_from_purchases();

-- ========================================================
-- UPDATE : transactions depuis purchases (suivi des statuts)
-- ========================================================
CREATE OR REPLACE FUNCTION update_transactions_from_purchases()
RETURNS TRIGGER AS $$
DECLARE
  tr_status transaction_status_enum;
BEGIN
  -- Statut dynamique
  CASE NEW.status
    WHEN 'requested' THEN tr_status := 'requested';
    WHEN 'pending' THEN tr_status := 'pending';
    WHEN 'done' THEN tr_status := 'done';
    WHEN 'failed' THEN tr_status := 'failed';
    ELSE tr_status := 'requested';
  END CASE;

  INSERT INTO public.transactions (
    profile_id,
    type,
    ref_id,
    status,
    note,
    label
  )
  VALUES (
    NEW.profile_id,
    'purchase',
    NEW.id,
    tr_status,
    CONCAT('Mise à jour de l’achat : statut = ', NEW.status),
    'none'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_transactions_from_purchases ON public.purchases;
CREATE TRIGGER trg_update_transactions_from_purchases
AFTER UPDATE ON public.purchases
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_transactions_from_purchases();

-- ========================================================
-- INSERT : débiter balances utilisateur à l’achat
-- ========================================================
CREATE OR REPLACE FUNCTION update_profiles_from_purchases()
RETURNS TRIGGER AS $$
BEGIN
  -- Débit des balances au moment de l'achat
  UPDATE public.profiles
  SET
    token_balance = GREATEST(token_balance - NEW.token_debit, 0),
    dollar_balance = GREATEST(dollar_balance - NEW.dollar_debit, 0)
  WHERE id = NEW.profile_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_profiles_from_purchases ON public.purchases;
CREATE TRIGGER trg_update_profiles_from_purchases
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION update_profiles_from_purchases();

CREATE OR REPLACE FUNCTION insert_challenges_from_purchases()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  IF NEW.status = 'pending' THEN
    FOR i IN 1..NEW.quantity LOOP
      SELECT COALESCE(MAX(challenge_num), 0) + 1 INTO next_num
      FROM public.challenges
      WHERE profile_id = NEW.profile_id;

      INSERT INTO public.challenges (
        profile_id,
        purchase_id,
        name,
        challenge_num,
        status,
        note,
        label
      ) VALUES (
        NEW.profile_id,
        NEW.id,
        CONCAT('Challenge #', next_num),
        next_num,
        'requested'::challenge_status_enum,
        'Créé automatiquement suite à purchase PENDING',
        'none'
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_insert_challenges_from_purchases ON public.purchases;

CREATE TRIGGER trg_insert_challenges_from_purchases
AFTER UPDATE ON public.purchases
FOR EACH ROW
WHEN (
  OLD.status IS DISTINCT FROM NEW.status AND
  NEW.status = 'pending'
)
EXECUTE FUNCTION insert_challenges_from_purchases();

-- Nouvelle fonction sécurisée
CREATE OR REPLACE FUNCTION update_challenges_from_purchases()
RETURNS TRIGGER AS $$
DECLARE
  total_token INTEGER;
  total_dollar INTEGER;
  qty INTEGER;
  unit_token INTEGER;
  unit_dollar INTEGER;
  ch RECORD;
BEGIN
  IF NEW.status = 'done' AND OLD.status IS DISTINCT FROM 'done' THEN
    SELECT token_debit, dollar_debit, quantity
    INTO total_token, total_dollar, qty
    FROM public.purchases WHERE id = NEW.id;

    IF qty > 0 THEN
      unit_token := FLOOR(total_token / qty);
      unit_dollar := FLOOR(total_dollar / qty);
    ELSE
      unit_token := 0;
      unit_dollar := 0;
    END IF;

    FOR ch IN
      SELECT * FROM public.challenges
      WHERE purchase_id = NEW.id
    LOOP
      IF ch.status = 'failure' THEN
        UPDATE public.profiles
        SET token_balance = token_balance - unit_token,
            dollar_balance = dollar_balance - unit_dollar
        WHERE id = ch.profile_id;

        UPDATE public.challenges
        SET status = 'pending'::challenge_status_enum,
            updated_at = NOW()
        WHERE id = ch.id;

      ELSIF ch.status = 'requested' THEN
        UPDATE public.challenges
        SET status = 'pending'::challenge_status_enum,
            updated_at = NOW()
        WHERE id = ch.id;
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_challenges_from_purchases ON public.purchases;

CREATE TRIGGER trg_update_challenges_from_purchases
AFTER UPDATE ON public.purchases
FOR EACH ROW
WHEN (
  OLD.status IS DISTINCT FROM NEW.status AND
  NEW.status = 'done'
)
EXECUTE FUNCTION update_challenges_from_purchases();

CREATE OR REPLACE FUNCTION refund_balances_from_purchases()
RETURNS TRIGGER AS $$
DECLARE
  total_token INTEGER;
  total_dollar INTEGER;
BEGIN
  IF NEW.status = 'failed'
     AND OLD.status IS DISTINCT FROM 'failed'

    SELECT token_debit, dollar_debit
    INTO total_token, total_dollar
    FROM public.purchases
    WHERE id = NEW.id;

    UPDATE public.profiles
    SET token_balance = token_balance + total_token,
        dollar_balance = dollar_balance + total_dollar
    WHERE id = NEW.profile_id;

    UPDATE public.purchases
    SET updated_at = NOW()
    WHERE id = NEW.id;

    UPDATE public.transactions
    SET updated_at = NOW()
    WHERE type = 'purchase' AND ref_id = NEW.id;

    UPDATE public.challenges
    SET status = 'failure'::challenge_status_enum,
        updated_at = NOW()
    WHERE purchase_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_refund_balances_from_purchases ON public.purchases;

CREATE TRIGGER trg_refund_balances_from_purchases
AFTER UPDATE ON public.purchases
FOR EACH ROW
WHEN (
  OLD.status IS DISTINCT FROM NEW.status AND
  NEW.status = 'failed'
)
EXECUTE FUNCTION refund_balances_from_purchases();

CREATE OR REPLACE FUNCTION debit_profiles_from_reopened_challenges()
RETURNS TRIGGER AS $$
DECLARE
  total_token INTEGER;
  total_dollar INTEGER;
  qty INTEGER;
  unit_token INTEGER;
  unit_dollar INTEGER;
BEGIN
  IF OLD.status = 'failure' AND NEW.status IN ('requested', 'pending', 'active', 'issue') THEN
    SELECT token_debit, dollar_debit, quantity
    INTO total_token, total_dollar, qty
    FROM public.purchases WHERE id = NEW.purchase_id AND status = 'done';

    IF qty > 0 THEN
      unit_token := FLOOR(total_token / qty);
      unit_dollar := FLOOR(total_dollar / qty);

      UPDATE public.profiles
      SET token_balance = token_balance - unit_token,
          dollar_balance = dollar_balance - unit_dollar
      WHERE id = NEW.profile_id;

      UPDATE public.challenges
      SET updated_at = NOW()
      WHERE id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_debit_profiles_from_challenges ON public.challenges;

CREATE TRIGGER trg_debit_profiles_from_challenges
AFTER UPDATE ON public.challenges
FOR EACH ROW
WHEN (
  OLD.status = 'failure' AND
  NEW.status IN ('requested', 'pending', 'active', 'issue'))
EXECUTE FUNCTION debit_profiles_from_reopened_challenges();

CREATE OR REPLACE FUNCTION refund_profiles_from_closed_challenges()
RETURNS TRIGGER AS $$
DECLARE
  total_token INTEGER;
  total_dollar INTEGER;
  qty INTEGER;
  unit_token INTEGER;
  unit_dollar INTEGER;
BEGIN
  IF NEW.status = 'failure' AND OLD.status IS DISTINCT FROM 'failure' THEN
    SELECT token_debit, dollar_debit, quantity
    INTO total_token, total_dollar, qty
    FROM public.purchases WHERE id = NEW.purchase_id AND status = 'done';

    IF qty > 0 THEN
      unit_token := FLOOR(total_token / qty);
      unit_dollar := FLOOR(total_dollar / qty);

      UPDATE public.profiles
      SET token_balance = token_balance + unit_token,
          dollar_balance = dollar_balance + unit_dollar
      WHERE id = NEW.profile_id;

      UPDATE public.challenges
      SET updated_at = NOW()
      WHERE id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_refund_profiles_from_challenges ON public.challenges;

CREATE TRIGGER trg_refund_profiles_from_challenges
AFTER UPDATE ON public.challenges
FOR EACH ROW
WHEN (
  OLD.status IS DISTINCT FROM NEW.status AND
  NEW.status = 'failure')
EXECUTE FUNCTION refund_profiles_from_closed_challenges();


-- ===================================
-- INSERT FUNCTION: insert_transactions_from_payouts
-- ===================================
CREATE OR REPLACE FUNCTION insert_transactions_from_payouts()
RETURNS TRIGGER AS $$
DECLARE
  tr_status transaction_status_enum := 'requested';
  token_debit INTEGER;
  balance INTEGER;
BEGIN
  -- Montant à débiter
  token_debit := NEW.amount;

  -- Vérification du solde disponible
  SELECT token_balance INTO balance FROM public.profiles WHERE id = NEW.profile_id;

  IF balance < token_debit THEN
    RAISE EXCEPTION 'Solde insuffisant pour effectuer le retrait (% disponible, % requis)', balance, token_debit;
  END IF;

  -- Débit immédiat des tokens
  UPDATE public.profiles
  SET token_balance = token_balance - token_debit,
      updated_at = NOW()
  WHERE id = NEW.profile_id;

  -- Mise à jour de requested_at
  UPDATE public.payouts
  SET requested_at = NOW()
  WHERE id = NEW.id;

  -- Log en transaction
  INSERT INTO public.transactions (
    profile_id,
    type,
    ref_id,
    status,
    refunded,
    note,
    label
  )
  VALUES (
    NEW.profile_id,
    'payout',
    NEW.id,
    tr_status,
    FALSE,
    CONCAT('Payout demandé (', NEW.amount, '$) → Débit ', token_debit, ' WT'),
    'none'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_insert_transactions_from_payouts ON public.payouts;

CREATE TRIGGER trg_insert_transactions_from_payouts
AFTER INSERT ON public.payouts
FOR EACH ROW
EXECUTE FUNCTION insert_transactions_from_payouts();

-- ===================================
-- UPDATE FUNCTION: update_transactions_from_payouts
-- ===================================
CREATE OR REPLACE FUNCTION update_transactions_from_payouts()
RETURNS TRIGGER AS $$
DECLARE
  tr_status transaction_status_enum;
BEGIN
  -- Mapping explicite
  CASE NEW.status
    WHEN 'requested' THEN tr_status := 'requested';
    WHEN 'pending' THEN tr_status := 'pending';
    WHEN 'done' THEN tr_status := 'done';
    WHEN 'failed' THEN tr_status := 'failed';
    ELSE tr_status := 'requested';
  END CASE;

  IF OLD.status IS DISTINCT FROM NEW.status THEN

    IF NEW.status = 'requested' THEN
      UPDATE public.payouts
      SET requested_at = NOW()
      WHERE id = NEW.id;

    ELSIF NEW.status = 'done' THEN
      UPDATE public.payouts
      SET processed_at = NOW()
      WHERE id = NEW.id;
    END IF;

    -- CAS: failed → done => refaire le débit et crédit
    IF OLD.status = 'failed' AND NEW.status = 'done' THEN
      UPDATE public.profiles
      SET token_balance = token_balance - NEW.amount,
          dollar_balance = dollar_balance + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.profile_id;

    -- CAS: autre → done => crédit uniquement
    ELSIF NEW.status = 'done' THEN
      UPDATE public.profiles
      SET dollar_balance = dollar_balance + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.profile_id;

    -- CAS: done → failed => remboursement token
    ELSIF OLD.status = 'done' AND NEW.status = 'failed' THEN
      UPDATE public.profiles
      SET dollar_balance = dollar_balance - NEW.amount,
          token_balance = token_balance + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.profile_id;

    -- CAS: autre → failed => remboursement simple token
    ELSIF NEW.status = 'failed' THEN
      UPDATE public.profiles
      SET token_balance = token_balance + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.profile_id;
    END IF;

    -- Log dans transactions
    INSERT INTO public.transactions (
      profile_id,
      type,
      ref_id,
      status,
      refunded,
      note,
      label
    )
    VALUES (
      NEW.profile_id,
      'payout',
      NEW.id,
      tr_status,
      FALSE,
      CONCAT('Update payout status = ', NEW.status),
      'none'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_transactions_from_payouts ON public.payouts;

CREATE TRIGGER trg_update_transactions_from_payouts
AFTER UPDATE ON public.payouts
FOR EACH ROW
WHEN (
  OLD.status IS DISTINCT FROM NEW.status
)
EXECUTE FUNCTION update_transactions_from_payouts();

-- =====================================
-- Fonction pour gérer start_date et end_date des challenges
-- =====================================
CREATE OR REPLACE FUNCTION update_challenge_dates_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Passage à 'active' → enregistrer la date de début
  IF NEW.status = 'active' AND (OLD.status IS DISTINCT FROM NEW.status) AND NEW.start_date IS NULL THEN
    NEW.start_date := NOW();
  END IF;

  -- Passage à 'failure' → enregistrer la date de fin
  IF NEW.status = 'failure' AND (OLD.status IS DISTINCT FROM NEW.status) AND NEW.end_date IS NULL THEN
    NEW.end_date := NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- Trigger associé à la table challenges
-- =====================================
DROP TRIGGER IF EXISTS trg_update_challenge_dates ON public.challenges;

CREATE TRIGGER trg_update_challenge_dates
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION update_challenge_dates_on_status_change();


-- =====================================
-- Trigger function générique pour updated_at
-- =====================================
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =====================================
-- Trigger automatique pour profiles
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_profiles ON public.profiles;

CREATE TRIGGER trg_set_updated_at_on_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour corporations
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_corporations ON public.corporations;

CREATE TRIGGER trg_set_updated_at_on_corporations
BEFORE UPDATE ON public.corporations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour affiliations
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_affiliations ON public.affiliations;

CREATE TRIGGER trg_set_updated_at_on_affiliations
BEFORE UPDATE ON public.affiliations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour challenges
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_challenges ON public.challenges;

CREATE TRIGGER trg_set_updated_at_on_challenges
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour challenge_results
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_challenge_results ON public.challenge_results;

CREATE TRIGGER trg_set_updated_at_on_challenge_results
BEFORE UPDATE ON public.challenge_results
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour products
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_products ON public.products;

CREATE TRIGGER trg_set_updated_at_on_products
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour purchases
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_purchases ON public.purchases;

CREATE TRIGGER trg_set_updated_at_on_purchases
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour invoices
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_invoices ON public.invoices;

CREATE TRIGGER trg_set_updated_at_on_invoices
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour payouts
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_payouts ON public.payouts;

CREATE TRIGGER trg_set_updated_at_on_payouts
BEFORE UPDATE ON public.payouts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour transactions
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_transactions ON public.transactions;

CREATE TRIGGER trg_set_updated_at_on_transactions
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- =====================================
-- Trigger automatique pour history
-- =====================================
DROP TRIGGER IF EXISTS trg_set_updated_at_on_history ON public.history;

CREATE TRIGGER trg_set_updated_at_on_history
BEFORE UPDATE ON public.history
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();
