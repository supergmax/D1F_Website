#!/bin/bash

echo "📦 Installation des dépendances..."
npm install

echo "🔐 Connexion Supabase..."
supabase login

echo "🔗 Liaison au projet cloud..."
supabase link --project-ref zwxhkwgymrmupgnhaiii

echo "🧱 Déploiement de la base..."
npm run db:init

echo "🚀 Lancement du projet..."
npm run dev
