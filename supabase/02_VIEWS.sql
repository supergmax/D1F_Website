-- =====================================================
-- 02_VIEWS.SQL
-- Base de données D1F - DayOneFunded
-- Description : Vues SQL centralisées pour usage frontend et admin
-- =====================================================

-- =====================================================
-- Vue : admin_profiles_view
-- Liste des profils avec rôles, email, solde, etc.
-- =====================================================
CREATE OR REPLACE VIEW admin_profiles_view AS
SELECT
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.token_balance,
  p.role,
  p.error_location,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id;

COMMENT ON VIEW admin_profiles_view IS 'Vue d’administration listant tous les profils, leurs rôles et email.';

-- Ajout de descriptions pour les colonnes importantes
COMMENT ON COLUMN admin_profiles_view.id IS 'Identifiant UUID de l’utilisateur (lié à auth.users).';
COMMENT ON COLUMN admin_profiles_view.email IS 'Adresse email de l’utilisateur (auth.users.email).';
COMMENT ON COLUMN admin_profiles_view.first_name IS 'Prénom du profil utilisateur.';
COMMENT ON COLUMN admin_profiles_view.last_name IS 'Nom de famille du profil utilisateur.';
COMMENT ON COLUMN admin_profiles_view.token_balance IS 'Solde de tokens actuellement détenu.';
COMMENT ON COLUMN admin_profiles_view.role IS 'Rôle du profil utilisateur.';
COMMENT ON COLUMN admin_profiles_view.error_location IS 'Source de l’erreur enregistrée si applicable.';
COMMENT ON COLUMN admin_profiles_view.created_at IS 'Date de création du profil dans la table public.profiles.';

-- =====================================================
-- Vue : user_challenges_view
-- Liste des challenges avec les informations de profil
-- =====================================================
CREATE OR REPLACE VIEW user_challenges_view AS
SELECT
  c.id AS challenge_id,
  c.challenge_num,
  c.name AS challenge_name,
  c.status::text AS status,
  c.initial_balance,
  c.profit,
  c.note,
  c.label::text AS label,
  c.created_at,
  p.id AS user_id,
  p.first_name,
  p.last_name,
  u.email
FROM public.challenges c
JOIN public.profiles p ON c.user_id = p.id
JOIN auth.users u ON p.id = u.id;

COMMENT ON VIEW user_challenges_view IS 'Vue combinée des utilisateurs et de leurs challenges.';

-- Descriptions des colonnes clés
COMMENT ON COLUMN user_challenges_view.challenge_id IS 'Identifiant unique du challenge.';
COMMENT ON COLUMN user_challenges_view.challenge_num IS 'Numéro d’ordre du challenge pour cet utilisateur.';
COMMENT ON COLUMN user_challenges_view.challenge_name IS 'Nom du challenge.';
COMMENT ON COLUMN user_challenges_view.status IS 'Statut actuel du challenge.';
COMMENT ON COLUMN user_challenges_view.initial_balance IS 'Capital initial du challenge.';
COMMENT ON COLUMN user_challenges_view.profit IS 'Profit total réalisé sur ce challenge.';
COMMENT ON COLUMN user_challenges_view.note IS 'Note ou description complémentaire liée au challenge.';
COMMENT ON COLUMN user_challenges_view.label IS 'Niveau d’importance ou gravité associé au challenge.';
COMMENT ON COLUMN user_challenges_view.created_at IS 'Date de création du challenge.';
COMMENT ON COLUMN user_challenges_view.user_id IS 'ID utilisateur lié au challenge.';
COMMENT ON COLUMN user_challenges_view.first_name IS 'Prénom de l’utilisateur.';
COMMENT ON COLUMN user_challenges_view.last_name IS 'Nom de l’utilisateur.';
COMMENT ON COLUMN user_challenges_view.email IS 'Email de l’utilisateur (via auth.users).';

-- =====================================================
-- Vue : user_balance_view
-- Vue synthétique montrant la balance de tokens et les profits mensuels en cours
-- =====================================================
CREATE OR REPLACE VIEW user_balance_view AS
SELECT
  p.id AS user_id,
  p.first_name,
  p.last_name,
  u.email,
  p.token_balance,
  date_trunc('month', cr.date)::date AS month,
  SUM(cr.daily_gain - cr.daily_loss) AS current_month_profit
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
JOIN public.challenges c ON c.user_id = p.id
JOIN public.challenge_results cr ON cr.challenge_id = c.id
WHERE date_trunc('month', cr.date) = date_trunc('month', CURRENT_DATE)
GROUP BY p.id, p.first_name, p.last_name, u.email, p.token_balance, date_trunc('month', cr.date);

