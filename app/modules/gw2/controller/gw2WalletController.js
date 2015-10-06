(function () {
  angular
    .module('gw2')
    .controller('walletController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', 'wallet', gw2WalletController]);

  function gw2WalletController($scope, sidenavService, gw2Factory, gw2Api, $state,wallet) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.wallet = wallet;
  }

})();
