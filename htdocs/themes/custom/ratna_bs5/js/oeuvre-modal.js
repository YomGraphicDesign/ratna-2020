/**
 * @file
 * Modale œuvre : fermeture au clic sur le fond + navigation précédent/suivant
 * entre les œuvres de la galerie (boutons ◂ ▸ et flèches clavier).
 */
(function ($, Drupal) {
  'use strict';

  var links = [];
  var index = -1;

  // Force le chargement des images de la modale : loading="lazy" ne se déclenche
  // pas pour une image injectée en AJAX dans la modale (qui reste 0×0 → jamais
  // dans le viewport → deadlock). On les passe en eager et on relance le src.
  function forceEager(root) {
    $(root).find('img').each(function () {
      this.loading = 'eager';
      var s = this.getAttribute('src');
      if (s && !this.complete) { this.src = s; }
    });
  }

  function galleryLinks() {
    return $('.view-content a.use-ajax[data-dialog-type="modal"]').toArray();
  }

  // Mémorise l'ordre des œuvres et celle qu'on ouvre. En phase CAPTURE car
  // Drupal (use-ajax) stoppe la propagation du clic en phase bubbling.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.view-content a.use-ajax[data-dialog-type="modal"]');
    if (a) {
      links = galleryLinks();
      index = links.indexOf(a);
    }
  }, true);

  function go(delta) {
    if (!links.length) {
      return;
    }
    index = (index + delta + links.length) % links.length;
    var url = links[index].getAttribute('href');
    var $content = $('.ui-dialog.oeuvre-modal .ui-dialog-content');
    if (!$content.length) {
      return;
    }
    // On garde la modale ouverte et on remplace seulement son contenu (AJAX) :
    // on récupère la page de l'œuvre et on en extrait le nœud rendu.
    $content.css('opacity', 0.3);
    $.get(url).done(function (html) {
      var $node = $('<div>').html(html).find('article[data-history-node-id]').first();
      $content.html($node.length ? $node : html).css('opacity', 1);
      if (window.Drupal && Drupal.attachBehaviors) {
        Drupal.attachBehaviors($content[0]);
      }
      forceEager($content);
    }).fail(function () {
      $content.css('opacity', 1);
    });
  }

  // Injecte les flèches précédent/suivant à l'ouverture de la modale.
  $(window).on('dialog:aftercreate', function (e, dialog, $element) {
    var $dialog = $element.closest('.ui-dialog.oeuvre-modal');
    if (!$dialog.length || $dialog.find('.oeuvre-nav').length) {
      return;
    }
    var $prev = $('<button type="button" class="oeuvre-nav oeuvre-nav--prev" aria-label="Précédent">‹</button>');
    var $next = $('<button type="button" class="oeuvre-nav oeuvre-nav--next" aria-label="Suivant">›</button>');
    $prev.on('click', function (ev) { ev.preventDefault(); go(-1); });
    $next.on('click', function (ev) { ev.preventDefault(); go(1); });
    $dialog.append($prev, $next);
    forceEager($dialog);
  });

  // Flèches clavier.
  $(document).on('keydown.oeuvreNav', function (e) {
    if (!$('.ui-dialog.oeuvre-modal').length) {
      return;
    }
    if (e.key === 'ArrowLeft') { go(-1); }
    if (e.key === 'ArrowRight') { go(1); }
  });

  // Clic sur le fond noir → ferme.
  $(document).on('click', '.ui-widget-overlay', function () {
    var $content = $('.ui-dialog.oeuvre-modal .ui-dialog-content');
    if ($content.length) {
      $content.dialog('close');
    }
  });

})(jQuery, Drupal);
