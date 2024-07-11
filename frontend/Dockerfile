# Dockerfile für das Frontend
FROM node:18-alpine

# Arbeitsverzeichnis erstellen
WORKDIR /usr/src/app

# Kopiere Frontend-Code ins Image
COPY . .

# Installiere Abhängigkeiten
RUN npm install

# Installiere live-server
RUN npm install -g live-server

# Exponiere Port 8080 für live-server
EXPOSE 8080

# Starte live-server
CMD ["live-server", "--watch=frontend", "--no-browser", "--host=0.0.0.0"]
