(function () {
  'use strict';

  angular.module('gw2')
    .directive('armorPreview', armorPreview);

  function armorPreview() {
    return {
      restrict: 'E',
      templateUrl: 'modules/gw2/directives/view/_armorPreview.html',
      scope: {
        armor: '='
      },
      controller: function ($scope, dialogService) {
        $scope.ShowItemDialog =  function (item) {
          dialogService.ShowItemDialog(item);
        };
      }
    }
  }
})();
