-- =====================================================
-- 99_SEED_DEV_DATA.SQL
-- Base de données D1F - DayOneFunded
-- Description : Données de test pour développement local
-- =====================================================

-- ============================================
-- Création d'un utilisateur "user"
-- ============================================
INSERT INTO users (
  id, nom, prenom, email, password, telephone, adresse,
  billing_adresse, country, language, affiliate_id, token_balance, role, photo_url
) VALUES (
  uuid_generate_v4(), 'Doe', 'John', 'user@d1f.test', 'hashed-password', '0600000000',
  '1 rue du test', '1 rue du test', 'FR', 'fr', 'AB12CD', 5000, 'user', NULL
);

-- ============================================
-- Création d'un utilisateur "admin"
-- ============================================
INSERT INTO users (
  id, nom, prenom, email, password, telephone, adresse,
  billing_adresse, country, language, affiliate_id, token_balance, role, photo_url
) VALUES (
  uuid_generate_v4(), 'Admin', 'Alice', 'admin@d1f.test', 'hashed-password', '0600000001',
  '2 rue admin', '2 rue admin', 'FR', 'fr', 'ZX98YX', 10000, 'admin', NULL
);

-- ============================================
-- Ajout d'un produit (achat de token)
-- ============================================
INSERT INTO products (id, name, description, price_in_tokens)
VALUES (
  uuid_generate_v4(), 'Pack 1000 Tokens', 'Pack de 1000 tokens pour la boutique', 1000
);

-- ============================================
-- Achat d’un produit par le user
-- ============================================
INSERT INTO purchases (id, user_id, product_id, quantity, total_tokens)
SELECT uuid_generate_v4(), u.id, p.id, 1, 1000
FROM users u, products p
WHERE u.email = 'user@d1f.test' AND p.name = 'Pack 1000 Tokens'
LIMIT 1;

-- ============================================
-- Création d’un challenge pour le user
-- ============================================
INSERT INTO challenges (
  id, user_id, challenge_num, name, status, initial_balance, profit
)
SELECT uuid_generate_v4(), u.id, 1, 'Challenge 1', 'active', 100000, 2500
FROM users u
WHERE u.email = 'user@d1f.test'
LIMIT 1;

-- ============================================
-- Résultats quotidiens
-- ============================================
INSERT INTO challenge_results (
  challenge_id, date, daily_gain, daily_loss, note, label
)
SELECT c.id, current_date - 1, 1200, 300, 'Bonne journée de trading', 'low'
FROM challenges c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'user@d1f.test'
LIMIT 1;

-- ============================================
-- Facture Stripe associée à l’achat
-- ============================================
INSERT INTO invoices (
  id, user_id, stripe_invoice_id, amount, status
)
SELECT uuid_generate_v4(), u.id, 'stripe-inv-123', 1000, 'paid'
FROM users u
WHERE u.email = 'user@d1f.test'
LIMIT 1;

-- ============================================
-- Affiliation : admin a parrainé le user
-- ============================================
INSERT INTO affiliations (
  client_id, affiliate_id, godfather_id, level, label
)
SELECT u1.id, u2.affiliate_id, u2.affiliate_id, 1, 'low'
FROM users u1, users u2
WHERE u1.email = 'user@d1f.test' AND u2.email = 'admin@d1f.test'
LIMIT 1;

-- ============================================
-- Payout simulé
-- ============================================
INSERT INTO payouts (
  id, user_id, amount_tokens, status
)
SELECT uuid_generate_v4(), u.id, 2000, 'requested'
FROM users u
WHERE u.email = 'user@d1f.test'
LIMIT 1;

-- ============================================
-- Transaction liée à l’achat
-- ============================================
INSERT INTO transactions (
  id, user_id, type, ref_id, status
)
SELECT uuid_generate_v4(), u.id, 'purchase', pu.id, 'completed'
FROM users u
JOIN purchases pu ON pu.user_id = u.id
WHERE u.email = 'user@d1f.test'
LIMIT 1;
