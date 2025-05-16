-- =====================================================
-- schema.SQL (v10)
-- Base de données D1F - DayOneFunded
-- Description : Tables, ENUMs, Champs, Contraintes, Commentaires
-- =====================================================



-- =====================================================
-- ACCES : auth
-- =====================================================

-- Donne accès au schéma auth
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Accès lecture uniquement
GRANT SELECT ON auth.users TO authenticated;

-- =====================================================
-- ACCES : public
-- =====================================================

-- Donne accès au schéma public
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Donne accès aux tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

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

CREATE TYPE invoice_status_enum AS ENUM ('pending', 'open', 'paid', 'failed');
COMMENT ON TYPE invoice_status_enum IS 'Statut de facturation lié aux achats de tokens.';

CREATE TYPE payout_status_enum AS ENUM ('requested', 'approved', 'declined', 'paid');
COMMENT ON TYPE payout_status_enum IS 'Statut d’une demande de retrait.';

CREATE TYPE transaction_type_enum AS ENUM ('purchase', 'invoice', 'payout');
COMMENT ON TYPE transaction_type_enum IS 'Type d’une transaction enregistrée.';

CREATE TYPE transaction_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');
COMMENT ON TYPE transaction_status_enum IS 'Statut d’une transaction globale.';

CREATE TYPE label_enum AS ENUM ('none', 'low', 'medium', 'high');
COMMENT ON TYPE label_enum IS 'Niveau d’alerte ou de priorité d’un problème (none = aucun problème signalé).';

CREATE TYPE error_source_enum AS ENUM (
  'users', 'corporations', 'affiliations', 'challenges', 'challenge_results', 'products', 'purchases', 'payouts', 'invoices', 'transactions', 'history'
);
COMMENT ON TYPE error_source_enum IS 'Table source d’une anomalie liée à un utilisateur.';

-- ======================
-- TABLE : PROFILES
-- ======================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL, 
  id_phone TEXT NOT NULL, 
  phone TEXT NOT NULL, 
  address TEXT,
  billing_address TEXT,
  country TEXT,
  language TEXT DEFAULT 'fr',
  affiliate_id VARCHAR(6) UNIQUE NOT NULL,
  godfather_id VARCHAR(6),
  token_balance INTEGER DEFAULT 0 NOT NULL CHECK (token_balance >= 0),
  role role_enum DEFAULT 'user' NOT NULL,
  photo_url TEXT,
  corp_id UUID,
  error_location error_source_enum,
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'Contient les données personnelles et les rôles des utilisateurs (liés à auth.users).';

COMMENT ON COLUMN public.profiles.id IS 'UUID lié à l’utilisateur authentifié Supabase (auth.users.id).';
COMMENT ON COLUMN public.profiles.first_name IS 'Prénom de l’utilisateur.';
COMMENT ON COLUMN public.profiles.last_name IS 'Nom de famille de l’utilisateur.';
COMMENT ON COLUMN public.profiles.email IS 'Adresse email de l’utilisateur, dupliquée depuis auth.users pour un accès direct côté client.';
COMMENT ON COLUMN public.profiles.id_phone IS 'Indicatif téléphonique international (ex: +33 pour France, +1 pour USA).';
COMMENT ON COLUMN public.profiles.phone IS 'Numéro de téléphone sans indicatif (ex: 612345678 pour +33 6 12 34 56 78).';
COMMENT ON COLUMN public.profiles.address IS 'Adresse principale de l’utilisateur.';
COMMENT ON COLUMN public.profiles.billing_address IS 'Adresse de facturation.';
COMMENT ON COLUMN public.profiles.country IS 'Pays de résidence.';
COMMENT ON COLUMN public.profiles.language IS 'Langue d’affichage (par défaut : fr).';
COMMENT ON COLUMN public.profiles.affiliate_id IS 'Code unique généré automatiquement à la création du compte.';
COMMENT ON COLUMN public.profiles.godfather_id IS 'Code du parrain (affiliate_id d’un autre utilisateur).';
COMMENT ON COLUMN public.profiles.token_balance IS 'Solde de tokens de l’utilisateur.';
COMMENT ON COLUMN public.profiles.role IS 'Rôle du profil (user, admin, etc.)';
COMMENT ON COLUMN public.profiles.photo_url IS 'Lien vers la photo de profil.';
COMMENT ON COLUMN public.profiles.corp_id IS 'ID d’une société liée (corporation).';
COMMENT ON COLUMN public.profiles.error_location IS 'Source de l’erreur associée à ce profil, le cas échéant.';
COMMENT ON COLUMN public.profiles.note IS 'Note interne ou commentaire sur l’utilisateur.';
COMMENT ON COLUMN public.profiles.label IS 'Niveau d’importance ou d’alerte associé à l’utilisateur.';
COMMENT ON COLUMN public.profiles.created_at IS 'Date de création du profil (indépendante de auth.users).';
COMMENT ON COLUMN public.profiles.updated_at IS 'Date de dernière mise à jour du profil.';

