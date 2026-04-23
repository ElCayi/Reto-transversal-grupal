#!/bin/bash
# Realiza un volcado SQL de la base de datos de producción.
# Uso: ./backup-db.sh
# Requiere que DB_USER y DB_PASS estén definidas como variables de entorno
# o editar las variables MYSQL_USER y MYSQL_PASS directamente.

set -e

MYSQL_USER="${DB_USER:-retoeventos}"
MYSQL_PASS="${DB_PASS}"
DB_NAME="reserva_eventos_bbdd"
BACKUP_DIR="/opt/reto-eventos/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "=== Backup base de datos ==="
echo "Destino: $BACKUP_FILE"

mysqldump \
  --user="$MYSQL_USER" \
  --password="$MYSQL_PASS" \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_NAME" | gzip > "$BACKUP_FILE"

echo "Backup completado: $BACKUP_FILE"

# Borrar backups de más de 7 días
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
echo "Backups antiguos (>7 días) eliminados."

echo "=== Backup finalizado ==="
