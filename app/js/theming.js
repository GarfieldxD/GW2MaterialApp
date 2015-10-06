(function () {
    'use strict';

    angular.module('app')
        .config(function ($mdThemingProvider, $mdIconProvider, ngMdIconServiceProvider) {

            $mdIconProvider
                .icon("death", "./content/svg/gw2/death.svg", 512)
                .icon("inventory", "./content/svg/gw2/backpack.svg", 512)
                .icon("equipment", "./content/svg/gw2/equipment.svg", 512)
                .icon("tools", "./content/svg/gw2/tools.svg", 512)
                .icon("weapons", "./content/svg/gw2/weapons.svg", 512)
                .icon("armor", "./content/svg/gw2/armor.svg", 512)
                .icon("wallet", "./content/svg/gw2/wallet.svg", 512)
                .icon("bank", "./content/svg/gw2/bank.svg", 512)
                .icon("character", "./content/svg/gw2/character.svg", 512)
                .icon("general", "./content/svg/gw2/general.svg", 512);



            $mdThemingProvider.theme('default')
                .primaryPalette('green')
                .accentPalette('yellow', {
                    'default': '600'
                }).backgroundPalette('grey', {
                    'default': '600'
                }).dark();
        });
})();
