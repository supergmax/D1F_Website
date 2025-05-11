-- =====================================================
-- 03_FUNCTIONS.SQL
-- Base de données D1F - DayOneFunded
-- Description : Fonctions métiers (archivage, reset, etc.)
-- =====================================================



-- =====================================================
-- Fonction : log_monthly_history()
-- Archive mensuellement les performances, gains/pertes
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_monthly_history()
RETURNS void AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT
      p.id AS user_id,
      c.id AS challenge_id,
      DATE_TRUNC('month', CURRENT_DATE)::DATE AS month,
      COALESCE(SUM(cr.daily_gain), 0) AS gain,
      COALESCE(SUM(cr.daily_loss), 0) AS loss,
      p.token_balance,
      (
        SELECT COUNT(*) FROM public.purchases pu
        WHERE pu.user_id = p.id
        AND DATE_TRUNC('month', pu.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS purchase_count,
      (
        SELECT COUNT(*) FROM public.payouts po
        WHERE po.user_id = p.id
        AND DATE_TRUNC('month', po.requested_at) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS payout_count,
      (
        SELECT COUNT(*) FROM public.invoices i
        WHERE i.user_id = p.id
        AND DATE_TRUNC('month', i.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS invoice_count,
      (
        SELECT COUNT(*) FROM public.affiliations a
        WHERE a.affiliate_id = p.affiliate_id
        AND DATE_TRUNC('month', a.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS affil_count
    FROM public.profiles p
    JOIN public.challenges c ON c.user_id = p.id
    LEFT JOIN public.challenge_results cr ON cr.challenge_id = c.id
      AND DATE_TRUNC('month', cr.date) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY p.id, c.id, p.token_balance
  LOOP
    INSERT INTO public.history (
      user_id,
      challenge_id,
      month,
      total_gain,
      total_loss,
      token_balance_snapshot,
      purchases,
      payouts,
      invoices,
      affiliate_count
    )
    VALUES (
      r.user_id,
      r.challenge_id,
      r.month,
      r.gain,
      r.loss,
      r.token_balance,
      r.purchase_count,
      r.payout_count,
      r.invoice_count,
      r.affil_count
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.log_monthly_history IS
'Archive les performances utilisateurs à la fin de chaque mois (gains, pertes, achats, retraits, affiliation). Données insérées dans la table `history`.';

-- =====================================================
-- Fonction : reset_monthly_perfs()
-- Supprime les données de résultats pour un nouveau cycle
-- =====================================================
CREATE OR REPLACE FUNCTION public.reset_monthly_perfs()
RETURNS void AS $$
BEGIN
  -- Archive avant suppression
  PERFORM public.log_monthly_history();

  -- Réinitialise les profits cumulés des challenges
  UPDATE public.challenges
  SET profit = 0
  WHERE DATE_TRUNC('month', updated_at) = DATE_TRUNC('month', CURRENT_DATE);

  -- Supprime les résultats du mois courant
  DELETE FROM public.challenge_results
  WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.reset_monthly_perfs IS
'Archive les performances puis réinitialise les challenges et résultats pour un nouveau mois.';

-- =====================================================
-- Fonction : set_updated_at()
-- Reset le champ updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.set_updated_at IS
'Déclenchée automatiquement à chaque mise à jour pour enregistrer un timestamp dans le champ `updated_at`. À associer à des triggers de tables.';

-- =====================================================
-- Fonction : generate_affiliate_id()
-- Crée un affiliate_id
-- =====================================================

CREATE OR REPLACE FUNCTION public.generate_affiliate_id()
RETURNS VARCHAR(6) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code VARCHAR(6);
  exists BOOLEAN := TRUE;
BEGIN
  WHILE exists LOOP
    -- Génération aléatoire du code
    code := (
      SELECT string_agg(substr(chars, floor(random()*length(chars)+1)::int, 1), '')
      FROM generate_series(1,6)
    );

    -- Vérification d'unicité dans la table des profils
    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE affiliate_id = code
    ) INTO exists;

    -- Si non existant, on sort
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
  RETURN NULL; -- Sécurité (n’atteint jamais ce point)
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_affiliate_id IS
'Génère un code unique de parrainage de 6 caractères utilisé dans le champ affiliate_id (liens de cooptation).';

-- =====================================================
-- Fonction : is_valid_godfather_code(code TEXT)
-- Vérifie si le parrain existe
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_valid_godfather_code(code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  found BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE affiliate_id = UPPER(TRIM(code))
  ) INTO found;
  RETURN found;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.is_valid_godfather_code IS
'Vérifie si le code fourni correspond à un affiliate_id valide existant dans la table public.profiles.';
