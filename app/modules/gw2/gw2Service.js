(function () {
  'use strict';

  angular.module('gw2')
    .factory('gw2Factory', gw2Factory)
    .service('sidenavService', sidenavService)
    .service('dialogService', dialogService);

  function sidenavService($q, $mdUtil, $mdSidenav, $log) {
    function buildToggler(navID) {
      var debounceFn = $mdUtil.debounce(function () {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
      return debounceFn;
    };

    return {
      ToggleSidenav: buildToggler
    };
  };

  function dialogService($mdDialog) {
    function showDialog(item) {
      console.log(item);
      $mdDialog.show({
        templateUrl: 'modules/gw2/view/_itemViewDialog.html',
        parent: angular.element(document.body),
        locals: { item: item },
        controller: angular.noop,
        controllerAs: 'ctrl',
        bindToController: true,
        clickOutsideToClose: true
      });
    }
    return {
      ShowItemDialog: showDialog
    };
  }

  function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
      $mdDialog.hide(answer);
    };
  }

  function gw2Factory(storage, $state) {
    var factory = {
      account: {},
      characters: []
    };
    return factory;

  };
})();
