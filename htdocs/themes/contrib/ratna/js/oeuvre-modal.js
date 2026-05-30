/**
 * @file
 * Comportements de la modale œuvre.
 *
 * - Ferme la modale au clic sur le fond de l'overlay (sans naviguer).
 * - Ferme la modale au clic sur le fond sombre du dialog lui-même.
 */
(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.oeuvreModal = {
    attach: function (context, settings) {

      // Le nœud œuvre (Layout Builder) a un <a href="../"> qui enveloppe tout
      // son contenu. Au clic → fermer la modale plutôt que naviguer.
      var $content = $('.ui-dialog.oeuvre-modal .ui-dialog-content', context);
      if ($content.length) {
        $content.find('a[href="../"], a[href="./"], .content > a')
          .once('oeuvre-modal-wrapper-link')
          .on('click.oeuvreModal', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $content.dialog('close');
          });
      }

      // Clic sur l'overlay → fermer également.
      $(document).once('oeuvre-modal-overlay').on('click.oeuvreModal', '.ui-widget-overlay', function () {
        var $dialog = $('.ui-dialog.oeuvre-modal');
        if ($dialog.length) {
          $dialog.find('.ui-dialog-content').dialog('close');
        }
        return false;
      });

    }
  };

})(jQuery, Drupal);
