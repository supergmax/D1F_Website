-- =====================================================
-- 99_SEED_DEV_DATA.SQL
-- Base de données D1F - DayOneFunded
-- Description : Données de test pour développement local
-- =====================================================


-- =====================================================
-- PROFILES 
-- =====================================================

INSERT INTO "public"."profiles" ("id", "first_name", "last_name", "email", "id_phone", "phone", "address", "billing_address", "country", "language", "affiliate_id", "godfather_id", "token_balance", "role", "photo_url", "corp_id", "error_location", "note", "label", "created_at", "updated_at") 
VALUES ('5b1b1668-bef9-4443-80d1-8d45cce2111e', 'Quentin', 'Duflaut', 'qd@d1f.test', '+33', '612345678', '123 rue Admin, Paris', '123 rue  Admin, Paris', 'France', 'fr', 'ADM001', null, '16000', 'admin', null, null, null, 'Admin principal du système.', 'none', '2025-05-16 09:17:11.459803', '2025-05-16 09:17:11.459803'), 
('857a6977-b31f-489b-b46b-6e4b955993d9', 'Gomes', 'Maxence', 'ts4staff@gmail.com', '+33', '751639120', null, null, 'France', 'fr', 'CWAXHB', 'ADM001', '500', 'user', null, null, null, null, 'none', '2025-05-18 20:36:38.467381', '2025-05-18 20:36:38.467381'), 
('872cef58-0941-448b-86f8-1e66ff7de94d', 'Teddy', 'Niobe', 'teddyniobepro@gmail.com', '+33', '667314756', null, null, 'France', 'fr', 'S9GO7G', 'ADM001', '2600', 'user', null, null, null, null, 'none', '2025-05-16 09:29:21.163457', '2025-05-16 09:29:21.163457');