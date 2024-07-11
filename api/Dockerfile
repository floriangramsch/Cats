# Dockerfile
FROM php:8.2-apache

# Installiere Systemabhängigkeiten und PHP-Erweiterungen
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libonig-dev \
    && docker-php-ext-install pdo pdo_mysql

# Aktiviere den mod_rewrite
RUN a2enmod rewrite

# Setze das Arbeitsverzeichnis
WORKDIR /var/www/html

# Kopiere API-Code in das Image
COPY . /var/www/html/

# Kopiere die .htaccess-Datei in das Image
COPY .htaccess /var/www/html/.htaccess

# Setze den ServerName um die Warnung zu unterdrücken
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Exponiere Port 80 für Apache
EXPOSE 80
