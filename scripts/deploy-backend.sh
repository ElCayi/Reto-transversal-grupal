#!/bin/bash
# Compila y despliega el backend Spring Boot en el VPS.
# Ejecutar como root o con sudo desde /opt/reto-eventos

set -e

REPO_DIR="/opt/reto-eventos"
SERVICE_NAME="reto-eventos-backend"
JAR_DEST="/opt/reto-eventos/app.jar"
JAR_BACKUP="/opt/reto-eventos/app.jar.bak"

echo "=== Deploy backend ==="

cd "$REPO_DIR"
git pull origin main

cd "$REPO_DIR/reto-eventos-backend"

echo "[1/3] Compilando JAR..."
./mvnw clean package -DskipTests

JAR_SRC=$(ls target/reto-eventos-backend-*.jar | head -1)
echo "JAR generado: $JAR_SRC"

echo "[2/3] Guardando backup del JAR anterior..."
[ -f "$JAR_DEST" ] && cp "$JAR_DEST" "$JAR_BACKUP"

echo "[3/3] Desplegando y reiniciando servicio..."
cp "$JAR_SRC" "$JAR_DEST"
systemctl restart "$SERVICE_NAME"
sleep 3
systemctl status "$SERVICE_NAME" --no-pager

echo "=== Backend desplegado correctamente ==="
