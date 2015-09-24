(function () {

  angular
    .module('gw2')
    .controller('homeController', ['$scope', 'sidenavService','gw2Factory', gw2HomeController]);

  function gw2HomeController($scope, sidenavService,gw2Factory) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.hello = "Hello";
  }

})();
