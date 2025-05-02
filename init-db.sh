#!/bin/bash

# ============================================
# SCRIPT : init-db.sh
# Projet D1F - Initialisation complète de la base
# ============================================

echo "🚀 Initialisation de la base de données D1F..."

# Répertoire contenant les fichiers SQL
SQL_DIR="./supabase" # Change si besoin

# Liste des fichiers dans l'ordre d'exécution
FILES=(
  "01_SCHEMA_CORE.sql"
  "02_VIEWS.sql"
  "03_FUNCTIONS.sql"
  "04_TRIGGERS.sql"
  "05_POLICIES.sql"
  "06_ROLES_SETUPS.sql"
  "seed.sql"
)

# Si tu es connecté à Supabase CLI
for FILE in "${FILES[@]}"
do
  echo "📂 Exécution de : $FILE"
  supabase db push --file "$SQL_DIR/$FILE"
done

echo "✅ Base de données initialisée avec succès."
