define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';
	controllers.controller('AqiController', [ '$scope', '$http', '$state', '$log', 'PredixAssetService', 'PredixViewService', 'CalculationOneService', 'CalculationService', '$interval', 'AqiService', '$rootScope', 'AuthService', 'HygieneService', 'DashBoardService',
			function($scope, $http, $state, $log, PredixAssetService, PredixViewService, CalculationOneService, CalculationService, $interval, AqiService, $rootScope, AuthService, HygieneService, DashBoardService) {

				$scope.aqiAreaLoading = true;
				$scope.aqiAreaComparisonLoading = true;
				$scope.aqiMachineLoading = true;
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
					var machineTab = $("#aqi-machine-tab");
					var machineTabContent = $("#aqi-machine-tab-content");
					DashBoardService.getAqiMachineValues(floor, interval, function(res) {
						for (var i = 0; i < res.length; i++) {
							for (var j = 0; j < res[i].assets.length; j++) {
								if (j == 0) {
									machineTab.append('<li class="active"><a data-toggle="tab" href="#" data-target="#aqi_machine_' + j + '">' + res[i].assets[j].assetName + '</a></li>');
									machineTabContent.append('<div id="aqi_machine_' + j + '" class="tab-pane fade in active">' + res[i].assets[j].assetName + '</div>');
								} else {
									machineTab.append('<li ><a data-toggle="tab" href="#" data-target="#aqi_machine_' + j + '">' + res[i].assets[j].assetName + '</a></li>');
									machineTabContent.append('<div id="aqi_machine_' + j + '" class="tab-pane fade in">' + res[i].assets[j].assetName + '</div>');
								}
							}
						}
						$("#aqi-machine-tab-content").fadeIn();
						$scope.aqiMachineLoading = false;
					});
				};

				var loadAqiArea = function(floor) {
					$scope.aqiAreaLoading = true;
					$scope.aqiAreaComparisonLoading = true;
					var areaTab = $("#aqi-area-tab");
					var areaTabContent = $("#aqi-area-tab-content");
					DashBoardService.getAqiAreaValues(floor, interval, function(res) {
						for (var i = 0; i < res.length; i++) {
							for (var j = 0; j < res[i].assets.length; j++) {
								if (j == 0) {
									areaTab.append('<li class="active"><a data-toggle="tab" href="#" data-target="#aqi_area_' + j + '">' + res[i].assets[j].assetName + '</a></li>');
									areaTabContent.append('<div id="aqi_area_' + j + '" class="tab-pane fade in active">' + res[i].assets[j].assetName + '</div>');
								} else {
									areaTab.append('<li ><a data-toggle="tab" href="#" data-target="#aqi_area_' + j + '">' + res[i].assets[j].assetName + '</a></li>');
									areaTabContent.append('<div id="aqi_area_' + j + '" class="tab-pane fade in">' + res[i].assets[j].assetName + '</div>');
								}

							}
						}
						$scope.aqiAreaLoading = false;
						$scope.aqiAreaComparisonLoading = false;
						$("#aqi-area-tab-content").fadeIn();
					});
				};

			} ]);

});