(function () {

  angular
    .module('gw2')
    .controller('characterController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api,$state ) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.goToState = goToState;
    getCharacter();

    function getCharacter() {
      gw2Api.GetCharacter().then(function (data) {
        $scope.character = data;
      });
    }
    
    function goToState(char){
      $state.go('app.gw2.character.detail',{characterName: char.name});
    }

  }

})();
