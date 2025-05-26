# WithUsFounded (aka D1F)

## Présentation

Bienvenue sur WithUsFounded (aka D1F) ! Ce projet est une plateforme conçue pour permettre aux traders d'acheter et de gérer des challenges de trading. Elle offre également des fonctionnalités pour l'affiliation et l'administration de la plateforme.

Notre public cible comprend :
*   Les traders cherchant à tester et prouver leurs compétences.
*   Les administrateurs de la plateforme gérant les utilisateurs, les challenges et les affiliations.

### Stack Technique

Le projet est construit avec les technologies suivantes :
*   **Frontend:** Next.js 15, React 19, Tailwind CSS
*   **Backend & Base de données:** Supabase (Authentification et base de données PostgreSQL)
*   **Langage:** TypeScript

## Fonctionnalités

### Authentification Complète
Le système d'authentification robuste et sécurisé inclut :
*   **Inscription des utilisateurs :** Processus de création de compte simple et sécurisé.
*   **Connexion :** Accès sécurisé pour les utilisateurs enregistrés.
*   **Réinitialisation de mot de passe :** Fonctionnalité permettant aux utilisateurs de réinitialiser leur mot de passe oublié.
*   **Changement d’e-mail :** Possibilité pour les utilisateurs de mettre à jour leur adresse e-mail.
*   **Lien magique (Magic Link) :** Connexion sans mot de passe via un lien unique envoyé par e-mail.
*   **Garde de routes (Route Guards) :** Protection des routes de l'application basée sur l'état de la session utilisateur et son rôle, assurant que seuls les utilisateurs autorisés peuvent accéder à certaines sections.

### Gestion des Rôles
La plateforme définit plusieurs rôles utilisateurs pour une gestion affinée des accès et des permissions :
*   **user :** Rôle standard pour les traders utilisant la plateforme.
*   **admin :** Accès étendu pour la gestion de la plateforme, des utilisateurs et des challenges.
*   **superadmin :** Contrôle total sur le système, y compris la configuration et la gestion des administrateurs. (Note: Ce rôle est défini dans le schéma mais son implémentation spécifique peut varier).
*   **support :** Accès dédié pour l'assistance utilisateur et la résolution de problèmes. (Note: Ce rôle est défini dans le schéma mais son implémentation spécifique peut varier).

### Gestion des Achats
*   **Achat de produits :** Interface permettant aux utilisateurs d'acheter divers produits (comme des challenges de trading) en utilisant un système de tokens ou d'autres méthodes de paiement.
*   **Gestion des factures :** Génération et suivi des factures pour chaque achat.
*   **Gestion des paiements :** Traitement sécurisé des paiements.
*   **Suivi des transactions :** Historique détaillé de toutes les transactions financières.

### Interface Administrateur Sécurisée
Une interface dédiée et sécurisée pour les administrateurs et superadministrateurs permettant de :
*   Gérer les utilisateurs et leurs rôles.
*   Configurer les produits et les challenges.
*   Suivre l'activité de la plateforme.
*   Modérer le contenu et gérer les affiliations.

### Interface Utilisateur (Dashboard)
Un tableau de bord personnalisé pour les utilisateurs (`user`) offrant :
*   **Vue d'ensemble :** Accès rapide aux informations clés du compte et aux performances.
*   **Historique des challenges :** Suivi détaillé des challenges passés et en cours.
*   **Historique des achats :** Visualisation de tous les achats effectués.
*   **Suivi des performances :** Analyse des résultats de trading et progression.

### Module d'Affiliation
Un système d'affiliation complet :
*   **Référencement :** Permet aux utilisateurs de parrainer de nouveaux membres.
*   **Hiérarchie :** Gestion des relations de parrainage sur plusieurs niveaux (si applicable), avec suivi des commissions ou avantages liés.

### Historique Consolidé Mensuel
*   Génération de rapports mensuels consolidés pour les utilisateurs, résumant leurs activités, performances de trading, gains, pertes, et évolution de leur solde.

## Structure du Projet

