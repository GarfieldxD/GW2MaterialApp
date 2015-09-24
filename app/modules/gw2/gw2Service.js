(function () {
  'use strict';

  angular.module('gw2')
    .factory('gw2Factory', gw2Factory)
    .service('sidenavService', sidenavService);

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

  function gw2Factory(storage, $state) {
    var factory = {};
    factory.apiKey = storage.GetFromStorage('API-Key');
    if (factory.apiKey === null) {
      if (!$state.includes('app.gw2.config')) {
        $state.go('app.gw2.config');
      }
    }
    return factory;
  };
})();
