(function () {
  'use strict';

  angular.module('gw2')
    .factory('gw2Factory', pandpFactory)
    .service('sidenavService', ['$q', '$mdUtil', '$mdSidenav', '$log', sidenavService]);

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
    }

    return {
      ToggleSidenav: buildToggler
    };
  };

  function pandpFactory(storage) {
    var factory = {};
    return factory;
  };
})();
