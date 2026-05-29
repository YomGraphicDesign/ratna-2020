# Photographies du DOM — référence avant migration Drupal 10

Capture de la structure HTML des pages du site **en Drupal 9.5.11** (état qui
fonctionne), pour servir de **référence** lors de la refonte du thème
(Bootstrap 3 → 5) au passage à Drupal 10. Permet de comparer après migration et
vérifier que la structure / les classes attendues par le CSS sont préservées.

Capturé le 2026-05-29.

## Pages (1 par gabarit)

| Fichier | URL | Gabarit |
|---------|-----|---------|
| `01-accueil` | `/` | page d'accueil (vue accueil) |
| `02-portrait` | `/node/11` | nœud `page` (Portrait) |
| `03-actualites` | `/actualites` | vue liste actualités |
| `04-contact` | `/node/10` | nœud `webform` (Contact) |
| `05-galerie-terme` | `/les-nouveautes` | page de terme taxonomie (galerie) |
| `06-oeuvre` | `/les-nouveautes/oeuvre/letoile-de-jaipur` | nœud `oeuvre` |

## Contenu

- `*.html` — HTML brut complet rendu (anonyme, sans la barre d'admin).
- `*.skeleton.txt` — arborescence lisible `tag #id .classes` (bruit dynamique
  normalisé : hashs `js-view-dom-id-…`, ids longs `…`). C'est la vue de
  référence pour les classes/structure.

## Régénérer

```bash
cd dom-snapshots
# recapturer le HTML (voir la commande curl dans l'historique) puis :
python3 _make_skeletons.py 01-accueil 02-portrait 03-actualites 04-contact 05-galerie-terme 06-oeuvre
```
