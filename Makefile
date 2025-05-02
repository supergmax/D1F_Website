# Installation complète
init:
	npm install
	npm run db:init

# Lancer le dev
dev:
	npm run dev

# Construire le projet
build:
	npm run build

# Nettoyer + réinitialiser + relancer
reset:
	npm run db:reset
	npm run db:init
	npm run clean
	npm install
	npm run dev

# Pousser la DB Supabase
db:
	npm run db:push

# Supabase Studio
studio:
	npm run studio

# Lancer l’ensemble local Supabase
supabase:
	npm run db:start
