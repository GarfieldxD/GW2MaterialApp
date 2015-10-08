(function () {

  angular
    .module('gw2')
    .controller('skinsController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', 'dialogService', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, dialogService) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    getAccountSkins();

    function getAccountSkins() {
      $scope.isLoading = true;
      gw2Api.GetAccountSkins().then(function (skins) {
        $scope.isLoading = false;
        $scope.skins = skins;
      });
    }

    $scope.ShowItemDialog = showItemDialog;
    function showItemDialog(item) {
      dialogService.ShowItemDialog(item);
    };

  }

})();
