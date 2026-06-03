# Déploiement — ratna-2020

## Déploiement automatique OVH sans SSH (recommandé)

Chaque push sur la branche `master` déclenche automatiquement le déploiement via GitHub Actions.

GitHub Actions installe les dépendances Composer avant le transfert. Le serveur OVH reçoit donc aussi les dossiers générés nécessaires au site :
- `vendor/`
- `htdocs/core/`
- `htdocs/modules/contrib/`
- `htdocs/themes/contrib/`
- `htdocs/libraries/`

**Prérequis (à faire une seule fois) :**

**1. Ajouter les secrets FTP OVH dans GitHub :**

Aller sur : https://github.com/YomGraphicDesign/ratna-2020/settings/secrets/actions

| Name | Value |
|------|-------|
| `OVH_FTP_SERVER` | serveur FTP/FTPS OVH |
| `OVH_FTP_USERNAME` | identifiant FTP OVH |
| `OVH_FTP_PASSWORD` | mot de passe FTP OVH |
| `OVH_FTP_SERVER_DIR` | dossier distant du site, par exemple `/www/` |

Le workflow applique aussi `chmod 755` avant l'envoi FTP.

---

## Déploiement manuel avec SSH

### 1. Pousser les modifications

```bash
cd /Volumes/YOM_2/Yom\ Graphic\ Design/htdocs/ratna-2020
git add -A
git commit -m "description de la modification"
git push origin master
```

### 2. Se connecter au serveur et déployer

```bash
ssh user@server
cd ~/ratna-2020 && bash deploy.sh
```

Le script fait automatiquement :
- `git pull` — récupère les modifications
- `composer install` — met à jour les dépendances
- Correction des permissions en `755` sur tous les fichiers et dossiers du projet
- `drush updb` — applique les mises à jour BDD
- `drush cr` — vide les caches

Si un fichier ou dossier bloque la correction des permissions, le script affiche l'erreur et stoppe le déploiement.

---

## Mise à jour de la base de données

> À faire lors d'une **première mise en production** ou pour **écraser la BDD serveur avec celle de DDEV**.

### Étape 1 — Exporter depuis DDEV

```bash
cd /Volumes/YOM_2/Yom\ Graphic\ Design/htdocs/ratna-2020
ddev export-db --file=ratna-prod.sql.gz
```

### Étape 2 — Transférer sur le serveur

```bash
scp "/Volumes/YOM_2/Yom Graphic Design/htdocs/ratna-2020/ratna-prod.sql.gz" \
    user@server:~/ratna-prod-$(date +%Y%m%d).sql.gz
```

### Étape 3 — Importer sur le serveur

```bash
ssh user@server
vendor/bin/drush sql:drop -y && zcat ~/ratna-prod-$(date +%Y%m%d).sql.gz | vendor/bin/drush sqlc && vendor/bin/drush cr
```

---

## Première installation sur un nouveau serveur

```bash
git clone git@github.com:YomGraphicDesign/ratna-2020.git .
cp htdocs/sites/default/settings.prod.php.example htdocs/sites/default/settings.php
nano htdocs/sites/default/settings.php   # remplir DB credentials + hash_salt
chmod 444 htdocs/sites/default/settings.php
bash deploy.sh --first-run
```

---

## Développement local (DDEV)

```bash
cd /Volumes/YOM_2/Yom\ Graphic\ Design/htdocs/ratna-2020
ddev start
ddev import-db --file=Backup/default_db.sql.gz
```

Site disponible sur : https://ratna-2020.ddev.site
