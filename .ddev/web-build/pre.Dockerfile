# La clé GPG sury baked dans l'image ddev est expirée (EXPKEYSIG), ce qui
# bloque l'installation de PHP 7.4 nécessaire à Drupal 8.9.
# On marque le dépôt sury comme [trusted=yes] pour qu'apt ignore la
# vérification de signature uniquement pour ce dépôt.
RUN echo "deb [trusted=yes] https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list
