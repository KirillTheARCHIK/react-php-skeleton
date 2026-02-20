#!/bin/sh
dir=$(dirname $0)
$dir/bin/console cache:clear --env=prod
$dir/bin/console doctrine:database:drop --force
$dir/bin/console doctrine:database:create
$dir/bin/console doctrine:schema:create
$dir/bin/console doctrine:migrations:sync-metadata-storage
$dir/bin/console app:views:create
$dir/bin/console doctrine:migrations:version --add --all -n
$dir/bin/console doctrine:fixtures:load -n --env=prod
$dir/bin/console app:cron:write
$dir/bin/console app:config:load-defaults
chmod 777 $dir/config/app.yaml
