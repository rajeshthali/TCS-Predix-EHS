define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';
	controllers.controller('industrialHygiene', [ '$scope', '$http', '$state', 'HygieneService', 'AuthService', '$rootScope', function($scope, $http, $state, HygieneService, auth, $rootScope) {
		$('.loaderpg').css('display', 'block');
		$('.lad_img').css('display', 'block');
		var getValues = function() {
			
			HygieneService.dashboardValues().success(function(data) {
				$('.loaderpg').css('display', 'none');
				$('.lad_img').css('display', 'none');
				$scope.values = data.body;
				$scope.smt_1_value = $scope.values[0];
				console.log("generated value_1: " +$scope.smt_1_value.humidity);
				console.log("generated value_2: " +$scope.smt_1_value.noise);
				console.log("generated value_3: " +$scope.smt_1_value.temperature);
				
			    $scope.smt_2_value = $scope.values[1];
				console.log("generated value_1: " +$scope.smt_2_value.humidity);
				console.log("generated value_2: " +$scope.smt_2_value.noise);
				console.log("generated value_3: " +$scope.smt_2_value.temperature);
				
				$scope.pgf_value = $scope.values[2];
				console.log("generated value_1: " +$scope.pgf_value.humidity);
				console.log("generated value_2: " +$scope.pgf_value.noise);
				console.log("generated value_3: " +$scope.pgf_value.temperature);
				
			})

		};

		if (!$rootScope.token) {
			auth.getTocken(function(token) {
				getValues();
				
			});
		} else {
			getValues();
		}

		
		
		// getValues();
	/*	$scope.selectTab = function(slector) {
			switch (slector) {
			case 'x1':
				$scope.value = $scope.values[0];
				console.log("hygiene values" +$scope.values);
				console.log("generated value_1: " +$scope.value.humidity);
				console.log("generated value_2: " +$scope.value.noise);
				console.log("generated value_3: " +$scope.value.temperature);
				
				break;
			case 'x2':
				$scope.value = $scope.values[1];
				console.log("generated value_1: " +$scope.value.humidity);
				console.log("generated value_2: " +$scope.value.noise);
				console.log("generated value_3: " +$scope.value.temperature);
				break;
			case 'x3':
				$scope.value = $scope.values[2];
				console.log("generated value_1: " +$scope.value.humidity);
				console.log("generated value_2: " +$scope.value.noise);
				console.log("generated value_3: " +$scope.value.temperature);
				break;

			default:
				break;
			}
		};*/

		$scope.gotoDetailsView = function() {
			$state.go('industrial-hygiene-details');
		};

	} ]);
});