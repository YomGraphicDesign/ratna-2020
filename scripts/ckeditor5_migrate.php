<?php

/**
 * Migre tous les éditeurs CKEditor 4 vers CKEditor 5 via le service officiel
 * SmartDefaultSettings (équivalent de ce que fait le formulaire d'admin).
 * Usage : ddev exec "cd /var/www/html && vendor/bin/drush php:script scripts/ckeditor5_migrate.php"
 */

use Drupal\editor\Entity\Editor;
use Drupal\filter\Entity\FilterFormat;

$smart = \Drupal::service('ckeditor5.smart_default_settings');
$storage = \Drupal::entityTypeManager()->getStorage('editor');

foreach ($storage->loadMultiple() as $id => $editor) {
  if ($editor->getEditor() !== 'ckeditor') {
    echo "  skip $id (éditeur = {$editor->getEditor()})\n";
    continue;
  }
  $format = FilterFormat::load($editor->id());
  try {
    [$updated_editor, $messages] = $smart->computeSmartDefaultSettings($editor, $format);
    $updated_editor->save();
    echo "  ✓ $id migré vers CKEditor 5\n";
    foreach ($messages as $type => $list) {
      foreach ((array) $list as $m) {
        echo "      [$type] " . (is_string($m) ? $m : json_encode($m)) . "\n";
      }
    }
  }
  catch (\Throwable $e) {
    echo "  ✗ $id ÉCHEC : " . $e->getMessage() . "\n";
  }
}
echo "Terminé.\n";
