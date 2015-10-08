(function () {

  angular
    .module('gw2')
    .controller('characterController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, $state) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.goToState = goToState;
    $scope.isLoading = true;
    getCharacter();

    function getCharacter() {
      gw2Api.GetCharacter().then(function (character) {
        $scope.isLoading = false;
        $scope.character = character;
      });

    }

    function goToState(char) {
      $state.go('app.gw2.character.detail', { characterName: char.name });
    }

  }

})();
