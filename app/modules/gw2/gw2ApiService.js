(function () {
  'use strict';
  var API_URL = 'https://api.guildwars2.com/';
  angular.module('gw2')
    .factory('gw2Api', gw2Api);

  function gw2Api($http, gw2Factory, $q) {
    var service = {
      TokenInfo: tokenInfo
    };
    return service;

    function tokenInfo() {
      // setHeader();
      var deferred = $q.defer();
      $http.get('https://api.guildwars2.com/v2/tokeninfo?access_token=34D6C0CE-2C73-4B49-8A28-59C2508107B83ED4BCEB-5876-45C7-8E18-F21F5E1D5820').success(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }

    function setHeader() {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + gw2Factory.apiKey;
    }
  }

})();
