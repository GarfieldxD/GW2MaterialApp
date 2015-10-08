(function () {
  angular
    .module('gw2')
    .controller('pvpController', ['$scope', 'sidenavService', 'gw2Factory', 'gw2Api', '$state', 'dialogService', gw2PvpController]);

  function gw2PvpController($scope, sidenavService, gw2Factory, gw2Api, $state, dialogService) {
    $scope.ToggleLeft = sidenavService.ToggleSidenav('left');

    $scope.isLoading = true;
    gw2Api.GetPvpStats().then(function (stats) {
      $scope.isLoading = false;
      $scope.stats = stats.data;
      angular.forEach(stats.data.professions, function (key, value) {
        CalculateWinsAndLosses(key);
        stats.data.professions[value] = key;
      });
      var win = stats.data.aggregate.wins + stats.data.aggregate.byes;
      var losses = stats.data.aggregate.losses + stats.data.aggregate.forfeits + stats.data.aggregate.desertions;
      var total = win + losses;
      $scope.stats.wins = win;
      $scope.stats.losses = losses;
      $scope.stats.lossPercentage = (100 / total) * losses;
      $scope.stats.winPercentage = (100 / total) * win;
      $scope.stats.total = total;
    });

    gw2Api.GetPvpGames().then(function (games) {
      $scope.isLoading = false;
      $scope.games = games;
    });

    $scope.ShowItemDialog = showItemDialog;
    function showItemDialog(item) {
      dialogService.ShowItemDialog(item);
    };

    $scope.getTotalMatches = function (matches) {
      console.log(matches);
      var win = matches.wins + matches.byes;
      var losses = matches.aggregate.losses + matches.forfeits + matches.desertions;
      return win + losses;
    }
  }

  function CalculateWinsAndLosses(obj) {
    var win = obj.wins + obj.byes;
    var losses = obj.losses + obj.forfeits + obj.desertions;
    var total = win + losses;
    obj.wins = win;
    obj.losses = losses;
    obj.lossPercentage = (100 / total) * losses;
    obj.winPercentage = (100 / total) * win;
    obj.total = total;
  }

})();
