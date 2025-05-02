-- =====================================================
-- 05_POLICIES.SQL
-- Base de données D1F - DayOneFunded
-- Description : RLS pour tous les accès utilisateurs et rôles
-- =====================================================

-- Activer RLS sur toutes les tables sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliations ENABLE ROW LEVEL SECURITY;

-- =============================
-- USERS
-- =============================
-- Lecture par soi-même
CREATE POLICY user_read_own_data ON users
FOR SELECT USING (auth.uid() = id);

-- Modification de données non critiques
CREATE POLICY user_update_limited ON users
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
  role = 'user' AND
  auth.uid() = id AND
  email IS NOT DISTINCT FROM current_setting('jwt.claims.email', true)
);

-- Lecture globale par admin
CREATE POLICY admin_read_all_users ON users
FOR SELECT USING (
  (auth.jwt() ->> 'role') IN ('admin', 'superadmin')
);

-- Modification par admin
CREATE POLICY admin_update_users ON users
FOR UPDATE USING (
  (auth.jwt() ->> 'role') IN ('admin', 'superadmin')
);

-- =============================
-- CHALLENGES
-- =============================
CREATE POLICY user_read_own_challenges ON challenges
FOR SELECT USING (auth.uid() = user_id);

-- Admin lecture + écriture
CREATE POLICY admin_manage_challenges ON challenges
FOR ALL USING (
  (auth.jwt() ->> 'role') IN ('admin', 'superadmin')
);

-- =============================
-- CHALLENGE_RESULTS
-- =============================
CREATE POLICY admin_results_only ON challenge_results
FOR ALL USING (
  (auth.jwt() ->> 'role') IN ('admin', 'superadmin')
);

-- =============================
-- PURCHASES
-- =============================
CREATE POLICY user_read_own_purchases ON purchases
FOR SELECT USING (auth.uid() = user_id);

-- Admin full access
CREATE POLICY admin_manage_purchases ON purchases
FOR ALL USING ((auth.jwt() ->> 'role') IN ('admin', 'superadmin'));

-- =============================
-- INVOICES
-- =============================
CREATE POLICY user_read_own_invoices ON invoices
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY admin_manage_invoices ON invoices
FOR ALL USING ((auth.jwt() ->> 'role') IN ('admin', 'superadmin'));

-- =============================
-- PAYOUTS
-- =============================
CREATE POLICY user_read_own_payouts ON payouts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY admin_manage_payouts ON payouts
FOR ALL USING ((auth.jwt() ->> 'role') IN ('admin', 'superadmin'));

-- =============================
-- TRANSACTIONS
-- =============================
CREATE POLICY user_read_own_transactions ON transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY admin_manage_transactions ON transactions
FOR ALL USING ((auth.jwt() ->> 'role') IN ('admin', 'superadmin'));

-- =============================
-- HISTORY
-- =============================
CREATE POLICY user_read_own_history ON history
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY admin_read_all_history ON history
FOR SELECT USING ((auth.jwt() ->> 'role') IN ('admin', 'superadmin'));

-- =============================
-- AFFILIATIONS
-- =============================
CREATE POLICY user_read_own_affiliations ON affiliations
FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY admin_manage_affiliations ON affiliations
FOR ALL USING ((auth.jwt() ->> 'role') IN ('admin', 'superadmin'));
