define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';

	// Controller definition
	controllers.controller('airqmainCtrl', [ '$scope', '$http', '$state', '$log', 'PredixAssetService', 'PredixViewService', 'CalculationOneService', 'CalculationService', '$interval', 'AqiService',
			'$rootScope', 'AuthService',
			function($scope, $http, $state, $log, PredixAssetService, PredixViewService, CalculationOneService, CalculationService, $interval, AqiService, $rootScope, AuthService) {
				var topChartSelector = '#topChart1';
				$scope.mostAqiValue = '';
				$scope.isLoading = true;
				$scope.isLoadingMachine = true;
				$scope.isLoadingLastWeek = true;
				// $scope.value = $stateparam.smtare;
				var hideGraphs = function() {
					$('.loaderpg').css('display', 'block');
					$('.lad_img').css('display', 'block');
					$('.CampaignPercent').css('visibility', 'hidden');
					$('.topChart').css('visibility', 'hidden');
					$('.rTop').css('visibility', 'hidden');

				};
				var showGraphs = function() {
					$('.loaderpg').css('display', 'none');
					$('.lad_img').css('display', 'none');
					$('.CampaignPercent').css('visibility', 'visible');
					$('.topChart').css('visibility', 'visible');
					$('.rTop').css('visibility', 'visible');

				};
				hideGraphs();
				var seperatedResult = null;
				var promise = null;
				var promise1 = null;
				var assetName = 'SMT Area';
				var assetName1 = 'Heller-Machine';
				var startFetching = function() {
					if (!$rootScope.token) {
						$scope.isLoading = true;
						AuthService.getTocken(function(token) {
							// console.log(token);
							// loadData_machine();

							loadData();

						});
					} else {
						// loadData_machine();
						loadData();

					}
				};
				var startFetching_machine = function() {
					$scope.isLoadingMachine = true;
					if (!$rootScope.token) {
						AuthService.getTocken(function(token) {
							// console.log(token);
							loadData_machine();
							// loadData();

						});
					} else {
						loadData_machine();
						// loadData();

					}
				};
				var findMaxValue = function(param, list) {
					var array = null;
					for (var i = 0; i < list.length; i++) {
						if (param === list[i].name) {
							array = list[i].values;
							break;
						}
					}
					var largest = 0;
					for (i = 0; i <= largest; i++) {
						if (array[i] > largest) {
							largest = array[i];
						}
					}
					return largest;
				};

				function loadData() {
					$scope.isLoading = true;
					$scope.isLoadingLastWeek = true;
					$scope.mostAqiValue = null;
					$scope.todayMaxAqiName = null;
					$scope.todayMostAqiValue = null;
					hideGraphs();
					AqiService.last10MinDataPoints(assetName, function(timestamps, values) {
						seperatedResult = values.seperatedResult;
						var count = 8;
						showGraphs();

						// console.log(values);
						$scope.mostAqiValue = values.maxAqi.name;
						$scope.updated_status = getStatus(values.maxAqi.name, values.maxAqi.aqiValue);
						// console.log($scope.updated_status);
						loadChart(topChartSelector, 0.0, 200.0, values.maxAqi.aqiValue);
						createChart(values.value.slice(Math.max(values.value.length - count, 1)), timestamps.slice(Math.max(timestamps.length - count, 1)));

						AqiService.lastWeekHighestAqiDataPoint(assetName, function(data) {
							// console.log(data);
							$scope.isLoadingLastWeek = true;
							$scope.todayMaxAqiName = values.maxAqi.name;
							$scope.todayMostAqiValue = values.maxAqi.aqiValue;

							switch (data.assetName) {
							case 'SMT Area':
								loadChart('#camp11', 0.0, 200.0, data.maxAqi.aqiValue);
								loadChart('#camp122', 0.0, 200.0, $scope.todayMostAqiValue);
								$scope.isCamp321Visible = (data.maxAqi.name != $scope.mostAqiValue);
								if ($scope.isCamp321Visible)
									loadChart('#camp121', 0.0, 200.0, findMaxValue(values.maxAqi.name, seperatedResult));
								$scope.camp11 = data.maxAqi.name;
								break;
							case 'Production Ground Floor':
								loadChart('#camp21', 0.0, 200.0, data.maxAqi.aqiValue);
								loadChart('#camp222', 0.0, 200.0, $scope.todayMostAqiValue);
								$scope.isCamp321Visible = (data.maxAqi.name != $scope.mostAqiValue);
								if ($scope.isCamp321Visible)
									loadChart('#camp221', 0.0, 200.0, findMaxValue(values.maxAqi.name, seperatedResult));
								$scope.camp21 = data.maxAqi.name;
								break;
							case 'Near Soldering Machine':
								loadChart('#camp31', 0.0, 200.0, data.maxAqi.aqiValue);
								loadChart('#camp322', 0.0, 200.0, $scope.todayMostAqiValue);
								$scope.isCamp321Visible = (data.maxAqi.name != $scope.mostAqiValue);
								if ($scope.isCamp321Visible)
									loadChart('#camp321', 0.0, 200.0, findMaxValue(values.maxAqi.name, seperatedResult));
								$scope.camp31 = data.maxAqi.name;
								break;

							default:
								break;
							}
							$scope.isLoadingLastWeek = false;
						}, function(error) {
							console.log(error);
							$scope.isLoadingLastWeek = false;
						});
						startRefreshData();
						$scope.isLoading = false;
					}, function(e) {
						console.log(e);
					});
				}
				var stillWorking = false;
				function startRefreshData() {
					promise = $interval(function() {
						if (!stillWorking) {
							// console.log("working");
							stillWorking = true;
							AqiService.last20SecDataPoints(assetName, function(timestamps, values) {
								$scope.mostAqiValue = values.maxAqi.name;
								$scope.updated_status = getStatus(values.maxAqi.name, values.maxAqi.aqiValue);
								loadChart(topChartSelector, 0.0, 200.0, values.maxAqi.aqiValue);
								for (var i = 0; i < charts.length; i++) {
									var chart = charts[i];
									for (var j = 0; j < values.value.length; j++) {
										if ((values.value.length - j) == 1) {
											chart.series[0].addPoint([ timestamps[j], values.value[j] ], true, true);
										} else {
										}
									}
								}
								stillWorking = false;
							}, function(e) {
								console.log(e);
								stillWorking = false;
							});
						} else {
							// console.log("not completed previous interval");
						}
					}, 7000);
				}

				function loadData_machine() {
					$scope.isLoadingMachine = true;
					// hideGraphs();
					AqiService.last10MinDataPoints(assetName1, function(timestamps, values) {
						// var count = 8;
						// showGraphs();
						// console.log(JSON.stringify(values));

						$scope.no2 = values.seperatedResult[0].values;
						$scope.so2 = values.seperatedResult[1].values;
						$scope.PM2_5 = values.seperatedResult[2].values;

						$scope.avg_NO2 = $scope.avg_fun($scope.no2);
						$scope.avg_SO2 = $scope.avg_fun($scope.so2);
						$scope.avg_PM2_5 = $scope.avg_fun($scope.PM2_5);

						// console.log($scope.avg_PM2_5);
						if ($scope.avg_NO2 > 80 || $scope.avg_SO2 > 80 || $scope.avg_PM2_5 > 60) {
							$scope.status_machine = "Warning";
							$scope.war_st = true;
						} else {
							$scope.status_machine = "Satisfactory";
							$scope.sats = true;

						}
						$scope.isLoadingMachine = false;
						startRefreshData_machine();

					}, function(e) {
						console.log(e);
						$scope.isLoadingMachine = false;
					});
				}
				var stillWorking1 = false;
				function startRefreshData_machine() {
					promise1 = $interval(function() {
						if (!stillWorking1) {
							// console.log("working");
							stillWorking1 = true;
							AqiService.last20SecDataPoints(assetName1, function(timestamps, values) {

								// console.log(JSON.stringify(values));

								$scope.no2 = values.seperatedResult[0].values;
								$scope.so2 = values.seperatedResult[1].values;
								$scope.PM2_5 = values.seperatedResult[2].values;
								// console.log("20sec"+$scope.PM2_5);

								$scope.avg_NO2 = $scope.avg_fun($scope.no2);
								$scope.avg_SO2 = $scope.avg_fun($scope.so2);
								$scope.avg_PM2_5 = $scope.avg_fun($scope.PM2_5);

								// console.log("20sec"+$scope.avg_PM2_5);

								if ($scope.avg_NO2 > 80 || $scope.avg_SO2 > 80 || $scope.avg_PM2_5 > 60) {
									$scope.status_machine = "Warning";
									$scope.war_st = true;
								} else {
									$scope.status_machine = "Satisfactory";
									$scope.sats = true;
								}

								stillWorking1 = false;
							}, function(e) {
								console.log(e);
								stillWorking1 = false;
							});
						} else {

						}
					}, 7000);
				}

				$scope.avg_fun = function(values) {
					// console.log("av data"+ values);
					var avg = 0.0;
					for (var i = 0; i < values.length; i++) {
						// console.log(values[i]);
						avg += values[i];
					}
					$scope.avg = avg / values.length;

					// console.log($scope.avg);
					// return $scope.avg ;

					return Math.round($scope.avg * 100) / 100;
				};

				
				var getStatus = function(prominentParameter, max) {
					// var aqiValue = {};
					// aqiValue.name = name;
					// aqiValue.avg = avg;
					var status = '';

					switch (prominentParameter) {
					case 'PM10':
						if (max >= 0 && max <= 50) {
							var status = 'Good';
						} else if (max >= 51 && max <= 100) {
							status = 'Satisfactory';

						} else if (max >= 101 && max <= 250) {
							status = 'Moderate';

						} else if (max >= 251 && max <= 350) {
							status = 'Poor';

						} else if (max >= 351 && max <= 430) {
							status = 'Very Poor';

						} else if (max > 430) {
							status = 'Severe';

						}

						break;
					case 'PM2_5':
						if (max >= 0 && max <= 30) {
							status = 'Good';

						} else if (max >= 31 && max <= 60) {
							status = 'Satisfactory';

						} else if (max >= 61 && max <= 90) {
							status = 'Moderate';

						} else if (max >= 91 && max <= 120) {
							status = 'Poor';

						} else if (max >= 121 && max <= 250) {
							status = 'Very Poor';

						} else if (max > 250) {
							status = 'Severe';

						}
						break;
					case 'NO2':
						if (max >= 0 && max <= 40) {
							status = 'Good';
							// console.log("max vale:" +max);

						} else if (max >= 41 && max <= 80) {
							status = 'Satisfactory';

						} else if (max >= 81 && max <= 180) {
							status = 'Moderate';

						} else if (max >= 181 && max <= 280) {
							status = 'Poor';

						} else if (max >= 281 && max <= 400) {
							status = 'Very Poor';

						} else if (max > 400) {
							status = 'Severe';

						}
						break;
					case 'O3':
						if (max >= 0 && max <= 50) {
							status = 'Good';

						} else if (max >= 51 && max <= 100) {
							status = 'Satisfactory';

						} else if (max >= 101 && max <= 168) {
							status = 'Moderate';

						} else if (max >= 169 && max <= 208) {
							status = 'Poor';

						} else if (max >= 209 && max <= 748) {
							status = 'Very Poor';

						} else if (max > 748) {
							status = 'Severe';

						}
						break;
					case 'CO2':
						if (max >= 0 && max <= 1.0) {
							status = 'Good';

						} else if (max >= 1.1 && max <= 2.0) {
							status = 'Satisfactory';

						} else if (max >= 2.1 && max <= 10) {
							status = 'Moderate';

						} else if (max >= 10.1 && max <= 17) {
							status = 'Poor';

						} else if (max >= 17.1 && max <= 34) {
							status = 'Very Poor';

						} else if (max > 34) {
							status = 'Severe';

						}
						break;
					case 'SO2':
						if (max >= 0 && max <= 40) {
							status = 'Good';

						} else if (max >= 41 && max <= 80) {
							status = 'Satisfactory';

						} else if (max >= 81 && max <= 380) {
							status = 'Moderate';

						} else if (max >= 381 && max <= 800) {
							status = 'Poor';

						} else if (max >= 801 && max <= 1600) {
							status = 'Very Poor';

						} else if (max > 1600) {
							status = 'Severe';

						}
						break;
					case 'NH3':
						if (max >= 0 && max <= 200) {
							status = 'Good';

						} else if (max >= 201 && max <= 400) {
							status = 'Satisfactory';

						} else if (max >= 401 && max <= 800) {
							status = 'Moderate';

						} else if (max >= 801 && max <= 1200) {
							status = 'Poor';

						} else if (max >= 801 && max <= 1200) {
							status = 'Poor';

						} else if (max >= 1201 && max <= 1800) {
							status = 'Very Poor';

						} else if (max > 1800) {
							status = 'Severe';

						}
						break;
					case 'PB':
						if (max >= 0 && max <= 0.5) {
							status = 'Good';

						} else if (max >= 0.6 && max <= 1.0) {
							status = 'Satisfactory';

						} else if (max >= 1.1 && max <= 2.0) {
							status = 'Moderate';

						} else if (max >= 2.1 && max <= 3.0) {
							status = 'Poor';

						} else if (max >= 3.1 && max <= 3.5) {
							status = 'Very Poor';

						} else if (max > 3.5) {
							status = 'Severe';

						}
						break;

					default:
						break;
					}

					return status;

				};
				
				/*var getStatus = function(prominentParameter, max) {
					// var aqiValue = {};
					// aqiValue.name = name;
					// aqiValue.avg = avg;
					var status = '';

					switch (prominentParameter) {
					case 'PM10':
						if (max >= 0 && max <= 50) {
							var status = 'GOOD';
						} else if (max >= 51 && max <= 100) {
							status = 'SATISFACTORY';

						} else if (max >= 101 && max <= 250) {
							status = 'MODERATE';

						} else if (max >= 251 && max <= 350) {
							status = 'POOR';

						} else if (max >= 351 && max <= 430) {
							status = 'VERY_POOR';

						} else if (max > 430) {
							status = 'SEVERE';

						}

						break;
					case 'PM2_5':
						if (max >= 0 && max <= 30) {
							status = 'GOOD';

						} else if (max >= 31 && max <= 60) {
							status = 'SATISFACTORY';

						} else if (max >= 61 && max <= 90) {
							status = 'MODERATE';

						} else if (max >= 91 && max <= 120) {
							status = 'POOR';

						} else if (max >= 121 && max <= 250) {
							status = 'VERY_POOR';

						} else if (max > 250) {
							status = 'SEVERE';

						}
						break;
					case 'NO2':
						if (max >= 0 && max <= 40) {
							status = 'GOOD';
							// console.log("max vale:" +max);

						} else if (max >= 41 && max <= 80) {
							status = 'SATISFACTORY';

						} else if (max >= 81 && max <= 180) {
							status = 'MODERATE';

						} else if (max >= 181 && max <= 280) {
							status = 'POOR';

						} else if (max >= 281 && max <= 400) {
							status = 'VERY_POOR';

						} else if (max > 400) {
							status = 'SEVERE';

						}
						break;
					case 'O3':
						if (max >= 0 && max <= 50) {
							status = 'GOOD';

						} else if (max >= 51 && max <= 100) {
							status = 'SATISFACTORY';

						} else if (max >= 101 && max <= 168) {
							status = 'MODERATE';

						} else if (max >= 169 && max <= 208) {
							status = 'POOR';

						} else if (max >= 209 && max <= 748) {
							status = 'VERY_POOR';

						} else if (max > 748) {
							status = 'SEVERE';

						}
						break;
					case 'CO2':
						if (max >= 0 && max <= 1.0) {
							status = 'GOOD';

						} else if (max >= 1.1 && max <= 2.0) {
							status = 'SATISFACTORY';

						} else if (max >= 2.1 && max <= 10) {
							status = 'MODERATE';

						} else if (max >= 10.1 && max <= 17) {
							status = 'POOR';

						} else if (max >= 17.1 && max <= 34) {
							status = 'VERY_POOR';

						} else if (max > 34) {
							status = 'SEVERE';

						}
						break;
					case 'SO2':
						if (max >= 0 && max <= 40) {
							status = 'GOOD';

						} else if (max >= 41 && max <= 80) {
							status = 'SATISFACTORY';

						} else if (max >= 81 && max <= 380) {
							status = 'MODERATE';

						} else if (max >= 381 && max <= 800) {
							status = 'POOR';

						} else if (max >= 801 && max <= 1600) {
							status = 'VERY_POOR';

						} else if (max > 1600) {
							status = 'SEVERE';

						}
						break;
					case 'NH3':
						if (max >= 0 && max <= 200) {
							status = 'GOOD';

						} else if (max >= 201 && max <= 400) {
							status = 'SATISFACTORY';

						} else if (max >= 401 && max <= 800) {
							status = 'MODERATE';

						} else if (max >= 801 && max <= 1200) {
							status = 'POOR';

						} else if (max >= 801 && max <= 1200) {
							status = 'POOR';

						} else if (max >= 1201 && max <= 1800) {
							status = 'VERY_POOR';

						} else if (max > 1800) {
							status = 'SEVERE';

						}
						break;
					case 'PB':
						if (max >= 0 && max <= 0.5) {
							status = 'GOOD';

						} else if (max >= 0.6 && max <= 1.0) {
							status = 'SATISFACTORY';

						} else if (max >= 1.1 && max <= 2.0) {
							status = 'MODERATE';

						} else if (max >= 2.1 && max <= 3.0) {
							status = 'POOR';

						} else if (max >= 3.1 && max <= 3.5) {
							status = 'VERY_POOR';

						} else if (max > 3.5) {
							status = 'SEVERE';

						}
						break;

					default:
						break;
					}

					return status;

				};*/

				$scope.sub_graph = function() {
					$state.go('detilpara');
				};

				$scope.sub_para = function() {
					$state.go('detail_parameter');
				};

				var charts = [];

				var createChart = function(getMaxAqiValuesArray, dates) {
					charts = [];
					$('.CampaignPercent').each(function() {
						var chart = new Highcharts.Chart({
							type : 'spline',
							animation : Highcharts.svg, // don't animate in old
							// IE
							marginRight : 10,
							chart : {
								renderTo : this
								//spacingTop : 10,
								//width : 300
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
									//color : '#8BBE3D',
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
								categories : dates
							},

							yAxis : {
								title : {
									text : 'Air value'
								},
							},

							/*series : [ {
								name : 'AQI',
								data : getMaxAqiValuesArray
							} ]*/
							
							series : [ {
								name : 'AQI',
								data : getMaxAqiValuesArray,
								type : 'areaspline',
								/*color : '#8BBE3D',*/
							    fillColor : {
					                    linearGradient : {
					                        x1: 0,
					                        y1: 1,
					                        x2: 0,
					                        y2: 1
					                     },
					                    stops : [
					                        [1, Highcharts.getOptions().colors[0]],
					                        [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('red')],
					                      
					                        
					                    ]
					                     
					                    },
					            lineWidth : 1,
								marker : {
									enabled : false,
								},
							 
							
							}]
						});
						charts.push(chart);
					});
				};

				$scope.stop = function() {
					$interval.cancel(promise);

				};
				$scope.stop1 = function() {
					$interval.cancel(promise1);

				};
				$scope.$on('$destroy', function() {
					$scope.stop();
					$scope.stop1();
				});

				startFetching();
				startFetching_machine();
				$scope.graphFunction = function(param) {
					switch (param) {
					case 'x1':
						assetName = 'SMT-Area';
						topChartSelector = '#topChart1';
						$scope.stop();
						startFetching();
						break;
					case 'x2':
						assetName = 'Production Ground Floor';
						topChartSelector = '#topChart2';
						$scope.stop();
						startFetching();
						break;
					case 'x3':
						assetName = 'Near Soldering Machine';
						topChartSelector = '#topChart3';
						$scope.stop();
						startFetching();
						break;
					case 'h1':
						assetName1 = 'Heller-Machine';
						// topChartSelector = '#topChart3';
						$scope.stop1();
						startFetching_machine();
						break;
					case 'h2':
						assetName1 = 'Soltech-Machine';
						// topChartSelector = '#topChart3';
						$scope.stop1();
						startFetching_machine();
						break;
					case 'h3':
						assetName1 = 'Reflow-Ovan';
						// topChartSelector = '#topChart3';
						$scope.stop1();
						startFetching_machine();
						break;
					case 'h4':
						assetName1 = 'Wave-Soldering-Machine';
						// topChartSelector = '#topChart3';
						$scope.stop1();
						startFetching_machine();
						break;

					default:
						break;
					}
				};

				var percentColors = [ {
					pct : 0.0,
					color : {

						r : 0x00,
						g : 0xff,
						b : 0
					}
				}, {
					pct : 0.5,
					color : {
						r : 0xff,
						g : 0xff,
						b : 0
					}
				}, {
					pct : 1.0,
					color : {
						r : 0xff,
						g : 0x00,
						b : 0
					}
				} ];

				var getColorForPercentage = function(pct) {
					// console.log(pct);

					for (var i = 1; i < percentColors.length - 1; i++) {
						if (pct < percentColors[i].pct) {
							break;
						}
					}
					var lower = percentColors[i - 1];
					var upper = percentColors[i];
					var range = upper.pct - lower.pct;
					var rangePct = (pct - lower.pct) / range;
					var pctLower = 1 - rangePct;
					var pctUpper = rangePct;
					var color = {
						r : Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
						g : Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
						b : Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
					};
					return 'rgb(' + [ color.r, color.g, color.b ].join(',') + ')';
					// or output as hex if preferred
				}

				var loadChart = function(selector, min, max, val) {
					var per = (val / max);
					var chart = c3.generate({
						bindto : selector,
						data : {

							columns : [ [ 'data', val ] ],
							type : 'gauge'
						},
						gauge : {
							label : {
								format : function(value, ratio) {
									return value;
								},
							},
							min : min,
							max : max,
							units : '',
							width : 15
						},
						color : {
							pattern : [ getColorForPercentage(per) ]
						},
						size : {
							height : 155,
							width : 150
						}
					});
				};

			} ]);

});