#!/bin/bash
# Compila Angular en producción y despliega en Apache2.
# Ejecutar como root o con sudo desde /opt/reto-eventos

set -e

REPO_DIR="/opt/reto-eventos"
APACHE_ROOT="/var/www/html"
DIST_DIR="$REPO_DIR/reto-eventos-frontend/dist/reto-eventos-frontend/browser"

echo "=== Deploy frontend ==="

cd "$REPO_DIR"
git pull origin main

cd "$REPO_DIR/reto-eventos-frontend"

echo "[1/3] Instalando dependencias..."
npm ci

echo "[2/3] Compilando Angular para producción..."
npx ng build --configuration production

echo "[3/3] Copiando a Apache2..."
rm -rf "$APACHE_ROOT"/*
cp -r "$DIST_DIR/." "$APACHE_ROOT/"

echo "=== Frontend desplegado en $APACHE_ROOT ==="