-- ======================
-- TABLE : CORPORATIONS
-- ======================
CREATE TABLE public.corporations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  corp_name TEXT NOT NULL,
  address TEXT,
  vat_number TEXT,
  country TEXT,
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.corporations IS 'Représente les entités corporate associées aux utilisateurs.';

COMMENT ON COLUMN public.corporations.id IS 'Identifiant unique de la société.';
COMMENT ON COLUMN public.corporations.profile_id IS 'ID du profil utilisateur propriétaire de la société.';
COMMENT ON COLUMN public.corporations.corp_name IS 'Nom légal de la société.';
COMMENT ON COLUMN public.corporations.address IS 'Adresse complète du siège social.';
COMMENT ON COLUMN public.corporations.vat_number IS 'Numéro de TVA ou équivalent.';
COMMENT ON COLUMN public.corporations.country IS 'Pays de domiciliation de la société.';
COMMENT ON COLUMN public.corporations.note IS 'Note interne ou commentaire sur la société.';
COMMENT ON COLUMN public.corporations.label IS 'Niveau d’importance ou d’alerte associé à la société.';
COMMENT ON COLUMN public.corporations.created_at IS 'Date de création de la fiche société.';
COMMENT ON COLUMN public.corporations.updated_at IS 'Date de dernière mise à jour.';

-- ======================
-- TABLE : AFFILIATIONS
-- ======================
CREATE TABLE public.affiliations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  affiliate_id VARCHAR(6) NOT NULL,
  godfather_id VARCHAR(6),
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.affiliations IS 'Gère les relations de parrainage (cooptation) entre utilisateurs, sur 2 niveaux hiérarchiques.';

COMMENT ON COLUMN public.affiliations.id IS 'Identifiant unique de l’affiliation.';
COMMENT ON COLUMN public.affiliations.profile_id IS 'UUID du profil affilié (filleul).';
COMMENT ON COLUMN public.affiliations.affiliate_id IS 'Code affilié du parrain (correspond à profiles.affiliate_id).';
COMMENT ON COLUMN public.affiliations.godfather_id IS 'Ancien code parrain si remplacement (historique ou tracking spécifique).';
COMMENT ON COLUMN public.affiliations.note IS 'Note interne ou commentaire sur l’affiliation.';
COMMENT ON COLUMN public.affiliations.label IS 'Niveau d’importance ou d’alerte associé à l’affiliation.';
COMMENT ON COLUMN public.affiliations.created_at IS 'Date de création de la relation de parrainage.';
COMMENT ON COLUMN public.affiliations.updated_at IS 'Date de dernière modification de l’affiliation.';

-- ======================
-- TABLE : CHALLENGES
-- ======================
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  name TEXT NOT NULL,
  challenge_num INTEGER NOT NULL,
  status challenge_status_enum DEFAULT 'open' NOT NULL,
  start_date DATE,
  end_date DATE,
  initial_balance INTEGER DEFAULT 0 CHECK (initial_balance >= 0),
  profit INTEGER DEFAULT 0,
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_challenge_per_user UNIQUE (profile_id, challenge_num)
);

COMMENT ON TABLE public.challenges IS 'Contient les informations liées aux challenges achetés par les utilisateurs.';

