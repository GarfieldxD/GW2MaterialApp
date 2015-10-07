(function () {
  angular
    .module('gw2')
    .controller('materialsController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', 'dialogService', gw2BankController]);

  function gw2BankController($scope, sidenavService, gw2Factory, gw2Api, $state, dialogService) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    gw2Api.GetMaterials().then(function (materials) {
      $scope.materials = materials;
    });

    $scope.ShowItemDialog = showItemDialog;
    function showItemDialog(item) {
      dialogService.ShowItemDialog(item);
    };

  }

})();
