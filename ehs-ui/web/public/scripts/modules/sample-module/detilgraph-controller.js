define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';

	// Controller definition
	controllers.controller('detilgraphCtrl', [ '$scope', '$http', '$log', 'PredixAssetService', 'PredixViewService', 'CalculationOneService', 'CalculationService', '$interval', 'AqiService',
			'AuthService', '$rootScope', function($scope, $http, $log, PredixAssetService, PredixViewService, CalculationOneService, CalculationService, $interval, AqiService, auth, $rootScope) {
		$('.lad_img').css('display','block');
		$('.loaderpg').css('display','block');	
			var assetName = 'SMT Area';
				var promise = null;
				var getValues = function() {
					if (!$rootScope.token) {
						auth.getTocken(function(token) {
							// console.log(token);
							loadData();
						});
					} else {
						loadData();
					}
				};

				function loadData() {
					
					hideGraphs();
					AqiService.last10MinDataPoints(assetName, function(timestamps, values) {
						var count = 20;
						showGraphs();
						$('.lad_img').css('display','none');
						$('.loaderpg').css('display','none');
						

						createChart(values.value.slice(Math.max(values.value.length - count, 1)), timestamps.slice(Math.max(timestamps.length - count, 1)));
						createChartTrends(values.seperatedResult, timestamps);
						startRefreshData();

						// console.log(values);
					}, function(e) {
						console.log(e);
					});
				}
				var stillWorking = false;
				function startRefreshData() {
					promise = $interval(function() {
						if (!stillWorking) {
							console.log("working");
							stillWorking = true;
							AqiService.last20SecDataPoints(assetName, function(timestamps, values) {
								for (var i = 0; i < charts.length; i++) {
									var chart = charts[i];
									for (var j = 0; j < values.value.length; j++) {
										if ((values.value.length - j) == 1) {
											chart.series[0].addPoint([ timestamps[j], values.value[j] ], true, true);
										} else {
										}

									}
								}

								for (var i = 0; i < chartsTrends.length; i++) {
									var chart = chartsTrends[i];
									var k = 0;
									for (k = 0; k < values.seperatedResult.length - 1; k++) {
										for (var j = 0; j < values.seperatedResult[k].values.length; j++) {
											if ((values.value.length - j) == 1) {
												chart.series[k].addPoint([ timestamps[j], values.seperatedResult[k].values[j] ], false, true);
											} else {
											}

										}
									}

									for (var j = 0; j < values.seperatedResult[k].values.length; j++) {
										if ((values.value.length - j) == 1) {
											chart.series[k].addPoint([ timestamps[j], values.seperatedResult[k].values[j] ], true, true);
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
					}, 5000);
				}

				var charts = [];
				var chartsTrends = [];
				var createChart = function(getMaxAqiValuesArray, dates) {
					charts = [];
					Highcharts.setOptions({
						global : {
							useUTC : false
						}
					});
					$('.CampaignPercent').each(function() {

						var chartPrediction = new Highcharts.Chart({
							type : 'spline',
							animation : Highcharts.svg,
							marginRight : 10,
							chart : {
								renderTo : this,
								spacingTop : 10
							},
							title : {
								text : ''
							},
							exporting : {
								enabled : false
							},

							plotOptions : {
								series : {
									color : '#8BBE3D',
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

							series : [ {
								name : 'AQI',
								data : getMaxAqiValuesArray
							} ]
						});

						charts.push(chartPrediction)
					});
				};

				var createChartTrends = function(array, dates) {
					chartsTrends = [];
					Highcharts.setOptions({
						global : {
							useUTC : false
						}
					});

					var createArray = function() {
						var colors = [ '#8BBE3D', '#8BB23D', '#80BE3D', '#8BBEED', '#FFBE3D', '#8BBFFD', '#8BFF3D', "#FF0000" ];
						var arrayData = [];
						for (var i = 0; i < array.length; i++) {
							var dataValue = {
								name : array[i].name,
								color : colors[i],
								data : array[i].values
							};
							arrayData.push(dataValue);
						}
						return arrayData;
					};

					var arrayValues = createArray();
					$('.CampaignPercent1').each(function() {
						var chart = new Highcharts.Chart({
							type : 'spline',
							chart : {
								renderTo : this,
								spacingTop : 10
							},
							title : {
								text : ''
							},
							exporting : {
								enabled : false
							},

							plotOptions : {
								series : {
									color : '#8BBE3D',
									lineWidth : 1,
									marker : {
										enabled : false,
									},
								}
							},
							credits : {},

							xAxis : {
								title : {
									text : 'Time'
								},
								categories : dates
							},

							yAxis : {
								title : {
									text : 'Air value'
								}
							},
							series : arrayValues
						});
						chartsTrends.push(chart);
					});
				};

				$scope.stop = function() {
					$interval.cancel(promise);

				};
				$scope.$on('$destroy', function() {
					$scope.stop();
				});

				// console.log("i am in detilgraphCtrlss control");
				var redrawChart = function() {
					charts = [];
					chartsTrends = [];
					$scope.stop();
					getValues();
				};
				$scope.graphFunction = function(value) {
					if (value === "x1") {
						assetName='SMT Area';
						redrawChart();
					}
					if (value === "x2") {
						assetName='Production Ground Floor';
						redrawChart();
					}
					if (value === "x3") {
						assetName='Near Soldering Machine';
						redrawChart();
					}
				};

				var hideGraphs = function() {
					$('.CampaignPercent1').hide();
					$('.CampaignPercent').hide();
				};
				var showGraphs = function() {
					$('.CampaignPercent1').fadeIn();
					$('.CampaignPercent').fadeIn();
				};

				getValues();

			} ]);
});