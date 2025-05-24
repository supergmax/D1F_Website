-- =====================================================
-- 06_ROLES_SETUP.SQL
-- Base de données D1F - DayOneFunded
-- Description : Configuration des rôles Supabase & sécurité JWT
-- =====================================================

-- Supabase gère les rôles applicatifs dans user_metadata
-- Exemple de payload d’utilisateur :
-- {
--   "user_metadata": {
--     "role": "admin"
--   }
-- }

-- Vous pouvez attribuer un rôle au moment de la création d’un utilisateur
-- via l’API Supabase ou le dashboard :

-- Exemple d'update via Supabase JS côté serveur (Node.js / Next.js)
-- await supabase.auth.admin.updateUserById(user_id, {
--   user_metadata: {
--     role: 'admin'
--   }
-- });

-- ==========================================
-- Ajout de rôle via SQL direct dans Supabase
-- ==========================================

-- Crée un utilisateur par défaut avec un rôle spécifique (pour développement)
-- Ne pas exécuter cette commande dans un environnement public sans sécurisation

-- Exemple : promotion manuelle d’un utilisateur via son UUID
-- Remplacez 'your-user-uuid-here' par le vrai UUID
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   raw_user_meta_data,
--   '{role}',
--   '"admin"'
-- )
-- WHERE id = 'your-user-uuid-here';

-- Une fois la metadata mise à jour, il faut rafraîchir le JWT du user (logout/login)

-- =============================
-- Vérification dans policies
-- =============================
-- auth.jwt() ->> 'role' = 'admin'

-- Cette expression est utilisée dans les `policies.sql` pour déterminer
-- si un utilisateur peut accéder ou non à certaines ressources

-- =============================
-- Sécurité du JWT
-- =============================
-- Supabase génère automatiquement le JWT avec user_metadata
-- C’est pourquoi vous n’avez pas besoin de table `roles` séparée,
-- sauf si vous souhaitez une gestion plus fine via relation SQL

-- =============================
-- Conseils :
-- =============================
-- ✅ Mettez en place un processus d’attribution automatique du rôle "user"
-- ✅ Restreignez l’usage du rôle "admin" au strict minimum
-- ✅ Ne donnez pas de token service_role côté client

-- =====================================================
-- V2
-- =====================================================

-- =====================================================
-- ÉTAPE 1 : Définir un rôle par défaut pour tous les nouveaux utilisateurs
-- =====================================================
-- Supabase permet d’injecter dynamiquement des métadonnées dans le JWT
-- Utilisons cette capacité pour attribuer automatiquement le rôle 'user'

-- Cette fonction s'exécute lors de l'inscription
-- (via Supabase Auth triggers automatiques)
-- Elle ne touche pas les utilisateurs créés manuellement côté DB

-- ⚠️ Cette configuration se fait côté **Supabase Studio** ou **API** :
-- Paramétrage dans Supabase > Auth > Settings > JWT > Default user_metadata

-- Exemple (dans Supabase Studio ou via API) :
-- {
--   "role": "user"
-- }

-- ⚠️ Si tu gères les inscriptions manuellement (via API Next.js par exemple),
-- pense à l’injecter explicitement :

-- Exemple via supabase-js (Node / Next.js) :
-- await supabase.auth.signUp({
--   email: 'user@example.com',
--   password: 'password',
--   options: {
--     data: { role: 'user' }
--   }
-- });

-- =====================================================
-- ÉTAPE 2 : Éviter que des utilisateurs aient un rôle inapproprié
-- =====================================================
-- Tu peux créer une vue pour vérifier les rôles anormaux :
-- CREATE OR REPLACE VIEW users_with_invalid_roles AS
-- SELECT id, email, raw_user_meta_data
-- FROM auth.users
-- WHERE (raw_user_meta_data ->> 'role') NOT IN ('user', 'admin', 'superadmin', 'support');
-- COMMENT ON VIEW users_with_invalid_roles IS 'Affiche les utilisateurs avec un rôle non autorisé.';

-- =====================================================
-- ÉTAPE 3 : Mise à jour manuelle d’un rôle (admin, support)
-- =====================================================
-- Ne faire cela que via le service backend ou CLI sécurisé

-- Exemple (remplacez l'UUID par celui du user concerné) :
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"')
-- WHERE id = '00000000-0000-0000-0000-000000000000';

-- =====================================================
-- CONSEILS PRATIQUES POUR LA GESTION DES RÔLES
-- =====================================================

-- ✅ Attribuer automatiquement le rôle "user" lors de l’inscription
-- → Cela permet de verrouiller les accès par défaut

-- ✅ Restreindre les rôles "admin", "superadmin" à des comptes validés
-- → Ces comptes doivent être créés via la console Supabase ou un dashboard interne sécurisé

-- ✅ Ne jamais exposer la clé API `service_role` côté frontend
-- → Cette clé peut contourner toutes les RLS
-- → Elle est destinée uniquement au backend (API Next.js / CRON)

-- ✅ Protéger les routes d’API sensibles avec vérification JWT
-- Exemple Next.js middleware :
-- ```ts
-- if (user.role !== 'admin') {
--   return res.status(403).json({ error: 'Access denied' });
-- }
-- ```

-- ✅ Utiliser les policies SQL en combinaison avec les rôles
-- → Voir 05_policies.sql

-- ✅ Contrôler le JWT actuel :
-- SELECT auth.jwt() ->> 'role';

-- ✅ Lister les utilisateurs par rôle :
-- SELECT id, email FROM auth.users WHERE raw_user_meta_data ->> 'role' = 'admin';

-- ✅ Gérer les changements de rôle par admin uniquement (via interface ou API privée)

-- Fin du fichier

