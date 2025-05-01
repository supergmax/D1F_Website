-- =====================================================
-- 04_TRIGGERS.SQL
-- Base de données D1F - DayOneFunded
-- Description : Triggers automatiques pour cohérence métier
-- =====================================================

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