L'architecture du projet est conçue pour être modulaire et maintenable, en séparant clairement les préoccupations. Voici une description des principaux répertoires et de leur rôle :

*   **`app/**/page.tsx`**: Ces fichiers représentent les points d'entrée pour chaque route de l'application (par exemple, `/dashboard`, `/profile`, `/admin/users`). Ils sont responsables de :
    *   L'affichage principal de la page.
    *   Le chargement initial des données nécessaires à la page, souvent en utilisant des Server Components ou en appelant des hooks qui eux-mêmes interagissent avec les services.

*   **`components/*`**: Ce répertoire contient tous les composants React réutilisables. Ces composants sont conçus pour être **100% visuels et découplés de la logique métier spécifique à une page**.
    *   Ils reçoivent des données et des fonctions de rappel (callbacks) via leurs props.
    *   Ils ne doivent pas effectuer d'appels directs à des services ou contenir de la logique métier complexe.
    *   Exemples : boutons, formulaires génériques, cartes d'information, éléments de mise en page.

*   **`hooks/useX.ts`**: Les hooks personnalisés (préfixés par `use`) encapsulent la **logique métier** et la gestion de l'état local ou complexe lié à une fonctionnalité ou à un ensemble de composants.
    *   Ils peuvent interagir avec les services pour récupérer ou modifier des données.
    *   Ils fournissent une interface simplifiée aux composants et aux pages pour accéder à la logique et aux données.
    *   Exemple : `useUserProfile` pourrait gérer la récupération des données du profil utilisateur, la mise à jour de ces données, et la gestion des états de chargement et d'erreur.

*   **`services/*.ts`**: Ces fichiers sont responsables de toutes les interactions avec la base de données Supabase (ou toute autre API externe).
    *   Ils contiennent les fonctions pour les opérations CRUD (Create, Read, Update, Delete), ainsi que toute autre logique d'accès aux données.
    *   Ils utilisent le client Supabase configuré pour effectuer les requêtes.
    *   Exemple : `userService.ts` pourrait contenir des fonctions comme `getUserById(id)`, `updateUserProfile(profileData)`, `getAllUsers()`.

*   **`contexts/*`**: Les contextes React sont utilisés pour le **stockage de l'état global** de l'application, accessible depuis différentes parties de l'arborescence des composants sans avoir à passer les props manuellement à chaque niveau.
    *   Utile pour des états comme l'authentification de l'utilisateur (`AuthContext`), la langue sélectionnée (`LanguageContext`), ou les préférences du thème (`ThemeContext`).

*   **`lib/supabaseClient.ts`**: Ce fichier centralise la **configuration et l'initialisation du client Supabase**. Toutes les interactions avec Supabase dans les services passent par l'instance client exportée par ce fichier.

### Exemple d'Organisation Typique d'une Page

Prenons l'exemple d'une page affichant et permettant de modifier le profil d'un utilisateur :

1.  **Route & Affichage Principal (`app/profile/page.tsx`)** :
    *   Définit la structure générale de la page du profil.
    *   Utilise le hook `useUserProfile` pour obtenir les données de l'utilisateur et les fonctions de mise à jour.
    *   Passe les données et les fonctions aux composants visuels.

    ```tsx
    // app/profile/page.tsx
    'use client'; // Si interaction client nécessaire pour le hook
    import UserProfileDisplay from '@/components/profile/UserProfileDisplay';
    import UserProfileForm from '@/components/profile/UserProfileForm';
    import useUserProfile from '@/hooks/useUserProfile';

    export default function ProfilePage() {
      const { user, isLoading, error, updateUser } = useUserProfile();

      if (isLoading) return <p>Chargement...</p>;
      if (error) return <p>Erreur: {error.message}</p>;
      if (!user) return <p>Aucun utilisateur trouvé.</p>;

      return (
        <div>
          <h1>Profil de {user.firstName}</h1>
          <UserProfileDisplay user={user} />
          <h2>Modifier le profil</h2>
          <UserProfileForm initialData={user} onSubmit={updateUser} />
        </div>
      );
    }
    ```

