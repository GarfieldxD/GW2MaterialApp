(function () {
  'use strict';
  var API_URL = 'https://api.guildwars2.com/';
  angular.module('gw2')
    .factory('gw2Api', gw2Api);

  function gw2Api($http, gw2Factory, $q) {
    var service = {
      TokenInfo: tokenInfo,
      AccountInfo: accountInfo,
      GetCharacter: getCharacter
    };
    return service;

    function tokenInfo() {
      var deferred = $q.defer();
      $http.get(API_URL + 'v2/tokeninfo?access_token=34D6C0CE-2C73-4B49-8A28-59C2508107B83ED4BCEB-5876-45C7-8E18-F21F5E1D5820').success(function (tokenInformation) {
        deferred.resolve(tokenInformation);
      });
      return deferred.promise;
    }

    function accountInfo() {
      return $http.get(API_URL + 'v2/account?access_token=34D6C0CE-2C73-4B49-8A28-59C2508107B83ED4BCEB-5876-45C7-8E18-F21F5E1D5820')
        .then(function (account) {
          return account.data;
        })
        .then(function (account) {
          return getWorlds().then(function (worlds) {
            worlds.forEach(function (world) {
              if (world.id == account.world) {
                account.world = world;
              }
            });
            return account
          });
        })
        .then(function (account) {
          var results = [];

          account.guilds.forEach(function (guild) {
            getGuild(guild).then(function (guildDetails) {
              results.push(guildDetails);
            });
          });

          return $q.all(results).then(function () {
            account.guilds = results;
            return account;
          });

        });
    }

    function getCharacter() {
      return $http.get('https://api.guildwars2.com/v2/characters?access_token=34D6C0CE-2C73-4B49-8A28-59C2508107B83ED4BCEB-5876-45C7-8E18-F21F5E1D5820').then(function (result) {
        return result.data;
      })
        .then(function (character) {
          var results = [];
          character.forEach(function (character) {
            getCharacterDetails(character).then(function (characterDetails) {
              results.push(characterDetails);
            });
          });
          return $q.all(results).then(function () {
            return results;
          });

        });
    }

    function getCharacterDetails(characterName) {
      var deferred = $q.defer();
      $http.get(API_URL + 'v2/characters/' + characterName + '?access_token=34D6C0CE-2C73-4B49-8A28-59C2508107B83ED4BCEB-5876-45C7-8E18-F21F5E1D5820').success(function (characterDetails) {
        deferred.resolve(characterDetails);
      });
      return deferred.promise;
    }

    function getWorlds() {
      var deferred = $q.defer();
      $http.get(API_URL + 'v2/worlds??lang=de&ids=all').success(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }

    function getGuild(guildId) {
      var deferred = $q.defer();
      $http.get(API_URL + 'v1/guild_details.json?guild_id=' + guildId).success(function (guild) {
        deferred.resolve(guild);
      });
      return deferred.promise;
    }

    function setHeader() {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + gw2Factory.apiKey;
    }
  }

})();
