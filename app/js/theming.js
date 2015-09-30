(function () {
    'use strict';

    angular.module('app')
        .config(function ($mdThemingProvider, $mdIconProvider, ngMdIconServiceProvider) {

            $mdIconProvider                                
                .icon("death", "./content/svg/gw2/death.svg", 512)
                .icon("inventory", "./content/svg/gw2/backpack.svg", 512)
                .icon("armor", "./content/svg/gw2/armor.svg", 512);                



            $mdThemingProvider.theme('default')
                .primaryPalette('green')
                .accentPalette('red')
				.backgroundPalette('grey');
        });
})();
