angular.module('myapp', ['ionic','ngCordova']).
run(function($ionicPlatform,DbService,ItemService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  DbService.init();
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();
  }
});
}).
config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'app/home/home.html',
    controller : 'HomeCtrl'
  })
  .state('detail', {
    url: '/item/{itemId}',
    templateUrl: 'app/item/item.html',
    controller : 'ItemCtrl'
  })

})