COMMENT ON COLUMN public.challenges.id IS 'Identifiant unique du challenge.';
COMMENT ON COLUMN public.challenges.profile_id IS 'UUID de l’utilisateur (profil) associé.';
COMMENT ON COLUMN public.challenges.name IS 'Nom du challenge (ex: Alpha, Bêta).';
COMMENT ON COLUMN public.challenges.challenge_num IS 'Numéro d’ordre du challenge pour un utilisateur (1er, 2e…).';
COMMENT ON COLUMN public.challenges.status IS 'Statut actuel du challenge (open, active, failed, etc.).';
COMMENT ON COLUMN public.challenges.start_date IS 'Date de début officielle du challenge.';
COMMENT ON COLUMN public.challenges.end_date IS 'Date de fin du challenge (le cas échéant).';
COMMENT ON COLUMN public.challenges.initial_balance IS 'Capital initial attribué au challenge.';
COMMENT ON COLUMN public.challenges.profit IS 'Profit réalisé à ce jour.';
COMMENT ON COLUMN public.challenges.note IS 'Commentaire libre (admin / système).';
COMMENT ON COLUMN public.challenges.label IS 'Niveau d’alerte pour le challenge (par défaut : none).';
COMMENT ON COLUMN public.challenges.created_at IS 'Date de création du challenge.';
COMMENT ON COLUMN public.challenges.updated_at IS 'Dernière date de modification du challenge.';

-- ===============================
-- TABLE : CHALLENGE_RESULTS
-- ===============================
CREATE TABLE public.challenge_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL,
  date DATE NOT NULL,
  daily_gain INTEGER DEFAULT 0 CHECK (daily_gain >= 0),
  daily_loss INTEGER DEFAULT 0 CHECK (daily_loss >= 0),
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_day_per_challenge UNIQUE (challenge_id, date)
);

COMMENT ON TABLE public.challenge_results IS 'Contient les résultats journaliers pour chaque challenge utilisateur.';

COMMENT ON COLUMN public.challenge_results.id IS 'Identifiant unique de l’entrée.';
COMMENT ON COLUMN public.challenge_results.challenge_id IS 'Référence au challenge associé.';
COMMENT ON COLUMN public.challenge_results.date IS 'Jour concerné par ces résultats.';
COMMENT ON COLUMN public.challenge_results.daily_gain IS 'Gain enregistré pour le jour (en points).';
COMMENT ON COLUMN public.challenge_results.daily_loss IS 'Perte enregistrée pour le jour (en points).';
COMMENT ON COLUMN public.challenge_results.note IS 'Commentaire libre ou explication.';
COMMENT ON COLUMN public.challenge_results.label IS 'Niveau d’alerte pour la journée (none si normal).';
COMMENT ON COLUMN public.challenge_results.created_at IS 'Date d’insertion de la ligne.';
COMMENT ON COLUMN public.challenge_results.updated_at IS 'Dernière mise à jour de l’entrée.';

-- ==========================
-- TABLE : PRODUCTS
-- ==========================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_in_tokens INTEGER NOT NULL CHECK (price_in_tokens >= 0),
  available BOOLEAN DEFAULT true,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.products IS 'Liste des produits disponibles à l’achat via tokens (ex. challenges, abonnements, outils).';

COMMENT ON COLUMN public.products.id IS 'Identifiant unique du produit.';
COMMENT ON COLUMN public.products.name IS 'Nom du produit (affiché dans la boutique).';
COMMENT ON COLUMN public.products.description IS 'Description détaillée du produit.';
COMMENT ON COLUMN public.products.price_in_tokens IS 'Prix du produit en nombre de tokens.';
COMMENT ON COLUMN public.products.available IS 'Indique si le produit est actuellement disponible à l’achat.';
COMMENT ON COLUMN public.products.label IS 'Niveau de priorité, de visibilité ou de traitement du produit.';
COMMENT ON COLUMN public.products.created_at IS 'Date de création de l’enregistrement.';
COMMENT ON COLUMN public.products.updated_at IS 'Dernière mise à jour.';

-- ==========================
-- TABLE : PURCHASES
-- ==========================
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_tokens INTEGER NOT NULL CHECK (total_tokens >= 0),
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.purchases IS 'Historique des achats effectués par les utilisateurs via tokens.';

