define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';
	controllers.controller('AqiController', [ '$scope', '$http', '$state', '$log', 'PredixAssetService', 'PredixViewService', 'CalculationOneService', 'CalculationService', '$interval', 'AqiService', '$rootScope', 'AuthService', 'HygieneService', 'DashBoardService',
			function($scope, $http, $state, $log, PredixAssetService, PredixViewService, CalculationOneService, CalculationService, $interval, AqiService, $rootScope, AuthService, HygieneService, DashBoardService) {

				$scope.aqiAreaLoading = true;
				$scope.aqiAreaComparisonLoading = true;
				$scope.aqiMachineLoading = true;
				$scope.aqiAreaData = [];
				$scope.aqiMachineData = [];
				var interval = 30 * 1000;
				if (!$rootScope.floor) {
					$rootScope.floor = 0;
				}

				console.log($rootScope.floor);
				var loadData = function() {
					AuthService.getTocken(function(token) {
						loadAqiMachine($rootScope.floor);
						loadAqiArea($rootScope.floor);
					});
				};
				loadData();
				var loadAqiMachine = function(floor) {
					$scope.aqiMachineLoading = true;
					DashBoardService.getAqiMachineValues(floor, interval, function(res) {
						if (res.length > 0) {
							$scope.aqiMachineData = res[0].assets;
						}
						$("#aqi-machine-tab-content").fadeIn();
						$scope.aqiMachineLoading = false;
					});
				};

				var loadAqiArea = function(floor) {
					$scope.aqiAreaLoading = true;
					$scope.aqiAreaComparisonLoading = true;
					DashBoardService.getAqiAreaValues(floor, interval, function(res) {
						if (res.length > 0) {
							$scope.aqiAreaData = res[0].assets;
						}

						$scope.aqiAreaLoading = false;
						$scope.aqiAreaComparisonLoading = false;
						$("#aqi-area-tab-content").fadeIn();
					});
				};

			} ]);

});