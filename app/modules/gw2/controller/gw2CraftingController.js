(function () {
  angular
    .module('gw2')
    .controller('craftingController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', 'dialogService', gw2craftingController]);

  function gw2craftingController($scope, sidenavService, gw2Factory, gw2Api, $state, dialogService) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    
    $scope.CheckQuantity = function(){
      if($scope.quantity > 500){
        $scope.quantity = 500;
      }
    };

    $scope.isLoading = true;
    gw2Api.GetCharacter().then(function (chars) {
      $scope.isLoading = false;
      $scope.character = chars;
      $scope.quantity = 400;
      $scope.disciplines = {};
      $scope.character.forEach(function (char) {
        char.crafting.forEach(function (crafting) {
          var craft = crafting;
          if (!$scope.disciplines[crafting.discipline]) {            
            $scope.disciplines[crafting.discipline] = [];
          }
          craft.character = char.name;
          craft.icon = char.profession;
          $scope.disciplines[crafting.discipline].push(craft);
        });
      });
    });

  }

})();