COMMENT ON COLUMN public.purchases.id IS 'Identifiant unique de l’achat.';
COMMENT ON COLUMN public.purchases.profile_id IS 'Utilisateur ayant réalisé l’achat.';
COMMENT ON COLUMN public.purchases.product_id IS 'Produit acheté par l’utilisateur.';
COMMENT ON COLUMN public.purchases.quantity IS 'Quantité de produit achetée.';
COMMENT ON COLUMN public.purchases.total_tokens IS 'Coût total en tokens pour cette ligne d’achat.';
COMMENT ON COLUMN public.purchases.note IS 'Note administrative ou commentaire interne.';
COMMENT ON COLUMN public.purchases.label IS 'Étiquette de suivi ou d’alerte (support, fraude, etc.).';
COMMENT ON COLUMN public.purchases.created_at IS 'Date de création de l’enregistrement.';
COMMENT ON COLUMN public.purchases.updated_at IS 'Dernière mise à jour.';

-- ==========================
-- TABLE : INVOICES
-- ==========================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status invoice_status_enum DEFAULT 'open',
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.invoices IS 'Factures liées aux achats Stripe (tokens, challenges).';

COMMENT ON COLUMN public.invoices.id IS 'Identifiant unique de la facture.';
COMMENT ON COLUMN public.invoices.profile_id IS 'Utilisateur concerné par la facture.';
COMMENT ON COLUMN public.invoices.amount IS 'Montant total de la facture en centimes.';
COMMENT ON COLUMN public.invoices.status IS 'Statut actuel de la facture (en attente, payée, etc.).';
COMMENT ON COLUMN public.invoices.note IS 'Note administrative associée à cette facture.';
COMMENT ON COLUMN public.invoices.label IS 'Étiquette informative ou de suivi.';
COMMENT ON COLUMN public.invoices.created_at IS 'Date de création de la facture.';
COMMENT ON COLUMN public.invoices.updated_at IS 'Dernière mise à jour de la facture.';

-- ==========================
-- TABLE : PAYOUTS
-- ==========================
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  amount_tokens INTEGER NOT NULL CHECK (amount_tokens > 0),
  status payout_status_enum DEFAULT 'requested',
  requested_at TIMESTAMP DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMP,
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.payouts IS 'Demandes de retrait de tokens faites par les utilisateurs.';

COMMENT ON COLUMN public.payouts.id IS 'Identifiant unique de la demande de retrait.';
COMMENT ON COLUMN public.payouts.profile_id IS 'Utilisateur ayant demandé le retrait.';
COMMENT ON COLUMN public.payouts.amount_tokens IS 'Montant de tokens demandé pour le retrait.';
COMMENT ON COLUMN public.payouts.status IS 'Statut de la demande (en attente, validée, refusée, etc.).';
COMMENT ON COLUMN public.payouts.requested_at IS 'Date de soumission de la demande.';
COMMENT ON COLUMN public.payouts.processed_at IS 'Date à laquelle la demande a été traitée.';
COMMENT ON COLUMN public.payouts.note IS 'Note administrative liée au retrait.';
COMMENT ON COLUMN public.payouts.label IS 'Étiquette de suivi ou niveau de priorité.';
COMMENT ON COLUMN public.payouts.created_at IS 'Date de création de l’entrée.';
COMMENT ON COLUMN public.payouts.updated_at IS 'Date de dernière modification de l’entrée.';

-- ==========================
-- TABLE : TRANSACTIONS
-- ==========================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  type transaction_type_enum NOT NULL,
  ref_id UUID NOT NULL,
  status transaction_status_enum DEFAULT 'pending',
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.transactions IS 'Log global de toutes les transactions (achats, retraits, factures, etc.).';

COMMENT ON COLUMN public.transactions.id IS 'Identifiant unique de la transaction.';
COMMENT ON COLUMN public.transactions.profile_id IS 'Utilisateur concerné par la transaction.';
COMMENT ON COLUMN public.transactions.type IS 'Type de la transaction (achat, retrait, facture).';
COMMENT ON COLUMN public.transactions.ref_id IS 'Référence à l’élément lié (ex: invoice_id, payout_id).';
COMMENT ON COLUMN public.transactions.status IS 'Statut actuel de la transaction.';
COMMENT ON COLUMN public.transactions.note IS 'Note interne ou commentaire.';
COMMENT ON COLUMN public.transactions.label IS 'Étiquette de priorité ou suivi.';
COMMENT ON COLUMN public.transactions.created_at IS 'Date de création de la transaction.';
COMMENT ON COLUMN public.transactions.updated_at IS 'Date de dernière mise à jour.';

