<?php

/**
 * Configure le champ image de la vue galerie (taxonomy_term) pour ouvrir
 * l'œuvre dans une fenêtre MODALE Drupal (use-ajax + data-dialog-type=modal),
 * affichant le contenu complet du nœud œuvre.
 *
 * La nouvelle colorbox_load (D11) exige du code custom (contrôleur + AjaxCommand) ;
 * la modale native du core fait le même effet (overlay) sans code custom, et
 * core/drupal.ajax est déjà chargé globalement (dépendance de colorbox_load).
 */

$config = \Drupal::configFactory()->getEditable('views.view.taxonomy_term');
$base = 'display.default.display_options.fields.field_image_oeuvre.alter';

// On désactive le lien simple et on réécrit la sortie en lien modale.
$config->set($base . '.make_link', FALSE);
$config->set($base . '.link_class', '');
$config->set($base . '.alter_text', TRUE);
$config->set(
  $base . '.text',
  '<a href="{{ view_node }}" class="use-ajax" data-dialog-type="modal" data-dialog-options=\'{"width":"90%","height":"90%","dialogClass":"oeuvre-modal"}\'>{{ field_image_oeuvre }}</a>'
);
$config->save();

echo "Vue galerie : champ image -> lien modale Drupal (use-ajax) configuré.\n";
echo "alter_text = " . var_export($config->get($base . '.alter_text'), TRUE) . "\n";
echo "text       = " . $config->get($base . '.text') . "\n";
