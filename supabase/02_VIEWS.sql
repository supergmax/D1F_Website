-- =====================================================
-- 02_VIEWS.SQL
-- Base de données D1F - DayOneFunded
-- Description : Vues SQL centralisées pour usage frontend et admin
-- =====================================================

-- =====================================================
-- Vue : admin_users_view
-- Liste des utilisateurs avec rôles, email, solde, etc.
-- =====================================================
CREATE OR REPLACE VIEW admin_users_view AS
SELECT
  id,
  nom,
  prenom,
  email,
  token_balance,
  role,
  error_location,
  created_at
FROM users;
COMMENT ON VIEW admin_users_view IS 'Vue d’administration listant tous les utilisateurs et leurs rôles.';

-- =====================================================
-- Vue : user_challenges_view
-- Liste des challenges avec infos utilisateur
-- =====================================================
CREATE OR REPLACE VIEW user_challenges_view AS
SELECT
  c.id,
  c.challenge_num,
  c.name,
  c.status,
  c.profit,
  c.label,
  c.note,
  u.nom,
  u.prenom,
  u.email
FROM challenges c
JOIN users u ON c.user_id = u.id;
COMMENT ON VIEW user_challenges_view IS 'Vue combinée utilisateur + challenges.';

-- =====================================================
-- Vue : user_balance_view
-- Montre la balance et les gains du mois en cours
-- =====================================================
CREATE OR REPLACE VIEW user_balance_view AS
SELECT
  u.id AS user_id,
  u.token_balance,
  SUM(cr.daily_gain - cr.daily_loss) AS current_month_profit
FROM users u
JOIN challenges c ON u.id = c.user_id
JOIN challenge_results cr ON c.id = cr.challenge_id
WHERE date_trunc('month', cr.date) = date_trunc('month', now())
GROUP BY u.id, u.token_balance;
COMMENT ON VIEW user_balance_view IS 'Vue synthétique montrant le solde token et les profits mensuels.';

-- =====================================================
-- Vue : high_priority_tickets_view
-- Liste tous les éléments à gravité haute (label = 'high')
-- =====================================================
CREATE OR REPLACE VIEW high_priority_tickets_view AS
SELECT 'challenge' AS source, id, label, note, created_at FROM challenges WHERE label = 'high'
UNION
SELECT 'purchase' AS source, id, label, note, created_at FROM purchases WHERE label = 'high'
UNION
SELECT 'invoice' AS source, id, label, note, created_at FROM invoices WHERE label = 'high'
UNION
SELECT 'payout' AS source, id, label, note, created_at FROM payouts WHERE label = 'high'
UNION
SELECT 'transaction' AS source, id, label, note, created_at FROM transactions WHERE label = 'high'
UNION
SELECT 'result' AS source, id, label, note, created_at FROM challenge_results WHERE label = 'high'
UNION
SELECT 'history' AS source, id, label, note, created_at FROM history WHERE label = 'high';
COMMENT ON VIEW high_priority_tickets_view IS 'Vue regroupant toutes les entrées critiques (label = high).';

-- =====================================================
-- Vue : open_tickets_by_status_view
-- Pour suivre les éléments dont le statut est "open"
-- =====================================================
CREATE OR REPLACE VIEW open_tickets_by_status_view AS
SELECT 'challenge' AS source, id, user_id, status, note, created_at FROM challenges WHERE status = 'open'
UNION
SELECT 'invoice' AS source, id, user_id, status, note, created_at FROM invoices WHERE status = 'open';
COMMENT ON VIEW open_tickets_by_status_view IS 'Vue listant les challenges ou factures en cours (status = open).';
