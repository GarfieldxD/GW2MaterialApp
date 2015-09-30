(function () {
  'use strict';
  var API_URL = 'https://api.guildwars2.com/';
  angular.module('gw2')
    .factory('gw2Api', gw2Api);

  function gw2Api($http, gw2Factory, $q) {
    var service = {
      TokenInfo: tokenInfo,
      AccountInfo: accountInfo,
      GetCharacter: getCharacter,
      GetCharacterDetails: getCharacterDetails
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
      return $http.get('https://api.guildwars2.com/v2/characters?access_token=34D6C0CE-2C73-4B49-8A28-59C2508107B83ED4BCEB-5876-45C7-8E18-F21F5E1D5820')
        .then(function (result) {
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
      $http.get(API_URL + 'v2/characters/' + characterName + '?lang=de&access_token=34D6C0CE-2C73-4B49-8A28-59C2508107B83ED4BCEB-5876-45C7-8E18-F21F5E1D5820').then(function (data) {
        var characterDetails = data.data;
        characterDetails.age = parseInt(characterDetails.age / 3600);
        if (characterDetails.guild) {
          getGuild(characterDetails.guild).then(function (guildDetails) {
            characterDetails.guild = guildDetails;
          });
        }
        else {
          characterDetails.guild = "Ohne Gilde";
        }
        return characterDetails;
      }).then(function (characterDetails) {
        return createItemDetails(characterDetails)
          .then(function (characterDetails) {
            return characterDetails;
          });
      })
        .then(function (characterDetails) {
          var results = [];
          characterDetails.bags.forEach(function (bag) {
            getItemDetails(bag.id).then(function (bagDetails) {
              bag.details = bagDetails;
              bag.inventory.forEach(function (item) {
                if (item) {
                  getItemDetails(item.id).then(function (itemDetails) {
                    item.details = itemDetails;
                  });
                }
              });
              results.push(bag);
            });
          });

          return $q.all(results).then(function () {
            characterDetails.bags = results;

            deferred.resolve(characterDetails);
          });
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

    function getItemDetails(itemId) {
      var deferred = $q.defer();
      $http.get(API_URL + 'v1/item_details.json?lang=de&item_id=' + itemId).success(function (itemDetails) {
        deferred.resolve(itemDetails);
      });
      return deferred.promise;
    }

    function getSkinDetails(skinId) {
      var deferred = $q.defer();
      $http.get(API_URL + 'v1/skin_details.json?lang=de&skin_id=' + skinId).success(function (skinDetails) {
        deferred.resolve(skinDetails);
      });
      return deferred.promise;
    }

    function setHeader() {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + gw2Factory.apiKey;
    }

    function createItemDetails(character) {
      var items = character.equipment;
      character.equipment = {
        weapons: {},
        armor: {},
        trinkets: {},
        tools: {},
        underwater: {}
      };
      var results = [];

      items.forEach(function (item) {
        getItemDetails(item.id).then(function (itemDetails) {
          if (item.skin) {
            getSkinDetails(item.skin)
              .then(function (skin) {
                item.details = itemDetails;
                item.skin = skin;
                return item;
              });
          }
          else {
            item.details = itemDetails;
            item.skin = itemDetails;
            return item;
          }
        }).then(function () {
          var upgradeResults = [];
          if (item.upgrades) {
            item.upgrades.forEach(function (upgrade) {
              getItemDetails(upgrade).then(function (upgradeDetails) {
                upgradeResults.push(upgradeDetails);
              });
            });
          }
          return $q.all(upgradeResults).then(function () {
            item.upgrades = upgradeResults;
            results.push(item);
          });
        })
          .then(function () {
            var infusionResults = [];
            if (item.infusions) {
              item.infusions.forEach(function (infusions) {
                getItemDetails(infusions).then(function (infusionDetails) {
                  infusionResults.push(infusionDetails);
                });
              });
            }
            return $q.all(infusionResults).then(function () {
              item.infusions = infusionResults;
              results.push(item);
            });
          });
      });


      items.forEach(function (item) {
        if (item.slot == 'Sickle' || item.slot == 'Pick' || item.slot == 'Axe') {
          character.equipment.tools[item.slot] = item;
        }
        if (item.slot == 'Coat' || item.slot == 'Boots' || item.slot == 'Gloves' || item.slot == 'Helm' || item.slot == 'Leggings' || item.slot == 'Shoulders') {
          character.equipment.armor[item.slot] = item;
        }
        if (item.slot == 'Accessory1' || item.slot == 'Accessory2' || item.slot == 'Ring1' || item.slot == 'Ring2' || item.slot == 'Amulet') {
          character.equipment.trinkets[item.slot] = item;
        }
        if (item.slot == 'WeaponA1 ' || item.slot == 'WeaponA2' || item.slot == 'WeaponB1' || item.slot == 'WeaponB2') {
          character.equipment.weapons[item.slot] = item;
        }
        if (item.slot == 'HelmAquatic' || item.slot == 'WeaponAquaticA' || item.slot == 'WeaponAquaticB') {
          character.equipment.underwater[item.slot] = item;
        }
      });

      getGuild(character.guild).then(function (characterDetails) {
        results.push(characterDetails);
      });
      return $q.all(results).then(function () {
        return character;
      });
    }
  }

})();
