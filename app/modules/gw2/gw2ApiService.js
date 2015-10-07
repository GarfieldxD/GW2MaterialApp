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
      GetWallet: getWallet,
      GetBank: getBank,
      GetMaterials: getMaterials
    };
    return service;

    function tokenInfo() {
      var deferred = $q.defer();
      $http.get(API_URL + 'v2/tokeninfo?access_token=' + gw2Factory.apiKey).success(function (tokenInformation) {
        deferred.resolve(tokenInformation);
      });
      return deferred.promise;
    }

    function getBank() {
      return $http.get(API_URL + 'v2/account/bank?lang=de&access_token=' + gw2Factory.apiKey)
        .then(function (data) {
          var ids = [];
          var skins = [];
          data.data.forEach(function (item) {
            if (item) {
              if (ids.indexOf(item.id) == -1 && gw2Factory.items[item.id] == null) {
                ids.push(item.id);
              }
              if (item.skin) {
                if (skins.indexOf(item.skin) == -1 && gw2Factory.skins[item.skin] == null) {
                  ids.push(item.skin);
                }
              }
              if (item.upgrades) {
                item.upgrades.forEach(function (upgrade) {
                  if (ids.indexOf(upgrade) == -1 && gw2Factory.items[upgrade] == null) {
                    ids.push(upgrade);
                  }
                });
              }
              if (item.infusions) {
                item.infusions.forEach(function (infusion) {
                  if (ids.indexOf(infusion) == -1 && gw2Factory.items[infusion] == null) {
                    ids.push(infusion);
                  }
                });
              }
            }
          });
          var idResults = getItemDetails(ids.toString());
          var skinResults = getSkinDetails(skins.toString());

          return $q.all([idResults, skinResults]).then(function (results) {
            var bank = [];
            var slot = 0;
            var counter = 0;
            data.data.forEach(function (item) {
              if (item) {
                fillItem(item, results[0], results[1]);
              }
              if (!bank[slot]) {
                bank[slot] = [];
              }
              bank[slot].push(item);
              counter++;
              if (counter == 30) {
                counter = 0;
                slot++;
              }
            });
            return bank;
          });
        });
    }

    function getMaterials() {
      return $http.get(API_URL + 'v2/account/materials?lang=de&access_token=' + gw2Factory.apiKey)
        .then(function (data) {
          var ownedMaterials = data.data;
          var materials = [];
          return $http.get(API_URL + 'v2/materials')
            .then(function (data) {
              var results = [];
              data.data.forEach(function (categorie) {
                results.push($http.get(API_URL + 'v2/materials/' + categorie));
              });

              return $q.all(results).then(function (results) {
                var materialInformation = [];
                results.forEach(function (result) {
                  materialInformation.push(result.data);
                });
                return materialInformation;
              });
            })
            .then(function (materialInformation) {
              var results = [];
              materialInformation.forEach(function (item) {
                var ids = [];
                item.items.forEach(function (itemId) {
                  if (!gw2Factory.items[itemId]) {
                    ids.push(itemId);
                  }
                });
                if (ids.length > 0) {
                  results.push(getItemDetails(ids.toString()));
                }
              });
              return $q.all(results).then(function (results) {
                var itemDetails = [];
                results.forEach(function (result) {
                  result.forEach(function (itemDetail) {
                    itemDetails.push(itemDetail);
                  });
                });
                var help = [];
                var index = 0;
                materialInformation.forEach(function (item) {
                  var newMaterialCategorie = {};
                  angular.forEach(item, function (key, value) {
                    newMaterialCategorie[value] = key;
                  });
                  newMaterialCategorie.items = [];
                  item.items.forEach(function (itemId) {
                    itemId = {
                      id: itemId
                    };
                    fillItem(itemId, itemDetails, []);
                    newMaterialCategorie.items.push(itemId);
                  });
                  help.push(newMaterialCategorie);
                  index++;
                });
                gw2Factory.Save();
                return help;
              });
            })
            .then(function(materialCategories){
              materialCategories.forEach(function(categorie){
                categorie.items.forEach(function(item){
                  ownedMaterials.forEach(function(ownedMaterial){
                    if(item.id == ownedMaterial.id)
                    {
                      item.count = ownedMaterial.count;
                    }
                  });
                });
              });
              console.log(materialCategories);
              return materialCategories;
            });
        });
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
      if (gw2Factory.account) {
        return new Promise(function (resolve) {
          resolve(gw2Factory.account);
        });;
      }
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
            gw2Factory.account = account;
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
      if (gw2Factory.guilds[guildId]) {
        deferred.resolve(gw2Factory.guilds[guildId]);
      }
      else {
        $http.get(API_URL + 'v1/guild_details.json?guild_id=' + guildId).success(function (guild) {
          gw2Factory.guilds[guildId] = guild;
          gw2Factory.Save();
          deferred.resolve(guild);
        });
      }
      return deferred.promise;
    }

    function getItemDetails(itemIds) {
      var deferred = $q.defer();
      if (itemIds.length > 0) {
        $http.get(API_URL + 'v2/items?lang=de&ids=' + itemIds).success(function (itemDetails) {
          deferred.resolve(itemDetails);
        });
      }
      else {
        deferred.resolve([]);
      }
      return deferred.promise;
    }

    function getSkinDetails(skinIds) {
      var deferred = $q.defer();
      if (skinIds.length > 0) {
        $http.get(API_URL + 'v2/skins?lang=de&ids=' + skinIds).success(function (skinDetails) {
          deferred.resolve(skinDetails);
        });
      }
      else {
        deferred.resolve([]);
      }
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
        gw2Factory.Save();
        return character;
      });
    }

    function fillItem(item, itemDetails, skinDetails) {
      var itemDetail = getDetailsFromArray(item.id, itemDetails);
      var skinDetail = getDetailsFromArray(item.skin, skinDetails);
      
      //Adding Item Details to Factory
      if (!gw2Factory.items[item.id]) {
        gw2Factory.items[item.id] = itemDetail;
      }
      if (itemDetail == null) {
        itemDetail = gw2Factory.items[item.id];
      }
      
      //Adding Skin Details to Factory
      if (item.skin) {
        if (!gw2Factory.skins[item.skin]) {
          gw2Factory.skins[item.skin] = skinDetail;
        }
      }
      if (skinDetail == null) {
        skinDetail = gw2Factory.skins[item.skin];
      }

      fillItemWithDetails(itemDetail, skinDetail, item);
      itemDetail = null;
      skinDetail = null;
      if (item.upgrades) {
        var upgrades = [];
        item.upgrades.forEach(function (upgrade) {
          itemDetail = null;
          itemDetail = getDetailsFromArray(upgrade, itemDetails);
          if (!gw2Factory.items[upgrade]) {
            gw2Factory.items[upgrade] = itemDetail;
            gw2Factory.Save();
          }
          if (itemDetail == null) {
            itemDetail = gw2Factory.items[upgrade];
          }
          upgrades.push(fillItemWithDetails(itemDetail, null, upgrade));
        });
        item.upgrades = upgrades;
      }
      if (item.infusions) {
        var infusions = [];
        item.infusions.forEach(function (infusion) {
          itemDetail = null;
          itemDetail = getDetailsFromArray(infusion, itemDetails);
          if (!gw2Factory.items[infusion]) {
            gw2Factory.items[infusion] = itemDetail;
            gw2Factory.Save();
          }
          if (itemDetail == null) {
            itemDetail = gw2Factory.items[infusion];
          }
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
        push(eq.id);
        if (eq.upgrades) {
          eq.upgrades.forEach(function (upgrade) {
            push(upgrade);
          });
        }
        if (eq.infusions) {
          eq.infusions.forEach(function (infusion) {
            push(infusion);
          });
        }
      });
      character.bags.forEach(function (bag) {
        push(bag.id);
        bag.inventory.forEach(function (item) {
          if (item) {
            push(item.id);
            if (item.upgrades) {
              item.upgrades.forEach(function (upgrade) {
                push(upgrade);
              });
            }
            if (item.infusions) {
              item.infusions.forEach(function (infusion) {
                push(infusion);
              });
            }
          }
        });
      });
      return ids;

      function push(id) {
        if (ids.indexOf(id) == -1 && gw2Factory.items[id] == null) {
          ids.push(id);
        }
      }
    }

    function getAllSkinIdsFromCharacter(character) {
      var skins = [];
      character.equipment.forEach(function (eq) {
        if (eq.skin) {
          push(eq.skin);
        }
      });
      character.bags.forEach(function (bag) {
        if (bag.skin) {
          push(bag.id);
        }

        bag.inventory.forEach(function (item) {
          if (item) {
            if (item.skin) {
              push(item.skin);
            }
          }
        });
      });
      return skins;
      function push(id) {
        if (skins.indexOf(id) == -1 && gw2Factory.skins[id] == null) {
          skins.push(id);
        }
      }
    }
  }

})();