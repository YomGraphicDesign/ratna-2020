/**
 * @file
 * Polyfills jQuery pour les plugins anciens (colorbox, Bootstrap 3) sous jQuery 4.
 *
 * Drupal 11 embarque jQuery 4, qui a supprimé $.isFunction, $.isArray, $.trim
 * et $.type. Les plugins jQuery anciens (jquery.colorbox, bootstrap 3) les
 * utilisent encore et plantent sans ce shim.
 */
(function ($) {
  'use strict';

  // Garantit drupalSettings.dialog : sans ça, le pont modal de Bootstrap
  // (modal.jquery.ui.bridge.js) plante en tentant d'y écrire buttonClass.
  if (typeof window.drupalSettings !== 'undefined') {
    window.drupalSettings.dialog = window.drupalSettings.dialog || {};
  }

  if (!$) {
    return;
  }
  if (typeof $.isFunction === 'undefined') {
    $.isFunction = function (obj) {
      return typeof obj === 'function';
    };
  }
  if (typeof $.isArray === 'undefined') {
    $.isArray = Array.isArray;
  }
  if (typeof $.trim === 'undefined') {
    $.trim = function (text) {
      return text == null ? '' : String(text).trim();
    };
  }
  if (typeof $.type === 'undefined') {
    $.type = function (obj) {
      if (obj == null) {
        return obj + '';
      }
      return typeof obj;
    };
  }
})(jQuery);
