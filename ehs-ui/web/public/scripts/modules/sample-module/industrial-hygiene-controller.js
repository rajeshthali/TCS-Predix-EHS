define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';
	controllers.controller('industrialHygiene', [ '$scope', '$http', '$state','NewhygnService', 'AuthService', '$rootScope','$interval', function($scope, $http, $state,NewhygnService, AuthService, $rootScope,$interval) {
		/*$('.loaderpg').css('display', 'block');
		$('.lad_img').css('display', 'block');*/
		$scope.loading = true;
		var avgHygiene = null;
		var floorArray = [];
		$scope.floordata = [];
		var maxFloor = 3;
		var maxOpacity = .99;
		var interval = 25 * 1000;
		$scope.hygieneLoading = true;
		if (!$rootScope.floor) {
			$rootScope.floor = 0;
		}
		$scope.floors = [ {
			name : 'F1',
			id : 0
		}, {
			name : 'F2',
			id : 1
		}, {
			name : 'F3',
			id : 2
		} ];
		
		$scope.changeFloor = function(floor) {
			if (!$scope.hygieneLoading) {
				$scope.loading = true;
				//hygieneCharts = [];
				//$scope.stop();
				$rootScope.floor = floor;
				$scope.tabIndex = 0;
				$scope.hygieneLoading = false;
				//$scope.hygieneData = null;
				loadData();
			}
		};
		
		
		 console.log($rootScope.floor);
		 var loadData = function() {
			 $scope.floordata = [];
			 $scope.hygnareaName = null;
				$scope.hygieneLoading = true;
				AuthService.getTocken(function(token) {
					loadhygndata($rootScope.floor);
					
				});
			};
			loadData();
			var loadhygndata = function(floor) {
				
				//$scope.aqiMachineLoading = true;
				NewhygnService.getHygieneValues(floor, interval, function(res) {
					//console.log("res.length" +res.length);
					$scope.loading = false;
					if (res.length > 0) {
						$scope.hygnareaName = res[0].assets;
						$scope.asslen = $scope.hygnareaName.length;
					}
					
					
					
					for (var i = 0; i < $scope.asslen; i++) {
						avgHygiene = hygieneAvg(res[0].assets[i].data);
						$scope.floordata.push(avgHygiene);
						
						
					}
					
					//console.log("floordata" +  JSON.stringify($scope.floordata));
					//console.log("asset length" + JSON.stringify($scope.hygnareaName));
					
					//avgHygiene = hygieneAvg(res[0].assets[0].data);
					//avgHygiene = res[0].assets[0].data;
					//$scope.hygndata = res;
					//console.log("data" + JSON.stringify($scope.hygndata));
					//console.log('hygiene > ' +JSON.stringify( avgHygiene));
				});
				$scope.hygieneLoading = false;
			};
		
		
		
			var hygieneAvg = function(data) {
				// console.log(JSON.stringify(data));
				// console.log(data.length);
				var resObject = {
					humidity : 0.0,
					noise : 0.0,
					temperature : 0.0
				};
				for (var i = 0; i < data.length; i++) {
					resObject.humidity += data[i].humidity;
					resObject.noise += data[i].noise;
					resObject.temperature += data[i].temperature;
				}
				resObject.humidity = Number((resObject.humidity / data.length).toFixed(2));
				resObject.noise = Number((resObject.noise / data.length).toFixed(2));
				resObject.temperature = Number((resObject.temperature / data.length).toFixed(2));

				return resObject;
			};
		
		
			$scope.$on('$destroy', function() {
				$scope.stop();
			});

			
	

		$scope.gotoDetailsView = function() {
			$state.go('hygiene-details');
		};

	} ]);
});