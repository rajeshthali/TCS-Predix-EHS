define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';
	controllers.controller('HygieneDetailsPageController', [ '$state', '$timeout', '$interval', '$scope', '$rootScope', '$http', '$log', 'PredixAssetService', 'PredixViewService', 'AuthService', 'HygieneService', 'DashBoardService', '$stateParams',
			function($state, $timeout, $interval, $scope, $rootScope, $http, $log, PredixAssetService, PredixViewService, AuthService, HygieneService, DashBoardService, $stateParams) {
				var hygieneCharts = [];
				$scope.hygieneData = null;
				$scope.floor = 0;
				$scope.tabIndex = 0;
				var promise = 0;
				$scope.hygieneLoading = false;
				var hygieneInterval = null;
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
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

				$scope.$on('$destroy', function() {
					$scope.stop();
				});

				$scope.stop = function() {
					$interval.cancel(promise);
				};

				$scope.changeFloor = function(floor) {
					if (!$scope.hygieneLoading) {
						hygieneCharts = [];
						$scope.stop();
						$scope.floor = floor;
						$scope.tabIndex = 0;
						$scope.hygieneLoading = false;
						$scope.hygieneData = null;
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
				var startDynamiUpdate = function() {
					console.log('running startDynamiUpdate..');
					promise = $interval(function() {
						loadHygiene($scope.floor);
					}, 20000);
				};
				var loadHygiene = function(floor) {
					if (!$scope.hygieneData) {
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
							startDynamiUpdate();
						});
					} else {
						DashBoardService.getHygieneValues(floor, intervalDynamic, function(res) {

							var data = res[0].assets;
							// console.log($scope.hygieneData);
							for (var i = 0; i < data.length; i++) {
								var asset = data[i];
								data.temperature = [];
								data.humidity = [];
								data.noise = [];
								data.timestamp = [];
								for (var j = 0; j < asset.data.length; j++) {
									data.timestamp.push(asset.data[j].timestamp);
									data.humidity.push(asset.data[j].humidity);
									data.noise.push(asset.data[j].noise);
									data.temperature.push(asset.data[j].temperature);
								}
								var maxIndex = getMaxIndex(data);
								var series = getSeries($scope.tabIndex, data)
								var timestamps = DashBoardService.prettyMs([ data.timestamp[maxIndex] ])[0];
								if (i < hygieneCharts[$scope.tabIndex].series.length - 1) {
									var l = hygieneCharts[$scope.tabIndex].series[0].data.length;
									if (l > 0) {
										var lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
										if (!lastTimeStamp) {
											lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
										}
										if (lastTimeStamp !== timestamps) {
											hygieneCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], false, true);
											//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
										} else {
											//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
										}
									}

								} else {
									var l = hygieneCharts[$scope.tabIndex].series[0].data.length;
									if (l > 0) {
										var lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
										if (!lastTimeStamp) {
											lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
										}
										if (lastTimeStamp !== timestamps) {
											hygieneCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], true, true);
											//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
										} else {
											//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
										}
									}

								}

							}

						});
					}
				};

				var getMaxIndex = function(data) {
					var big = 0;
					var index = 0;
					for (var i = 0; i < data.timestamp.length; i++) {
						if (big < data.timestamp[i]) {
							big = data.timestamp[i];
							index = i;
						}
					}
					return index;
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

				var getSeries = function(tabIndex, dataArg) {
					var colors = [ '#8BBE3D', '#00acec', '#242326', '#ff9000', '#8bd6f6', '#8669ff', '#28b779' ];
					var series = [];
					var data = null;
					if (dataArg) {
						data = dataArg;
					} else {
						data = $scope.hygieneData[tabIndex];
					}
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
