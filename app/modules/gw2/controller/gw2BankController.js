(function () {
  angular
    .module('gw2')
    .controller('bankController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', 'dialogService', gw2BankController]);

  function gw2BankController($scope, sidenavService, gw2Factory, gw2Api, $state, dialogService) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');

    $scope.isLoading = true;
    gw2Api.GetBank().then(function (bank) {
      $scope.isLoading = false;
      $scope.bank = bank;
    });

    $scope.ShowItemDialog = showItemDialog;
    function showItemDialog(item) {
      dialogService.ShowItemDialog(item);
    };

  }

})();
