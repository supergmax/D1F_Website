-- =====================================================
-- 01_SCHEMA_CORE.SQL
-- Base de données D1F - DayOneFunded
-- Description : Tables, ENUMs, Champs, Contraintes, Commentaires
-- =====================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================
-- ENUMS
-- ======================
CREATE TYPE role_enum AS ENUM ('user', 'admin', 'superadmin', 'support');
COMMENT ON TYPE role_enum IS 'Rôle de l’utilisateur dans le système.';

CREATE TYPE challenge_status_enum AS ENUM ('open', 'pending', 'active', 'failed', 'completed');
COMMENT ON TYPE challenge_status_enum IS 'Statut d’un challenge (suivi du process).';

CREATE TYPE invoice_status_enum AS ENUM ('open', 'pending', 'paid', 'failed');
COMMENT ON TYPE invoice_status_enum IS 'Statut de facturation lié aux achats de tokens.';

CREATE TYPE payout_status_enum AS ENUM ('requested', 'approved', 'declined', 'paid');
COMMENT ON TYPE payout_status_enum IS 'Statut d’une demande de retrait.';

CREATE TYPE transaction_type_enum AS ENUM ('purchase', 'invoice', 'payout');
COMMENT ON TYPE transaction_type_enum IS 'Type d’une transaction enregistrée.';

CREATE TYPE transaction_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');
COMMENT ON TYPE transaction_status_enum IS 'Statut d’une transaction globale.';

CREATE TYPE label_enum AS ENUM ('low', 'medium', 'high');
COMMENT ON TYPE label_enum IS 'Niveau de priorité ou gravité d’un ticket/événement.';

CREATE TYPE error_source_enum AS ENUM (
  'users', 'transactions', 'challenges', 'payouts', 'invoices', 'affiliations', 'history'
);
COMMENT ON TYPE error_source_enum IS 'Table source d’une anomalie liée à un utilisateur.';

-- ======================
-- TABLE : USERS
-- ======================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  telephone TEXT,
  adresse TEXT,
  billing_adresse TEXT,
  country TEXT,
  language TEXT DEFAULT 'fr',
  affiliate_id VARCHAR(6) UNIQUE NOT NULL,
  godfather_id VARCHAR(6),
  token_balance INTEGER DEFAULT 0 NOT NULL,
  role role_enum DEFAULT 'user' NOT NULL,
  photo_url TEXT,
  corp_id UUID,
  error_location error_source_enum,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_godfather FOREIGN KEY (godfather_id) REFERENCES users(affiliate_id) ON DELETE SET NULL
);
COMMENT ON TABLE users IS 'Contient les informations des utilisateurs, solde, rôles et affiliation.';
COMMENT ON COLUMN users.error_location IS 'Table à l’origine d’un problème utilisateur.';

-- ======================
-- TABLE : CORPORATIONS
-- ======================
CREATE TABLE corporations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  corp_name TEXT NOT NULL,
  adress TEXT,
  vat_num TEXT,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE corporations IS 'Représente les entités corporate associées aux utilisateurs.';

-- ======================
-- TABLE : AFFILIATIONS
-- ======================
CREATE TABLE affiliations (
  id SERIAL PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  affiliate_id VARCHAR(6) REFERENCES users(affiliate_id) ON DELETE CASCADE,
  godfather_id VARCHAR(6),
  level INTEGER CHECK (level IN (1,2)) NOT NULL,
  note TEXT,
  label label_enum DEFAULT 'low',
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_affiliation_per_level UNIQUE (client_id, level)
);
COMMENT ON TABLE affiliations IS 'Gère les connexions de parrainage à 2 niveaux.';

-- ======================
-- TABLE : CHALLENGES
-- ======================
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  challenge_num INTEGER NOT NULL,
  status challenge_status_enum DEFAULT 'open',
  start_date DATE,
  end_date DATE,
  initial_balance INTEGER DEFAULT 0,
  profit INTEGER DEFAULT 0,
  note TEXT,
  label label_enum DEFAULT 'low',
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE challenges IS 'Contient les informations liées aux challenges achetés.';

-- ======================
-- TABLE : CHALLENGE_RESULTS
-- ======================
CREATE TABLE challenge_results (
  id SERIAL PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  daily_gain INTEGER DEFAULT 0 CHECK (daily_gain >= 0),
  daily_loss INTEGER DEFAULT 0 CHECK (daily_loss >= 0),
  note TEXT,
  label label_enum DEFAULT 'low',
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE challenge_results IS 'Contient les résultats journaliers pour chaque challenge.';

-- ======================
-- TABLE : PRODUCTS
-- ======================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_in_tokens INTEGER NOT NULL,
  available BOOLEAN DEFAULT true
);
COMMENT ON TABLE products IS 'Produits disponibles dans la boutique (tokens, challenges, matelas).';

-- ======================
-- TABLE : PURCHASES
-- ======================
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  total_tokens INTEGER NOT NULL,
  note TEXT,
  label label_enum DEFAULT 'low',
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE purchases IS 'Enregistre les achats d’un utilisateur dans la boutique.';

-- ======================
-- TABLE : INVOICES
-- ======================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status invoice_status_enum DEFAULT 'open',
  note TEXT,
  label label_enum DEFAULT 'low',
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE invoices IS 'Factures générées après achat (Stripe, tokens).';

-- ======================
-- TABLE : PAYOUTS
-- ======================
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount_tokens INTEGER NOT NULL,
  status payout_status_enum DEFAULT 'requested',
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  note TEXT,
  label label_enum DEFAULT 'low'
);
COMMENT ON TABLE payouts IS 'Demandes de retrait de tokens faites par l’utilisateur.';

-- ======================
-- TABLE : TRANSACTIONS
-- ======================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type transaction_type_enum NOT NULL,
  ref_id UUID NOT NULL,
  status transaction_status_enum DEFAULT 'pending',
  note TEXT,
  label label_enum DEFAULT 'low',
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE transactions IS 'Log global de toutes les transactions (achats, retraits, factures).';

-- ======================
-- TABLE : HISTORY
-- ======================
CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  challenge_id UUID REFERENCES challenges(id),
  month VARCHAR(7) NOT NULL,
  total_gain INTEGER NOT NULL,
  total_loss INTEGER NOT NULL,
  token_balance_snapshot INTEGER NOT NULL,
  purchases INTEGER DEFAULT 0,
  payouts INTEGER DEFAULT 0,
  invoices INTEGER DEFAULT 0,
  affiliate_count INTEGER DEFAULT 0,
  note TEXT,
  label label_enum DEFAULT 'low',
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE history IS 'Historique mensuel consolidé des performances utilisateur/challenges.';
