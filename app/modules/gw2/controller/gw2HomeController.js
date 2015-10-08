(function () {

  angular
    .module('gw2')
    .controller('homeController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    getAccountInfo();

    function getAccountInfo() {
      if (gw2Factory.apiKey == null || gw2Factory.apiKey.length > 72) {
        $state.go('app.config');
      }
      else {
        $scope.isLoading = true;
        gw2Api.AccountInfo().then(function (account) {
          $scope.isLoading = false;
          $scope.account = gw2Factory.account;
        });
      }
    }

  }

})();
