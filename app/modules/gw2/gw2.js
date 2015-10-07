(function () {
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('gw2', ['ngMaterial']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/config");
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
      })
      .state('app.gw2.bank', {
        url: '/gw2/bank',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/bank.html",
            controller: "bankController"
          },
        }
      })
      .state('app.gw2.materials', {
        url: '/gw2/materials',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/materials.html",
            controller: "materialsController"
          },
        }
      })
      .state('app.gw2.wallet', {
        url: '/gw2/wallet',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/wallet.html",
            controller: "walletController"
          },
        }
      })
      .state('app.gw2.character', {
        url: '/gw2/character',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/character.html",
            controller: "characterController"
          }
        }
      })
      .state('app.gw2.character.detail', {
        url: '/:characterName',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/characterDetails.html",
            controller: "characterDetailController"
          }
        }
      })
      .state('app.config', {
        url: '/config',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/config.html",
            controller: "configController"
          }
        }
      });
  });
})();