2.  **Composants Visuels (`components/profile/UserProfileDisplay.tsx`, `components/profile/UserProfileForm.tsx`)** :
    *   `UserProfileDisplay.tsx`: Affiche les informations de l'utilisateur (reçoit `user` en props).
    *   `UserProfileForm.tsx`: Formulaire permettant de modifier les informations (reçoit `initialData` et `onSubmit` en props). Ces composants sont purement présentatifs.

3.  **Logique Métier (`hooks/useUserProfile.ts`)** :
    *   Gère l'état du profil utilisateur (données, chargement, erreurs).
    *   Expose une fonction `updateUser` qui appelle le service approprié.
    *   Utilise `userService` pour interagir avec Supabase.

    ```typescript
    // hooks/useUserProfile.ts
    import { useState, useEffect }sfrom 'react';
    import { getUserProfile, updateUserProfile } from '@/services/userService'; // Supposons que userService existe
    // import { type UserProfile } from '@/types'; // Supposons un type UserProfile

    export default function useUserProfile() {
      const [user, setUser] = useState<any | null>(null); // Remplacez 'any' par UserProfile
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<Error | null>(null);

      useEffect(() => {
        async function loadProfile() {
          try {
            setIsLoading(true);
            // Idéalement, obtenir l'ID de l'utilisateur authentifié
            const profileData = await getUserProfile("user-id-placeholder");
            setUser(profileData);
          } catch (err) {
            setError(err as Error);
          } finally {
            setIsLoading(false);
          }
        }
        loadProfile();
      }, []);

      const updateUser = async (profileData: any) => { // Remplacez 'any' par Partial<UserProfile>
        try {
          setIsLoading(true);
          const updatedUser = await updateUserProfile("user-id-placeholder", profileData);
          setUser(updatedUser);
          return updatedUser;
        } catch (err) {
          setError(err as Error);
          throw err;
        } finally {
          setIsLoading(false);
        }
      };

      return { user, isLoading, error, updateUser };
    }
    ```

4.  **Service d'Accès aux Données (`services/userService.ts`)** :
    *   Contient les fonctions `getUserProfile(userId)` et `updateUserProfile(userId, data)`.
    *   Ces fonctions utilisent `supabaseClient` pour faire les requêtes à la table `profiles` de Supabase.

    ```typescript
    // services/userService.ts
    import { supabase } from '@/lib/supabaseClient';
    // import { type UserProfile } from '@/types'; // Supposons un type UserProfile

    export async function getUserProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    }

    export async function updateUserProfile(userId: string, profileData: any) { // Remplacez 'any' par Partial<UserProfile>
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    ```

5.  **Client Supabase (`lib/supabaseClient.ts`)** :
    *   Configure et exporte l'instance `supabase` utilisée par `userService.ts`.

Cette structure favorise la séparation des préoccupations, rendant le code plus facile à comprendre, à tester et à faire évoluer.

## Installation

Suivez ces étapes pour configurer et lancer le projet en local en utilisant Supabase Cloud pour le backend.

### Prérequis Système

*   **Node.js**: Assurez-vous d'avoir Node.js installé. La version LTS est recommandée (par exemple, v18.x ou v20.x). Vous pouvez le télécharger depuis [nodejs.org](https://nodejs.org/).
*   **npm**: npm (Node Package Manager) est inclus avec Node.js.
*   **Supabase CLI (Facultatif)**: Bien que non strictement nécessaire pour se connecter à une instance Supabase Cloud existante, la CLI Supabase peut être utile pour la gestion de migrations ou le développement local avancé avec Supabase. Instructions d'installation : [Supabase CLI Docs](https://supabase.com/docs/guides/cli).

### Étapes d'Installation

1.  **Cloner le dépôt de code :**
    Si vous avez accès au dépôt GitHub, clonez-le sur votre machine locale :
    ```bash
    git clone [URL_DU_DEPOT_GIT] # Remplacez [URL_DU_DEPOT_GIT] par l'URL réelle
    cd [NOM_DU_REPERTOIRE_PROJET] # Remplacez [NOM_DU_REPERTOIRE_PROJET]
    ```

