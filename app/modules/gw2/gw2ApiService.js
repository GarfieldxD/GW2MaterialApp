(function () {
  'use strict';
  var API_URL = 'https://api.guildwars2.com/';
  angular.module('gw2')
    .factory('gw2Api', gw2Api);

  function gw2Api($http, gw2Factory, $q, $state) {
    var service = {
      TokenInfo: tokenInfo,
      AccountInfo: accountInfo,
      GetCharacter: getCharacter,
      GetCharacterDetails: getCharacterDetails,
      GetWallet: getWallet
    };
    return service;

    function tokenInfo() {
      var deferred = $q.defer();
      $http.get(API_URL + 'v2/tokeninfo?access_token=' + gw2Factory.apiKey).success(function (tokenInformation) {
        deferred.resolve(tokenInformation);
      });
      return deferred.promise;
    }

    function getWallet() {
      return $http.get(API_URL + 'v2/account/wallet?lang=de&access_token=' + gw2Factory.apiKey)
        .then(function (account) {
          return account.data;
        })
        .then(function (wallet) {
          var results = [];

          wallet.forEach(function (item) {
            results.push($http.get(API_URL + 'v2/currencies/' + item.id));
          })

          return $q.all(results).then(function (walletDetails) {
            console.log(walletDetails);
            wallet.forEach(function (item) {
              walletDetails.forEach(function (result) {
                if (item.id == result.data.id) {
                  angular.forEach(result.data, function (key, value) {
                    if (value === "name" && item.id === 1) {
                      item[value] = "Gold";
                    }
                    else {
                      item[value] = key;
                    }
                  });
                }
              });
            });
            return wallet;
          });
        });
    }

    function accountInfo() {
      return $http.get(API_URL + 'v2/account?access_token=' + gw2Factory.apiKey)
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
            gw2Factory.guilds = results;
            return account;
          });

        });
    }

    function getCharacter() {
      return $http.get('https://api.guildwars2.com/v2/characters?page=0&page_size=200&access_token=' + gw2Factory.apiKey)
        .then(function (result) {
          return result.data;
        })
        .then(function (character) {
          character.forEach(function (character) {
            getCharacterInformations(character);
          });
          return character;
        });
    }

    function getCharacterInformations(character) {
      character.age = parseInt(character.age / 3600);
      if (character.guild) {
        getGuild(character.guild).then(function (guildDetails) {
          character.guild = guildDetails;
          gw2Factory.characters.push(character);
        });
      }
    }


    function getCharacterDetails(characterName) {
      return $http.get(API_URL + 'v2/characters/' + characterName + '?lang=de&access_token=' + gw2Factory.apiKey)
        .then(function (data) {
          var characterDetails = data.data;
          characterDetails.age = parseInt(characterDetails.age / 3600);
          if (characterDetails.guild) {
            return getGuild(characterDetails.guild)
              .then(function (guildDetails) {
                characterDetails.guild = guildDetails;
                return characterDetails;
              });
          }
          return characterDetails;
        })
        .then(function (characterDetails) {
          return createItemDetails(characterDetails);
        });
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

    function getItemDetails(itemIds) {
      var deferred = $q.defer();
      $http.get(API_URL + 'v2/items?lang=de&ids=' + itemIds).success(function (itemDetails) {
        deferred.resolve(itemDetails);
      });
      return deferred.promise;
    }

    function getSkinDetails(skinIds) {
      var deferred = $q.defer();
      $http.get(API_URL + 'v2/skins?lang=de&ids=' + skinIds).success(function (skinDetails) {
        deferred.resolve(skinDetails);
      });
      return deferred.promise;
    }

    function setHeader() {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + gw2Factory.apiKey;
    }

    function createItemDetails(character) {
      var items = character.equipment;
      var ids = getAllItemIdsFromCharacter(character);
      var skins = getAllSkinIdsFromCharacter(character);
      character.equipment = {
        weapons: {
          first: {},
          second: {}
        },
        armor: {},
        trinkets: {},
        tools: {},
        underwater: {}
      };
      var itemDetails = getItemDetails(ids.toString());
      var skinDetails = getSkinDetails(skins.toString());
      if (!character.guild.guild_name) {
        getGuild(character.guild).then(function (guildDetails) {
          character.guild = guildDetails;
        });
      }
      return $q.all([itemDetails, skinDetails]).then(function (details) {
        character.bags.forEach(function (bag) {
          fillItem(bag, details[0], details[1]);

          bag.inventory.forEach(function (item) {
            if (item) {
              fillItem(item, details[0], details[1]);
            }
          });
        });
        items.forEach(function (item) {
          if (item.slot == 'Sickle' || item.slot == 'Pick' || item.slot == 'Axe') {
            fillItem(item, details[0], details[1]);
            character.equipment.tools[item.slot] = item;
          }
          if (item.slot == 'HelmAquatic' || item.slot == 'Coat' || item.slot == 'Boots' || item.slot == 'Gloves' || item.slot == 'Helm' || item.slot == 'Leggings' || item.slot == 'Shoulders') {
            fillItem(item, details[0], details[1]);
            character.equipment.armor[item.slot] = item;
          }
          if (item.slot == 'Accessory1' || item.slot == 'Accessory2' || item.slot == 'Ring1' || item.slot == 'Ring2' || item.slot == 'Amulet' || item.slot == 'Backpack') {
            fillItem(item, details[0], details[1]);
            character.equipment.trinkets[item.slot] = item;
          }
          if (item.slot == 'WeaponA1' || item.slot == 'WeaponA2') {
            fillItem(item, details[0], details[1]);
            character.equipment.weapons.first[item.slot] = item;
          }
          if (item.slot == 'WeaponB1' || item.slot == 'WeaponB2') {
            fillItem(item, details[0], details[1]);
            character.equipment.weapons.second[item.slot] = item;
          }
          if (item.slot == 'WeaponAquaticA' || item.slot == 'WeaponAquaticB') {
            fillItem(item, details[0], details[1]);
            character.equipment.underwater[item.slot] = item;
          }
        });
        return character;
      });
    }
  }

  function fillItem(item, itemDetails, skinDetails) {
    var itemDetail = getDetailsFromArray(item.id, itemDetails);
    var skinDetail = getDetailsFromArray(item.skin, skinDetails);
    fillItemWithDetails(itemDetail, skinDetail, item);
    if (item.upgrades) {
      var upgrades = [];
      item.upgrades.forEach(function (upgrade) {
        itemDetail = getDetailsFromArray(upgrade, itemDetails);
        upgrades.push(fillItemWithDetails(itemDetail, null, upgrade));
      });
      item.upgrades = upgrades;
    }
    if (item.infusions) {
      var infusions = [];
      item.infusions.forEach(function (infusion) {
        itemDetail = getDetailsFromArray(infusion, itemDetails);
        infusions.push(fillItemWithDetails(itemDetail, null, infusion));
      });
      item.infusions = infusions;
    }
  }

  function fillItemWithDetails(itemDetails, skinDetails, item) {
    if (skinDetails) {
      angular.forEach(skinDetails, function (key, value) {
        if (value === 'name' || value === 'icon') {
          item[value] = key;
        }
      });
      item.original = {};
      angular.forEach(itemDetails, function (key, value) {
        if (!item[value]) {
          item[value] = key;
        }
        else {
          item.original[value] = key;
        }
      });
    }
    else {
      if (!isNaN(item)) {
        item = {
          id: item
        };
      }
      angular.forEach(itemDetails, function (key, value) {
        item[value] = key;
      });
    }
    return item;
  }

  function getDetailsFromArray(id, arr) {
    var returnItem = null;
    arr.forEach(function (item) {
      if (item.id == id) {
        returnItem = item;
      }
    });
    return returnItem;
  }

  function getAllItemIdsFromCharacter(character) {
    var ids = [];
    character.equipment.forEach(function (eq) {
      ids.push(eq.id);
      if (eq.upgrades) {
        eq.upgrades.forEach(function (upgrade) {
          ids.push(upgrade);
        });
      }
      if (eq.infusions) {
        eq.infusions.forEach(function (infusion) {
          ids.push(infusion);
        });
      }
    });
    character.bags.forEach(function (bag) {
      ids.push(bag.id);
      bag.inventory.forEach(function (item) {
        if (item) {
          ids.push(item.id);
          if (item.upgrades) {
            item.upgrades.forEach(function (upgrade) {
              ids.push(upgrade);
            });
          }
          if (item.infusions) {
            item.infusions.forEach(function (infusion) {
              ids.push(infusion);
            });
          }
        }
      });
    });
    return ids;
  }

  function getAllSkinIdsFromCharacter(character) {
    var skins = [];
    character.equipment.forEach(function (eq) {
      if (eq.skin) {
        skins.push(eq.skin);
      }
    });
    character.bags.forEach(function (bag) {
      if (bag.skin) {
        skins.push(bag.id);
      }

      bag.inventory.forEach(function (item) {
        if (item) {
          if (item.skin) {
            skins.push(item.skin);
          }
        }
      });
    });
    return skins;
  }

})();



/*
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
      */