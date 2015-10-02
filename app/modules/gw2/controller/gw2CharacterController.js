(function () {

  angular
    .module('gw2')
    .controller('characterController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', 'character', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, $state,character) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.goToState = goToState;
    //$scope.character = gw2Factory.characters;
    $scope.character = character;
    console.log(character);    
    //getCharacter();

    function getCharacter() {
      gw2Api.GetCharacter();
    }

    function goToState(char) {
      $state.go('app.gw2.character.detail', { characterName: char.name });
    }

  }

})();
