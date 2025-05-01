init:
	npm install
	npm run db:init

dev:
	npm run dev

build:
	npm run build

reset:
	npm run db:reset
	npm run db:init

db:
	npm run db:push

studio:
	npm run studio
