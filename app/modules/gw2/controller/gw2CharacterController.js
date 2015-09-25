(function () {

  angular
    .module('gw2')
    .controller('characterController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', 'storage', '$http', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, storage, $http) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    getCharacter();

    function getCharacter() {
      gw2Api.GetCharacter().then(function (data) {
        $scope.character = data;
      });
    }

  }

})();
