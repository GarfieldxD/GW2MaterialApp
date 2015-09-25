(function () {

  angular
    .module('gw2')
    .controller('homeController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    getAccountInfo();
    $scope.account = gw2Factory.account;

    function getAccountInfo() {
      gw2Api.AccountInfo().then(function (account) {
        $scope.account = account;
      });
    }

  }

})();
