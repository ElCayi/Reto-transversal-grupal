#!/bin/bash
# Restaura un backup SQL de la base de datos.
# Uso: ./restore-db.sh <archivo_backup.sql.gz>
# Requiere que DB_USER y DB_PASS estén definidas como variables de entorno.

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: $0 <archivo_backup.sql.gz>"
  echo "Backups disponibles en /opt/reto-eventos/backups/:"
  ls -lh /opt/reto-eventos/backups/*.sql.gz 2>/dev/null || echo "  (ninguno)"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: Archivo no encontrado: $BACKUP_FILE"
  exit 1
fi

MYSQL_USER="${DB_USER:-retoeventos}"
MYSQL_PASS="${DB_PASS}"
DB_NAME="reserva_eventos_bbdd"

echo "=== Restaurar base de datos ==="
echo "Archivo: $BACKUP_FILE"
echo "Base de datos: $DB_NAME"
echo ""
read -p "¿Confirmar restauración? Esto sobreescribe los datos actuales. [s/N] " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Restauración cancelada."
  exit 0
fi

echo "[1/2] Parando el backend..."
systemctl stop reto-eventos-backend || true

echo "[2/2] Restaurando datos..."
gunzip -c "$BACKUP_FILE" | mysql \
  --user="$MYSQL_USER" \
  --password="$MYSQL_PASS" \
  "$DB_NAME"

echo "Reiniciando el backend..."
systemctl start reto-eventos-backend

echo "=== Restauración completada ==="