COMMENT ON VIEW user_balance_view IS 'Vue synthétisant le solde de tokens et les profits mensuels courants des utilisateurs.';

-- Descriptions des colonnes clés
COMMENT ON COLUMN user_balance_view.user_id IS 'Identifiant de l’utilisateur (lié à public.profiles et auth.users).';
COMMENT ON COLUMN user_balance_view.first_name IS 'Prénom de l’utilisateur.';
COMMENT ON COLUMN user_balance_view.last_name IS 'Nom de l’utilisateur.';
COMMENT ON COLUMN user_balance_view.email IS 'Email de l’utilisateur.';
COMMENT ON COLUMN user_balance_view.token_balance IS 'Solde actuel en tokens.';
COMMENT ON COLUMN user_balance_view.month IS 'Mois courant sur lequel sont calculés les résultats.';
COMMENT ON COLUMN user_balance_view.current_month_profit IS 'Profit net du mois (gains - pertes).';

-- =====================================================
-- Vue : high_priority_tickets_view
-- Vue regroupant toutes les entrées critiques (label = high)
-- =====================================================
CREATE OR REPLACE VIEW high_priority_tickets_view AS
SELECT 'challenge' AS source, id, user_id, label, note, created_at FROM public.challenges WHERE label = 'high'
UNION
SELECT 'purchase' AS source, id, user_id, label, note, created_at FROM public.purchases WHERE label = 'high'
UNION
SELECT 'invoice' AS source, id, user_id, label, note, created_at FROM public.invoices WHERE label = 'high'
UNION
SELECT 'payout' AS source, id, user_id, label, note, requested_at FROM public.payouts WHERE label = 'high'
UNION
SELECT 'transaction' AS source, id, user_id, label, note, created_at FROM public.transactions WHERE label = 'high'
UNION
SELECT 'result' AS source, id, NULL::uuid AS user_id, label, note, created_at FROM public.challenge_results WHERE label = 'high'
UNION
SELECT 'history' AS source, id, user_id, label, note, created_at FROM public.history WHERE label = 'high';

COMMENT ON VIEW high_priority_tickets_view IS 'Vue regroupant tous les tickets et événements critiques (label = high).';

-- Description des colonnes
COMMENT ON COLUMN high_priority_tickets_view.source IS 'Nom de la table source.';
COMMENT ON COLUMN high_priority_tickets_view.id IS 'ID de l’élément concerné.';
COMMENT ON COLUMN high_priority_tickets_view.user_id IS 'ID de l’utilisateur concerné (peut être null pour certains cas).';
COMMENT ON COLUMN high_priority_tickets_view.label IS 'Niveau de priorité (doit être high ici).';
COMMENT ON COLUMN high_priority_tickets_view.note IS 'Note ou commentaire éventuel.';
COMMENT ON COLUMN high_priority_tickets_view.created_at IS 'Date de création ou d’émission.';

-- =====================================================
-- Vue : open_tickets_by_status_view
-- Liste les éléments avec le statut "open"
-- =====================================================
CREATE OR REPLACE VIEW open_tickets_by_status_view AS
SELECT
  'challenge' AS source,
  id,
  user_id,
  status::text AS status,
  note,
  created_at
FROM public.challenges
WHERE status = 'open'

UNION

SELECT
  'invoice' AS source,
  id,
  user_id,
  status::text AS status,
  note,
  created_at
FROM public.invoices
WHERE status = 'open';

COMMENT ON VIEW open_tickets_by_status_view IS 'Vue listant les éléments avec le statut open (challenges, factures).';

-- Description des colonnes
COMMENT ON COLUMN open_tickets_by_status_view.source IS 'Source (challenge ou invoice).';
COMMENT ON COLUMN open_tickets_by_status_view.id IS 'Identifiant unique de l’élément concerné.';
COMMENT ON COLUMN open_tickets_by_status_view.user_id IS 'ID de l’utilisateur concerné.';
COMMENT ON COLUMN open_tickets_by_status_view.status IS 'Statut (open uniquement ici).';
COMMENT ON COLUMN open_tickets_by_status_view.note IS 'Note ou commentaire éventuel.';
COMMENT ON COLUMN open_tickets_by_status_view.created_at IS 'Date de création ou d’émission.';

