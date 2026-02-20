start: ## Запуск, можно добавить update=true, чтобы обновиться
	make docker-start
	@if [ $(update) = "true" ]; then \
		make app-update; \
	fi
	make front-start

docker-start: ##Запуск контейнера
	@if [ ! -r docker-compose.local.yml ]; then \
		echo "" > docker-compose.local.yml; \
	fi
	docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d --build

front-start: ##Старт фронта с хот релоадом
	docker-compose exec php bun dev

stop:
	docker-compose stop

app-update: ## Обновление запущеного контенера веб-приложения (пересборка, миграции)
	docker-compose exec php bun i
	docker-compose exec php composer install --working-dir=./back
	make autoload
	docker-compose restart php #restart when new cache (and restart fpm)
	make db-migrate

db-diff: ## Генерация файла миграции
	docker-compose exec php back/bin/console doctrine:migrations:diff

db-migrate: ## Миграции + фикстуры + создание представлений
	docker-compose exec php back/bin/console doctrine:migrations:migrate -n
# 	docker-compose exec php back/bin/console doctrine:fixtures:load -n --append

dump-restore: ## Восстановить базу по дампу, необходимо ввести параметр name=<название файла без .sql>
	docker-compose restart
	docker-compose exec -T php back/bin/console doctrine:database:drop --force
	docker-compose exec -T php back/bin/console doctrine:database:create
	docker-compose exec -T database psql -U postgres -d dev_test_db < back/dumps/$(name).sql
	make db-migrate

dump-create: ## Создать дампик
	mkdir back/dumps
	docker-compose exec database pg_dump -U postgres -d dev_test_db > back/dumps/db_$(STAND)$(shell date "+%y%m%d_%H%M").sql

migrate-to: ## Мигрировать до указанной версии, необходимо ввести параметр filename=<php файл без .php>
	docker-compose exec php back/bin/console doctrine:migrations:migrate 'DoctrineMigrations\$(filename)'

db-review:
	docker-compose exec php back/bin/console app:view:create

front-build:
	docker-compose exec php bun run build

autoload: ## Перезапуск с очисткой кэша
	docker-compose exec php composer dump-autoload --no-dev --classmap-authoritative --working-dir=./back
	docker-compose exec php back/bin/console cache:clear

config: ## Создание первоначального конфигурационного файла и env
	docker-compose exec php cp back/config/app.yaml.dist back/config/app.yaml
	docker-compose exec php touch back/var/log/cron.log
	docker-compose exec php cp back/.env.docker.dist back/.env.local

deploy:
	echo 'export STAND="local"' >> ~/.bashrc   ## Переменная окружения для других команд
	make docker-start
	make config
	docker-compose exec php bun i
	docker-compose exec php bun run build
	docker-compose exec php composer install --working-dir=./back
	make autoload
	docker-compose restart php #restart when new cache (and restart fpm)
	docker-compose exec -T php back/bin/console doctrine:database:drop --force
	docker-compose exec -T php back/bin/console doctrine:database:create
	make db-migrate
# 	make --file=make.mk.local dump-restore name=initial