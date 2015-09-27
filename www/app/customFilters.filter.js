angular.module('myapp').filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  }).filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')
      return $sce.trustAsHtml(text)
    }
}).filter('htmlToPlaintext', function(text) {
    return function(text) {
      return angular.element(text).text();
    }
  });