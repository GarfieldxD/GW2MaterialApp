(function (angular) {
	'use strict';
	angular.module('app')
		.factory('storage', function () {
			var storage = {};

			storage.GetFromStorage = function (identifier) {
				var item = localStorage.getItem(identifier);
				return JSON.parse(item);
			};

			storage.AddToStorage = function (identifier, object) {
				localStorage.setItem(identifier, JSON.stringify(object));
			};

			storage.UpdateItem = function (identifier, object) {
				storage.AddToStorage(identifier, object);
			};

			return storage;
		});

})(angular);