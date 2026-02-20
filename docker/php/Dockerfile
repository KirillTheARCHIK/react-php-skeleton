FROM php:8.5.2-fpm-trixie

WORKDIR /var/www/symfony_docker

RUN mkdir "/var/www/.npm" && chown -R 1000:1000 "/var/www/.npm"
RUN mkdir "/var/www/.symfony5" && chown -R 1000:1000 "/var/www/.symfony5"
RUN mkdir "/var/www/.bun" && chown -R 1000:1000 "/var/www/.bun"

## Install additinal dependencies
RUN apt update
RUN apt install -y wget zlib1g-dev g++  \
    libicu-dev zip libzip-dev zip libxml2-dev  \
    libldb-dev libldap2-dev libpng-dev  \
    libpq-dev git zip cron sudo ca-certificates
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql
RUN docker-php-ext-install intl pdo_pgsql pgsql
RUN pecl update-channels
RUN pecl install apcu
RUN docker-php-ext-enable apcu
RUN docker-php-ext-configure zip
RUN docker-php-ext-install zip
RUN docker-php-ext-install zip
RUN docker-php-ext-install xml
RUN docker-php-ext-install gd
RUN pecl install xdebug

#Fixing user and permissions
RUN adduser www-data sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
ARG ARG_UID=1000
ARG ARG_GID=1000
ENV APP_USER="www-data"
ENV APP_GROUP="www-data"
RUN usermod -u ${ARG_UID} -s /bin/bash ${APP_USER} && groupmod -g ${ARG_GID} ${APP_GROUP}

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

# CacheTool - Manage cache in the CLI
RUN curl -sLO https://github.com/gordalina/cachetool/releases/latest/download/cachetool.phar

# Установка Bun для компиляции и запуска JS
RUN curl -fsSL https://bun.com/install | bash -s "bun-v1.2.18"
RUN mv /root/.bun/bin/bun /usr/local/bin/bun

# Сomposer
RUN curl -o /usr/local/bin/composer https://getcomposer.org/download/2.9.5/composer.phar && chmod a+x /usr/local/bin/composer 
RUN mkdir /var/www/.composer && chmod a+w /var/www/.composer