-- ==========================
-- TABLE : HISTORY
-- ==========================
CREATE TABLE public.history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  challenge_id UUID NOT NULL,
  month DATE NOT NULL CHECK (EXTRACT(DAY FROM month) = 1),
  total_gain INTEGER DEFAULT 0 NOT NULL,
  total_loss INTEGER DEFAULT 0 NOT NULL,
  token_balance_snapshot INTEGER DEFAULT 0 NOT NULL,
  purchases INTEGER DEFAULT 0,
  payouts INTEGER DEFAULT 0,
  invoices INTEGER DEFAULT 0,
  affiliate_count INTEGER DEFAULT 0,
  note TEXT,
  label label_enum DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.history IS 'Historique mensuel consolidé des performances utilisateur/challenges.';

COMMENT ON COLUMN public.history.id IS 'Identifiant unique de l’entrée historique.';
COMMENT ON COLUMN public.history.profile_id IS 'Utilisateur concerné.';
COMMENT ON COLUMN public.history.challenge_id IS 'Challenge concerné (optionnel).';
COMMENT ON COLUMN public.history.month IS 'Date représentant le mois de la ligne d’historique (au 1er du mois).';
COMMENT ON COLUMN public.history.total_gain IS 'Gains totaux du mois.';
COMMENT ON COLUMN public.history.total_loss IS 'Pertes totales du mois.';
COMMENT ON COLUMN public.history.token_balance_snapshot IS 'Solde de tokens en fin de mois.';
COMMENT ON COLUMN public.history.purchases IS 'Nombre d’achats effectués pendant le mois.';
COMMENT ON COLUMN public.history.payouts IS 'Nombre de demandes de retrait effectuées.';
COMMENT ON COLUMN public.history.invoices IS 'Nombre de factures générées.';
COMMENT ON COLUMN public.history.affiliate_count IS 'Nombre de filleuls actifs sur le mois.';
COMMENT ON COLUMN public.history.note IS 'Commentaires libres.';
COMMENT ON COLUMN public.history.label IS 'Étiquette de priorité ou de signalement.';
COMMENT ON COLUMN public.history.created_at IS 'Date de création de l’enregistrement.';
COMMENT ON COLUMN public.history.updated_at IS 'Date de mise à jour de l’enregistrement.';

-- ==========================
-- CONSTRAINT : FOREIGN KEYS
-- ==========================

-- PROFILES → PROFILES & CORPORATIONS
ALTER TABLE public.profiles
ADD CONSTRAINT fk_godfather 
FOREIGN KEY (godfather_id) REFERENCES public.profiles(affiliate_id) ON DELETE SET NULL;

ALTER TABLE public.profiles
ADD CONSTRAINT fk_profiles_corp
FOREIGN KEY (corp_id) REFERENCES public.corporations(id) ON DELETE SET NULL;

-- CORPORATIONS → PROFILES
ALTER TABLE public.corporations
ADD CONSTRAINT fk_corp_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- AFFILIATIONS → PROFILES
ALTER TABLE public.affiliations
ADD CONSTRAINT fk_affil_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.affiliations
ADD CONSTRAINT fk_affil_affcode
FOREIGN KEY (affiliate_id) REFERENCES public.profiles(affiliate_id) ON DELETE CASCADE;

-- CHALLENGES → PROFILES
ALTER TABLE public.challenges
ADD CONSTRAINT fk_challenge_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- CHALLENGE_RESULTS → CHALLENGES
ALTER TABLE public.challenge_results
ADD CONSTRAINT fk_chalres_challenge
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

-- PURCHASES → PROFILES & PRODUCTS
ALTER TABLE public.purchases
ADD CONSTRAINT fk_purchase_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.purchases
ADD CONSTRAINT fk_purchase_product
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

-- INVOICES → PROFILES
ALTER TABLE public.invoices
ADD CONSTRAINT fk_invoice_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- PAYOUTS → PROFILES
ALTER TABLE public.payouts
ADD CONSTRAINT fk_payout_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- TRANSACTIONS → PROFILES
ALTER TABLE public.transactions
ADD CONSTRAINT fk_transaction_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- HISTORY → PROFILES & CHALLENGES
ALTER TABLE public.history
ADD CONSTRAINT fk_history_profile
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.history
ADD CONSTRAINT fk_history_challenge
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE SET NULL;
