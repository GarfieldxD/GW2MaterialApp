(function () {
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('gw2', ['ngMaterial']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/gw2/home");
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
        },
        resolve: {
          account: function (gw2Api) {
            return gw2Api.AccountInfo();
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
      .state('app.gw2.character', {
        url: '/gw2/character',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/character.html",
            controller: "characterController"
          }
        },
        resolve: {
          character: function (gw2Api) {
            return gw2Api.GetCharacter();
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
        },
        resolve: {
          character: function (gw2Api,$stateParams) {
            var help = gw2Api.GetCharacterDetails($stateParams.characterName);
            console.log(help);
            return help;
          }
        }
      })
      .state('app.gw2.config', {
        url: '/gw2/config',
        views: {
          'content@': {
            templateUrl: "modules/gw2/view/config.html",
            controller: "configController"
          }
        }
      });
  });
})();
