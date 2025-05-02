# 📊 D1F - Base de données Supabase

Ce projet configure une base de données PostgreSQL complète pour l'application **DayOneFunded (D1F)**, incluant la gestion des utilisateurs, challenges, affiliation, paiements, et performances.

---

## 📦 Structure des fichiers SQL

Les fichiers SQL sont rangés dans le dossier `/sql`, dans l’ordre suivant :

| Fichier                      | Contenu principal                              |
|-----------------------------|-------------------------------------------------|
| `01_schema_core.sql`        | Tables, enums, contraintes, commentaires        |
| `02_views.sql`              | Vues pour admin, users, perfs et erreurs        |
| `03_functions.sql`          | Fonctions : archivage mensuel, reset perfs      |
| `04_triggers.sql`           | Triggers : affiliate_id, profit, solde          |
| `05_policies.sql`           | Row-Level Security (RLS) et droits par rôle     |
| `06_roles_setup.sql`        | Configuration des rôles Supabase (JWT claims)   |
| `99_seed_dev_data.sql`      | Données de test (user, admin, produit, etc.)    |

---

## 🚀 Initialisation

### Prérequis

- Supabase CLI installée (`https://supabase.com/docs/guides/cli`)
- Projet Supabase existant
- Connexion CLI :
  ```bash
  supabase login
  supabase link --project-ref <votre_project_ref>
