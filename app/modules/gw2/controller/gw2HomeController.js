(function () {

  angular
    .module('gw2')
    .controller('homeController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', 'account', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api,account) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    //getAccountInfo();
    $scope.account = account;

    function getAccountInfo() {
      gw2Api.AccountInfo().then(function (account) {
        gw2Factory.account = account;
        $scope.account = gw2Factory.account;
      });
    }

  }

})();
