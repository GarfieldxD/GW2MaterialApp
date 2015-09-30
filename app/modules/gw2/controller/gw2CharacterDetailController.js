(function () {

  angular
    .module('gw2')
    .controller('characterDetailController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$stateParams', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, $stateParams) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    getCharacter($stateParams.characterName);

    function getCharacter(name) {
      gw2Api.GetCharacterDetails(name).then(function (data) {
        console.log(data.equipment.weapons[3]);
        $scope.character = data;
      });
    }
  }

})();
