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

      // Clic sur l'overlay (fond noir derrière la modale) → fermer sans naviguer.
      $(document).once('oeuvre-modal-overlay').on('click.oeuvreModal', '.ui-widget-overlay', function () {
        var $dialog = $('.ui-dialog.oeuvre-modal');
        if ($dialog.length) {
          $dialog.find('.ui-dialog-content').dialog('close');
        }
        return false;
      });

      // Clic sur le fond sombre du dialog (hors image/texte) → fermer.
      $(document).once('oeuvre-modal-bg').on('click.oeuvreModal', '.ui-dialog.oeuvre-modal', function (e) {
        // Uniquement si le clic est directement sur le fond du dialog,
        // pas sur un enfant (image, texte, bouton…).
        if ($(e.target).is('.ui-dialog.oeuvre-modal')) {
          $(this).find('.ui-dialog-content').dialog('close');
        }
      });

    }
  };

})(jQuery, Drupal);
