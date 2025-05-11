-- =====================================================
-- 04_TRIGGERS.SQL
-- Base de données D1F - DayOneFunded
-- Description : Triggers automatiques pour cohérence métier
-- =====================================================

-- Fonction d'insertion du profil lors de la création d'un utilisateur auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    address,
    billing_address,
    country,
    language,
    affiliate_id,
    godfather_id,
    token_balance,
    role,
    photo_url,
    corp_id,
    error_location,
    note,
    label,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'address',
    NEW.raw_user_meta_data ->> 'billing_address',
    NEW.raw_user_meta_data ->> 'country',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'fr'),
    NEW.raw_user_meta_data ->> 'affiliate_id',
    NEW.raw_user_meta_data ->> 'godfather_id',
    COALESCE((NEW.raw_user_meta_data ->> 'token_balance')::INT, 0),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::role_enum, 'user'),
    NEW.raw_user_meta_data ->> 'photo_url',
    NULL,
    NULL,
    NULL,
    'none',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencheur sur insertion dans auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Crée automatiquement un profil dans public.profiles depuis raw_user_meta_data.';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Déclenché après création d’un utilisateur dans auth.users.';


-- Création du trigger
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_corporations_updated_at
BEFORE UPDATE ON public.corporations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- TRIGGER : Génération d’un affiliate_id unique
-- =====================================================
CREATE OR REPLACE FUNCTION generate_affiliate_id()
RETURNS TRIGGER AS $$
DECLARE
  new_id VARCHAR(6);
BEGIN
  LOOP
    new_id := SUBSTRING(ENCODE(gen_random_bytes(4), 'hex') FROM 1 FOR 6);
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM users WHERE affiliate_id = new_id
    );
  END LOOP;
  NEW.affiliate_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION generate_affiliate_id IS 'Génère un affiliate_id unique automatiquement.';

CREATE TRIGGER trg_generate_affiliate_id
BEFORE INSERT ON users
FOR EACH ROW
WHEN (NEW.affiliate_id IS NULL)
EXECUTE FUNCTION generate_affiliate_id();

-- =====================================================
-- TRIGGER : Mise à jour automatique du profit total après ajout résultat
-- =====================================================
CREATE OR REPLACE FUNCTION update_challenge_profit()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE challenges
  SET profit = profit + NEW.daily_gain - NEW.daily_loss
  WHERE id = NEW.challenge_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION update_challenge_profit IS 'Met à jour automatiquement le champ profit dans la table challenges.';

CREATE TRIGGER trg_update_challenge_profit
AFTER INSERT ON challenge_results
FOR EACH ROW
EXECUTE FUNCTION update_challenge_profit();

-- =====================================================
-- TRIGGER : Vérification du solde token avant achat
-- =====================================================
CREATE OR REPLACE FUNCTION verify_token_balance()
RETURNS TRIGGER AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  SELECT token_balance INTO current_balance FROM users WHERE id = NEW.user_id;

  IF current_balance < NEW.total_tokens THEN
    RAISE EXCEPTION 'Solde insuffisant pour cet achat.';
  ELSE
    UPDATE users
    SET token_balance = token_balance - NEW.total_tokens
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION verify_token_balance IS 'Vérifie que le solde de tokens est suffisant avant achat.';

CREATE TRIGGER trg_verify_token_balance
BEFORE INSERT ON purchases
FOR EACH ROW
EXECUTE FUNCTION verify_token_balance();