2.  **Installer les dépendances du projet :**
    Naviguez jusqu'au répertoire racine du projet et exécutez la commande suivante pour installer toutes les dépendances nécessaires définies dans `package.json` :
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement (Supabase Cloud) :**
    Le projet nécessite des clés d'API pour se connecter à votre instance Supabase.
    *   Copiez le fichier d'exemple `.env.local.example` et renommez la copie en `.env.local` :
        ```bash
        cp .env.local.example .env.local
        ```
    *   Ouvrez le fichier `.env.local` et mettez à jour les valeurs suivantes avec vos propres clés d'API Supabase :
        ```
        NEXT_PUBLIC_SUPABASE_URL="VOTRE_SUPABASE_URL"
        NEXT_PUBLIC_SUPABASE_ANON_KEY="VOTRE_SUPABASE_ANON_KEY"
        # SUPABASE_SERVICE_ROLE_KEY="VOTRE_SUPABASE_SERVICE_ROLE_KEY" # Optionnel, si des opérations spécifiques le nécessitent côté serveur
        ```
        Vous trouverez `VOTRE_SUPABASE_URL` et `VOTRE_SUPABASE_ANON_KEY` dans les paramètres de votre projet Supabase, sous "API". La `SUPABASE_SERVICE_ROLE_KEY` est également disponible au même endroit mais doit être utilisée avec précaution.

4.  **Appliquer les migrations de base de données (si nécessaire) :**
    Les fichiers de schéma SQL (`supabase/schema.sql`, `supabase/02_VIEWS.sql`, etc.) définissent la structure de la base de données.
    *   **Pour une nouvelle instance Supabase Cloud :** Vous devrez exécuter ces scripts SQL via l'éditeur SQL dans le tableau de bord de votre projet Supabase pour créer les tables, les vues, les fonctions, etc. Exécutez-les dans l'ordre numérique indiqué par leur nom de fichier.
    *   **Pour une instance existante :** Assurez-vous que votre base de données Cloud est à jour avec le schéma défini dans ces fichiers.

