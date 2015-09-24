(function () {

  angular
    .module('gw2')
    .controller('configController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', 'storage', '$http', gw2HomeController]);

  function gw2HomeController($scope, sidenavService, gw2Factory, gw2Api, storage, $http) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');
    $scope.apiKey = storage.GetFromStorage('API-Key');
    checkTokenRights();
    $scope.Save = save;
    $scope.CheckTokenRights = checkTokenRights;

    function save() {
      storage.AddToStorage('API-Key', $scope.apiKey)
    }

    function checkTokenRights() {
      if ($scope.apiKey) {
        if ($scope.apiKey.length === 72) {
          gw2Factory.apiKey = $scope.apiKey;
          gw2Api.TokenInfo().then(function (data) {
            $scope.result = data;
          });
        }
      }
    }

  }

})();
