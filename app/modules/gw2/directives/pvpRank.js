(function () {
  'use strict';

  angular.module('gw2')
    .directive('pvpRank', armorPreview);

  function armorPreview() {
    return {
      restrict: 'E',
      templateUrl: 'modules/gw2/directives/view/_pvpRank.html',
      scope: {
        rank: '='
      },
      controller: function ($scope, dialogService) {
        $scope.$watch('rank', function (newVal, oldVal) {
          if (newVal < 10) {
            $scope.rankName = "Rabbit";
          }
          else if (newVal < 20) {
            $scope.rankName = "Deer";
          }
          else if (newVal < 30) {
$scope.rankName = "Dolyak";
          }
          else if (newVal < 40) {
            $scope.rankName = "Wolf";
          }
          else if (newVal < 50) {
            $scope.rankName = "Tiger";
          }
          else if(newVal < 60) {
            $scope.rankName = "Bear";
          }
          else if(newVal < 70) {
            $scope.rankName = "Shark";
          }
          else if(newVal < 80) {
            $scope.rankName = "Phoenix";
          }
          else if(newVal == 80) {
            $scope.rankName = "Dragon";
          }
        });
      }
    }
  }
})();
