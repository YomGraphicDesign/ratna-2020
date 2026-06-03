#!/usr/bin/env bash
#
# Deploy script — runs ON the server (over SSH).
#
# First-time install:
#   ssh user@server
#   git clone git@github.com:YomGraphicDesign/ratna-2020.git .
#   cp htdocs/sites/default/settings.prod.php.example htdocs/sites/default/settings.php
#   nano htdocs/sites/default/settings.php   # fill in DB credentials + hash_salt
#   chmod 444 htdocs/sites/default/settings.php
#   bash deploy.sh --first-run
#
# Subsequent deploys:
#   ssh user@server 'cd ~/ratna-2020 && bash deploy.sh'

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

FIRST_RUN="${1:-}"

echo "==> [1/5] git pull origin master"
git pull --ff-only origin master

echo "==> [2/5] composer install (no dev, optimized)"
php "$HOME/composer.phar" install --no-dev --optimize-autoloader --no-interaction

if [[ "$FIRST_RUN" == "--first-run" ]]; then
  echo "==> First run: ensure settings.php exists"
  if [[ ! -f htdocs/sites/default/settings.php ]]; then
    echo "ERROR: htdocs/sites/default/settings.php not found."
    echo "Copy settings.prod.php.example to settings.php and fill in DB credentials, then re-run."
    exit 1
  fi
  echo "==> First run: ensure files dir is writable"
  mkdir -p htdocs/sites/default/files
  chmod 755 htdocs/sites/default/files
fi

echo "==> [3/5] fix permissions"
PERMISSION_ERRORS="$(mktemp)"
find . -path './.git' -prune -o -exec chmod 755 {} + 2>"$PERMISSION_ERRORS"
if [[ -s "$PERMISSION_ERRORS" ]]; then
  echo "ERROR: some permissions could not be changed:"
  cat "$PERMISSION_ERRORS"
  rm -f "$PERMISSION_ERRORS"
  exit 1
fi
rm -f "$PERMISSION_ERRORS"

echo "==> [4/5] drush updb (apply pending DB updates)"
vendor/bin/drush updb -y

echo "==> [5/5] drush cr (rebuild caches)"
vendor/bin/drush cr

echo
echo "✓ Deploy complete."