5.  **Lancer le projet en mode développement :**
    Une fois les dépendances installées et les variables d'environnement configurées, vous pouvez démarrer le serveur de développement Next.js :
    ```bash
    npm run dev
    ```
    L'application devrait maintenant être accessible à l'adresse [http://localhost:3000](http://localhost:3000) (ou un autre port si le port 3000 est déjà utilisé).

Vous êtes maintenant prêt à développer ! Les modifications apportées aux fichiers source entraîneront une actualisation automatique de l'application dans votre navigateur.

## Utilisation de Supabase

Ce projet utilise **Supabase Cloud** comme solution backend, fournissant la base de données PostgreSQL, l'authentification, et d'autres services backend.

### Base de Données

La base de données Supabase est au cœur de l'application, stockant toutes les données persistantes. L'interaction avec la base de données depuis l'application Next.js se fait via le client JavaScript de Supabase (`@supabase/supabase-js`), principalement au sein des fichiers `services/*.ts`.

#### Tables Clés

Voici quelques-unes des tables principales dans le schéma de la base de données :

*   **`auth.users`**: Gérée par Supabase Auth, cette table stocke les informations d'authentification des utilisateurs (email, mot de passe haché, etc.).
*   **`public.profiles`**: Étend `auth.users` avec des informations de profil spécifiques à l'application (nom, prénom, rôle, solde de tokens, informations de parrainage, etc.). Chaque utilisateur dans `auth.users` a une entrée correspondante dans `public.profiles`.
*   **`public.products`**: Contient la liste des produits disponibles à l'achat (par exemple, les challenges de trading), avec leurs prix et descriptions.
*   **`public.purchases`**: Enregistre chaque achat effectué par un utilisateur, liant un profil à un produit et spécifiant la quantité et le coût.
*   **`public.challenges`**: Stocke les informations sur les challenges de trading achetés par les utilisateurs, y compris leur statut, dates, et soldes initiaux.
*   **`public.challenge_results`**: Contient les résultats journaliers des challenges actifs.
*   **`public.invoices`**: Garde une trace des factures générées pour les achats.
*   **`public.payouts`**: Enregistre les demandes de retrait de fonds par les utilisateurs.
*   **`public.transactions`**: Log global de toutes les opérations financières (achats, retraits, factures) pour assurer la traçabilité.
*   **`public.affiliations`**: Gère les relations de parrainage entre utilisateurs.
*   **`public.history`**: Historique mensuel consolidé des performances et activités des utilisateurs.

La structure complète, y compris les types `ENUM`, les contraintes de clé étrangère (FK), et les commentaires sur les colonnes, est définie dans `supabase/schema.sql`.

### Fichiers SQL dans `supabase/`

Le répertoire `supabase/` contient plusieurs fichiers SQL cruciaux pour définir, initialiser et maintenir la base de données :

*   **`supabase/schema.sql`**: Ce fichier est le schéma principal de la base de données. Il définit la structure de toutes les tables personnalisées dans le schéma `public` (comme `profiles`, `products`, `purchases`, etc.), y compris leurs colonnes, types de données, contraintes (clés primaires, clés étrangères, `CHECK`), et les types `ENUM` personnalisés. C'est la référence pour la structure de la base.

*   **`supabase/02_VIEWS.sql`**: Contient les définitions des vues SQL (`VIEW`). Les vues sont des requêtes stockées qui peuvent simplifier des requêtes complexes et récurrentes, ou présenter les données d'une manière spécifique sans stocker physiquement ces données de manière redondante.

*   **`supabase/03_FUNCTIONS_AND_TRGGERS.sql`**: Ce fichier est essentiel pour la logique métier implémentée directement au niveau de la base de données. Il inclut :
    *   **Fonctions PostgreSQL (`FUNCTION`)**: Procédures stockées qui peuvent être appelées pour effectuer des opérations complexes, des calculs, ou des manipulations de données.
    *   **Déclencheurs (`TRIGGER`)**: Actions automatiques qui sont exécutées en réponse à certains événements sur les tables (par exemple, `INSERT`, `UPDATE`, `DELETE`). Ils sont souvent utilisés pour maintenir l'intégrité des données, l'audit, ou automatiser des tâches (comme la création d'un profil lorsqu'un nouvel utilisateur s'inscrit via `auth.users`).

*   **`supabase/04_POLICIES.sql`**: Définit les politiques de sécurité au niveau des lignes (Row Level Security - RLS) pour les tables. Les politiques RLS sont une fonctionnalité puissante de PostgreSQL (et donc de Supabase) qui contrôle quelles lignes les utilisateurs peuvent accéder ou modifier, en fonction de leur session, de leur rôle, ou d'autres critères. C'est un aspect fondamental de la sécurisation des données dans Supabase.

*   **`supabase/05_ROLES_SETUPS.sql`**: Configure les rôles personnalisés au sein de la base de données PostgreSQL, au-delà des rôles standards. Cela peut inclure la définition de nouveaux rôles et l'attribution de permissions spécifiques (`GRANT`/`REVOKE`) sur les schémas, tables, fonctions, etc., pour affiner le contrôle d'accès.

*   **`supabase/seed.sql`**: Contient des instructions SQL pour insérer des données initiales ou de test dans la base de données. Ceci est utile pour peupler la base avec des exemples de produits, d'utilisateurs de test, etc., afin de faciliter le développement et les tests de l'application.

L'ordre numérique des fichiers (02, 03, 04, 05) suggère une séquence d'application lors de la configuration initiale de la base de données ou lors de migrations.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Déploiement

Cette application Next.js est conçue pour être déployée sur des plateformes modernes supportant les applications Node.js, telles que Vercel (par les créateurs de Next.js), Netlify, AWS Amplify, ou d'autres services similaires.

### Plateforme Recommandée : Vercel

Vercel est la plateforme recommandée pour le déploiement en raison de son intégration native avec Next.js.

1.  **Connecter votre dépôt Git :**
    *   Créez un compte sur [Vercel](https://vercel.com) et connectez votre dépôt Git (GitHub, GitLab, Bitbucket) où se trouve le projet.

2.  **Configuration du Projet sur Vercel :**
    *   Vercel détecte automatiquement qu'il s'agit d'un projet Next.js et configure les paramètres de build par défaut (`npm run build`).
    *   Le framework preset devrait être "Next.js".
    *   Le répertoire racine est généralement la racine de votre dépôt.

3.  **Configuration des Variables d'Environnement :**
    C'est l'étape la plus cruciale pour un déploiement réussi. Les variables d'environnement nécessaires au fonctionnement de l'application en production doivent être configurées dans les paramètres du projet sur Vercel (ou la plateforme de votre choix).
    *   Référez-vous au fichier `.env.local.example` à la racine du projet pour la liste complète des variables d'environnement requises.
    *   **Variables Supabase :**
        *   `NEXT_PUBLIC_SUPABASE_URL`: L'URL de votre projet Supabase.
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: La clé anonyme (publique) de votre projet Supabase.
        *   `SUPABASE_SERVICE_ROLE_KEY`: (Si utilisée pour des opérations backend spécifiques nécessitant des droits élevés) La clé de service de Supabase. **Cette clé est secrète et ne doit jamais être exposée côté client.**
    *   **Variables Stripe (si applicable) :**
        *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Votre clé publique Stripe.
        *   `STRIPE_SECRET_KEY`: Votre clé secrète Stripe. **Cette clé est secrète.**
    *   **Autres URLs et variables :**
        *   `NEXT_PUBLIC_APP_URL`: L'URL de base de votre application déployée (par exemple, `https://www.votre-domaine.com`).
        *   Toute autre variable spécifique à votre configuration (par exemple, pour des services d'emailing, d'analyse, etc.).

    Sur Vercel, ces variables se configurent dans "Settings" > "Environment Variables". Assurez-vous de configurer les variables pour les environnements appropriés (Production, Preview, Development).

4.  **Déployer :**
    *   Une fois configuré, Vercel déploiera automatiquement votre projet à chaque `git push` sur la branche principale (et pour les Pull Requests si configuré).
    *   Vous pouvez également déclencher des déploiements manuellement depuis le tableau de bord Vercel.

### Base de Données en Production

*   Assurez-vous que votre instance Supabase Cloud est correctement configurée pour la production.
*   Les migrations (fichiers SQL dans `supabase/`) doivent avoir été appliquées à votre base de données de production.
*   Vérifiez les politiques RLS (`supabase/04_POLICIES.sql`) pour vous assurer qu'elles sont adaptées à un environnement de production et sécurisent correctement l'accès aux données.

### Considérations Générales pour le Déploiement

*   **Build de Production :** La commande `npm run build` crée une version optimisée de votre application pour la production.
*   **HTTPS :** Les plateformes comme Vercel fournissent automatiquement des certificats SSL/TLS pour le HTTPS.
*   **Variables d'Environnement Côté Client vs Côté Serveur :**
    *   Les variables préfixées par `NEXT_PUBLIC_` sont accessibles côté client (dans le navigateur).
    *   Les variables non préfixées (comme `STRIPE_SECRET_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`) ne sont accessibles que côté serveur (fonctions serverless, API routes) et doivent rester secrètes.

## Sécurité

La sécurité est un aspect essentiel de cette application, mise en œuvre à plusieurs niveaux :

### Protection des Routes et Contrôle d'Accès

*   **Guards d'Authentification (Client-Side) :**
    *   Chaque layout principal de l'application (par exemple, `/user/dashboard`, `/admin/overview`) est protégé par un guard d'authentification spécifique (`useAuthGuard` pour les utilisateurs, `useAdminGuard` pour les administrateurs).
    *   Ces guards, implémentés comme des hooks React (`hooks/useAuthGuard.ts`, `hooks/useAdminGuard.ts`), vérifient la session utilisateur active et le rôle de l'utilisateur avant de permettre l'accès à la page demandée.
    *   Si un utilisateur non authentifié tente d'accéder à une page protégée, il est redirigé vers la page de connexion.

*   **Redirections Conditionnelles Basées sur le Rôle :**
    *   En plus de la protection par authentification, les guards effectuent des redirections basées sur le rôle de l'utilisateur.
    *   Par exemple, un utilisateur avec le rôle `user` tentant d'accéder à une route d'administration (`/admin/*`) sera redirigé vers son propre tableau de bord ou une page d'erreur appropriée.
    *   De même, un administrateur pourrait être redirigé vers le tableau de bord admin principal s'il accède à une URL utilisateur non pertinente pour son rôle.

*   **Statut du Middleware (`middleware.ts`) :**
    *   Initialement, un middleware Next.js (`middleware.ts`) avait été envisagé pour la protection des routes.
    *   Cependant, la stratégie actuelle privilégie les **guards côté client** (via les hooks React mentionnés ci-dessus) pour une gestion plus flexible et intégrée avec l'état de l'application React (notamment `AuthContext`).
    *   Le fichier `middleware.ts` peut donc être désactivé ou ne pas être utilisé pour la logique de redirection principale, au profit des guards client qui s'appuient sur `AuthContext` pour des décisions d'accès en temps réel.

### Gestion des Tokens et Sessions

*   **Supabase Auth :**
    *   La gestion des sessions utilisateur et des tokens JWT (JSON Web Tokens) est entièrement déléguée à Supabase Auth.
    *   Supabase gère de manière sécurisée la création, le rafraîchissement et la révocation des tokens.
    *   Les tokens JWT sont stockés de manière sécurisée (généralement dans `localStorage` ou `sessionStorage` par le client Supabase) et sont automatiquement envoyés avec chaque requête à l'API Supabase.

*   **`AuthContext` React :**
    *   Un contexte React (`contexts/AuthContext.tsx` - nom de fichier supposé) est utilisé pour gérer l'état de l'authentification de l'utilisateur à travers l'application.
    *   Ce contexte s'abonne aux changements d'état d'authentification de Supabase (`onAuthStateChange`) et met à jour l'état de l'utilisateur (session, profil) en conséquence.
    *   Les composants, et notamment les guards d'authentification, consomment ce contexte pour obtenir les informations sur l'utilisateur authentifié et prendre des décisions d'accès.

### Sécurité de la Base de Données

*   **Politiques RLS (Row Level Security) :**
    *   Comme mentionné dans la section "Utilisation de Supabase", les politiques RLS sont configurées au niveau de la base de données PostgreSQL (voir `supabase/04_POLICIES.sql`).
    *   Ces politiques garantissent que même si une requête parvenait à contourner la logique applicative, l'accès aux données au niveau de la base serait toujours restreint en fonction de l'UID de l'utilisateur authentifié et/ou de son rôle.

### Variables d'Environnement

*   Les clés sensibles (clés API Supabase, clés Stripe, etc.) sont gérées via des variables d'environnement et ne sont pas incluses directement dans le code source, conformément aux bonnes pratiques (voir section "Déploiement").

En combinant ces approches (guards client, gestion des tokens par Supabase, politiques RLS, et gestion sécurisée des secrets), l'application vise à assurer une protection robuste des données et des fonctionnalités.

## Multilingue (i18n)

L'application est conçue pour être accessible à un public international et supporte actuellement les langues suivantes :
*   **Anglais (en)** : Langue par défaut.
*   **Français (fr)**

### Mécanismes de Choix de la Langue

Plusieurs mécanismes permettent à l'utilisateur de choisir ou de définir sa langue préférée :

1.  **Profil Utilisateur (`public.profiles`) :**
    *   Le champ `language` dans la table `public.profiles` de la base de données Supabase stocke la préférence de langue de l'utilisateur enregistré (par exemple, `'en'` ou `'fr'`).
    *   Lorsqu'un utilisateur se connecte, cette préférence est chargée et appliquée.

2.  **Sélecteur de Langue (UI Toggle Switch) :**
    *   Une interface utilisateur, typiquement un interrupteur (toggle switch) ou un menu déroulant situé dans l'en-tête (header) de l'application, permet aux utilisateurs de changer de langue active à tout moment.

3.  **Stockage Local de la Préférence :**
    *   Lorsqu'un utilisateur (authentifié ou non) sélectionne une langue via le sélecteur, ce choix est persisté dans le stockage local du navigateur (par exemple, `localStorage` ou via des cookies).
    *   Cela garantit que la préférence linguistique est conservée entre les sessions, même pour les utilisateurs non connectés ou avant la connexion. L'ordre de priorité est généralement : choix via UI > profil utilisateur > détection du navigateur > langue par défaut.

### Gestion du Contenu Textuel

*   **Fichiers de Traduction :**
    *   Tout le contenu textuel de l'interface utilisateur (libellés de boutons, messages, titres, etc.) est externalisé dans des fichiers de traduction JSON.
    *   Ces fichiers sont vraisemblablement structurés par langue (par exemple, `/i18n/en.json`, `/i18n/fr.json`). Chaque fichier contient des paires clé-valeur où la clé est un identifiant de traduction et la valeur est le texte traduit dans la langue correspondante.
      ```json
      // Exemple de contenu dans /i18n/fr.json
      {
        "welcomeMessage": "Bienvenue sur Notre Application",
        "buttons": {
          "submit": "Soumettre",
          "cancel": "Annuler"
        }
      }
      ```

*   **Changement de Langue sans Rechargement :**
    *   Le changement de langue s'effectue dynamiquement, sans nécessiter un rechargement complet de la page, offrant une expérience utilisateur fluide.

### Accès aux Traductions dans les Composants

*   **Hook `useTranslation()` :**
    *   Les composants React accèdent aux traductions et à la fonction de changement de langue via un hook personnalisé, probablement nommé `useTranslation()` (fourni par une bibliothèque i18n comme `react-i18next` ou un équivalent personnalisé).
    *   Ce hook permet de récupérer la fonction de traduction `t()` qui prend une clé de traduction en argument et retourne la chaîne traduite dans la langue active.

    ```tsx
    // Exemple d'utilisation dans un composant React
    import React from 'react';
    // import { useTranslation } from 'react-i18next'; // ou un hook personnalisé

    function MyComponent() {
      // const { t, i18n } = useTranslation(); // Supposons que useTranslation est disponible

      // return <button>{t('buttons.submit')}</button>;
      return <button>Soumettre (Exemple)</button>; // Placeholder si t() n'est pas directement utilisable ici
    }
    ```

Cette approche structurée permet une gestion centralisée des traductions et facilite l'ajout de nouvelles langues à l'avenir.

## Crédits / Licence

### Auteur

Ce projet a été développé par **Maxence Gomes and Quentin Duflaut**.

### Stack Initiale et Inspirations

Le développement de ce projet a été initié en s'appuyant sur ou en s'inspirant des éléments suivants :

*   **TailAdmin Next.js Template :** Une partie de la structure initiale de l'interface utilisateur et des composants de base provient du template TailAdmin Next.js, qui a servi de point de départ pour le design et l'agencement.
    *   ([Lien vers TailAdmin si disponible, par exemple : https://tailadmin.com](https://tailadmin.com))
*   **Supabase Starter Kit / Next.js Supabase Examples :** La configuration initiale de l'intégration avec Supabase (client Supabase, gestion de l'authentification, exemples de requêtes) a été inspirée par les kits de démarrage et les exemples fournis par Supabase.
    *   ([Lien vers Supabase examples si pertinent, par exemple : https://github.com/supabase/supabase/tree/master/examples/nextjs-with-supabase](https://github.com/supabase/supabase/tree/master/examples/nextjs-with-supabase))

Nous remercions les créateurs et contributeurs de ces ressources pour leur travail qui a facilité le démarrage de ce projet.
