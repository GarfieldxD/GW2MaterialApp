(function () {

  angular
    .module('gw2')
    .controller('characterDetailController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$stateParams', 'dialogService', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, $stateParams, dialogService) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.ShowItemDialog = showItemDialog;
    $scope.isLoading = true;
    getCharacter($stateParams.characterName);

    function getCharacter(name) {
      gw2Api.GetCharacterDetails(name).then(function (data) {        
        $scope.character = data;
        $scope.isLoading = false;
      });
    };

    function showItemDialog(item) {
      dialogService.ShowItemDialog(item);
    };
  }

})();
