(function () {
  angular
    .module('gw2')
    .controller('walletController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state',  gw2WalletController]);

  function gw2WalletController($scope, sidenavService, gw2Factory, gw2Api, $state) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    gw2Api.GetWallet().then(function (wallet) {
      $scope.wallet = wallet;
    });
  }

})();
