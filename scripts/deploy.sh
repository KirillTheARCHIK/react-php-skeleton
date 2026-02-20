#!/bin/sh
## Запуск контейнера
docker-compose -f docker-compose.yml up -d --build
## Создание первоначального конфигурационного файла и env
docker-compose exec php cp back/config/app.yaml.dist back/config/app.yaml
docker-compose exec php touch back/var/log/cron.log
docker-compose exec php cp back/.env.docker.dist back/.env.local
## Скачивание библиотек и сборка фронта
docker-compose exec php bun i
docker-compose exec php bun run build
## Скачивание библиотек для бека
docker-compose exec php composer install --working-dir=./back
## Перезапуск с очисткой кэша
docker-compose exec php composer dump-autoload --no-dev --classmap-authoritative --working-dir=./back
docker-compose exec php back/bin/console cache:clear
docker-compose restart php
## Создание базы данных
docker-compose exec -T php back/bin/console doctrine:database:drop --force
docker-compose exec -T php back/bin/console doctrine:database:create
## Миграция базы данных (применение изменений таблиц)
docker-compose exec php back/bin/console doctrine:migrations:migrate -n