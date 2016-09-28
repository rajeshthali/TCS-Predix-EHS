define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';
	controllers.controller('HygieneDetailsPageController', [ '$state', '$timeout', '$interval', '$scope', '$rootScope', '$http', '$log', 'PredixAssetService', 'PredixViewService', 'AuthService', 'HygieneService', 'DashBoardService', '$stateParams',
			function($state, $timeout, $interval, $scope, $rootScope, $http, $log, PredixAssetService, PredixViewService, AuthService, HygieneService, DashBoardService, $stateParams) {
				var hygieneCharts = [];
				$scope.hygieneData = [];
				$scope.floor = 0;
				$scope.tabIndex = 0;
				$scope.hygieneLoading = false;
				var interval = 1000 * 60 * 2;
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
						$scope.floor = floor;
						$scope.tabIndex = 0;
						$scope.hygieneLoading = false;
						$scope.hygieneData = [];
						loadData();
					}
				};

				var loadData = function() {
					$scope.hygieneLoading = true;
					AuthService.getTocken(function(token) {
						loadHygiene($scope.floor);
					});
				};
				loadData();
				var loadHygiene = function(floor) {
					DashBoardService.getHygieneValues(floor, interval, function(res) {

						$scope.hygieneData = res[0].assets;
						// console.log($scope.hygieneData);

						for (var i = 0; i < $scope.hygieneData.length; i++) {
							var asset = $scope.hygieneData[i];
							$scope.hygieneData[i].temperature = [];
							$scope.hygieneData[i].humidity = [];
							$scope.hygieneData[i].noise = [];
							$scope.hygieneData[i].timestamp = [];
							for (var j = 0; j < asset.data.length; j++) {
								$scope.hygieneData[i].timestamp.push(asset.data[j].timestamp);
								$scope.hygieneData[i].humidity.push(asset.data[j].humidity);
								$scope.hygieneData[i].noise.push(asset.data[j].noise);
								$scope.hygieneData[i].temperature.push(asset.data[j].temperature);
							}
						}
						$scope.hygieneLoading = false;
						$scope.selectTab($scope.tabIndex);
					});
				};
				$scope.selectTab = function(index) {
					$scope.tabIndex = index;
					$('.hygiene_details_graph_class').hide();
					setTimeout(function() {
						$('.hygiene_details_graph_class').fadeIn();
						loadValuesToGraph('#hygiene_chart_' + index, index);
					}, 300);
				};

				var loadValuesToGraph = function(id, tabIndex) {
					// console.log(id + ' >> ' + tabIndex);
					$(id).each(function() {
						// console.log('each');
						var chart = new Highcharts.Chart({
							type : 'spline',
							animation : Highcharts.svg,
							marginRight : 10,
							chart : {
								renderTo : this
							},
							title : {
								text : ''
							},
							tooltip : {
								formatter : function() {
									return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
								}
							},
							exporting : {
								enabled : false
							},

							plotOptions : {
								series : {
									lineWidth : 1,
									marker : {
										enabled : false,
									},
								}
							},
							credits : {
								enabled : false
							},

							xAxis : {
								title : {
									text : 'Time'
								},
								categories : DashBoardService.prettyMs($scope.hygieneData[tabIndex].timestamp)
							},

							yAxis : {
								title : {
									text : 'Hygiene Values'
								},
							},

							series : getSeries(tabIndex)

						});
						hygieneCharts[tabIndex] = chart;

					});
				}

				var getSeries = function(tabIndex) {
					var colors = [ '#8BBE3D', '#00acec', '#242326', '#ff9000', '#8bd6f6', '#8669ff', '#28b779' ];
					var series = [];
					var data = $scope.hygieneData[tabIndex];
					series.push({
						name : 'humidity',
						data : data.humidity,
						type : 'spline',
						color : colors[0],
						lineWidth : 1,
						marker : {
							enabled : false,
						}
					});

					series.push({
						name : 'Noise',
						data : data.noise,
						type : 'spline',
						color : colors[1],
						lineWidth : 1,
						marker : {
							enabled : false,
						}
					});

					series.push({
						name : 'Temperature',
						data : data.temperature,
						type : 'spline',
						color : colors[2],
						lineWidth : 1,
						marker : {
							enabled : false,
						}
					});

					return series;
				};

			} ]);
});
