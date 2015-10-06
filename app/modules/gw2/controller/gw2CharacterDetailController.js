(function () {

  angular
    .module('gw2')
    .controller('characterDetailController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$stateParams', 'dialogService', 'character', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, $stateParams, dialogService, character) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.ShowItemDialog = showItemDialog;
    //getCharacter($stateParams.characterName);
    $scope.character = character;

    function getCharacter(name) {
      gw2Api.GetCharacterDetails(name).then(function (data) {
        $scope.character = data;
      });
    };

    function showItemDialog(item) {
      dialogService.ShowItemDialog(item);
    };
  }

})();
