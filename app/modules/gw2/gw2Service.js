(function () {
  'use strict';

  angular.module('gw2')
    .factory('gw2Factory', gw2Factory)
    .service('sidenavService', sidenavService)
    .service('dialogService', dialogService)
    .directive("bindCompiledHtml", function ($compile, $timeout) {
      return {
        template: '<div></div>',
        scope: {
          rawHtml: '=bindCompiledHtml'
        },
        link: function (scope, elem, attrs) {
          scope.$watch('rawHtml', function (value) {
            if (!value) return;
            value = value.replace(/\r?\n|\r/g, '<br>');
            if(value.indexOf('<c=') != -1)
            {
              var indexOfStart = value.indexOf('<c=');
              var indexOfEnd = value.indexOf('</c>') + 4;
              var gw2Text = value.substring(indexOfStart,indexOfEnd);
              var cssClass = gw2Text.substring(gw2Text.indexOf('@')+1,gw2Text.indexOf('>'));
              console.log(cssClass);
              var myText= gw2Text.replace('=@'+cssClass+'>',' class="'+cssClass+'">');
              myText= myText.replace('<c','<div');
              myText= myText.replace('/c>','/div>');
              console.log(myText);
              value = value.replace(gw2Text,myText);
            }
            var newElem = $compile('<span>'+value+'</span>')(scope.$parent);
            elem.contents().remove();
            elem.append(newElem);
          });
        }
      };
    })

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
