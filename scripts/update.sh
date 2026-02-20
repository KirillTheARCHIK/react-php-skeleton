#!/bin/sh
## Запуск контейнера
docker-compose -f docker-compose.yml up -d --build
## Скачивание библиотек и сборка фронта
docker-compose exec php bun i
docker-compose exec php bun run build
## Скачивание библиотек для бека
docker-compose exec php composer install --working-dir=./back
## Перезапуск с очисткой кэша
docker-compose exec php composer dump-autoload --no-dev --classmap-authoritative --working-dir=./back
docker-compose exec php back/bin/console cache:clear
docker-compose restart php
## Миграция базы данных (применение изменений таблиц)
docker-compose exec php back/bin/console doctrine:migrations:migrate -n