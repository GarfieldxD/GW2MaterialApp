(function () {

  angular
    .module('gw2')
    .controller('homeController', ['$scope','sidenavService', gw2DiceController]);

  function gw2DiceController($scope,  sidenavService) {
    $scope.hello = "Hello";
  }

})();