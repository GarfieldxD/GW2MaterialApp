(function () {
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('gw2', ['ngMaterial']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/gw2/dice");
    $stateProvider
      .state('app.gw2', {
        abstract: true,
        views: {
          'sidenav@': {
            templateUrl: "modules/gw2/view/sidenav.html",
            controller: "sidenavController"
          },
          'content@': {
            template: "<div ui-view></div>",
          }
        }
      })
      .state('app.gw2.home', {
        url: '/gw2/home',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/home.html",
            controller: "homeController"
          }
        }
      });
  });
})();
