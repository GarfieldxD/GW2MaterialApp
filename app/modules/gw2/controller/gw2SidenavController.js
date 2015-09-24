(function () {

	angular
		.module('gw2')
		.controller('sidenavController', ['$scope',  'sidenavService', pandpInventoryController]);

	function pandpInventoryController($scope,  sidenavService) {
		$scope.ToggleLeft = sidenavService.ToggleSidenav('left');
	}

})();
