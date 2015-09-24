(function () {

  angular
    .module('gw2')
    .controller('homeController', ['$scope','sidenavService', gw2HomeController]);

  function gw2HomeController($scope,  sidenavService) {
    $scope.hello = "Hello";
	alert();
  }

})();
