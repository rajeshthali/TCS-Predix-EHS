define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';
	controllers.controller('industrialHygieneDetails', [ '$scope', '$http', '$state', '$interval', 'HygieneService', 'AuthService', '$rootScope',
			function($scope, $http, $state, $interval, HygieneService, auth, $rootScope) {
				var promise = null;
				var interval = 5000;
				var charts = [];
				$('.loaderpg').css('display', 'block');
				$('.lad_img').css('display', 'block');
				var getValues = function() {
					
					HygieneService.last1HrsDataPoints(function(data) {
						console.log(data);

						$scope.values = data.data.body;
						applay24HrsData($scope.values);
						$('.loaderpg').css('display', 'none');
						$('.lad_img').css('display', 'none');
						startRequesting();
					}, function(data) {
					});
				};

				if (!$rootScope.token) {
					auth.getTocken(function(token) {
						// console.log(token);
						getValues();
					});
				} else {
					getValues();
				}

				var startRequesting = function() {
					promise = $interval(function() {
						getValues20Sec();
					}, interval);
				};

				var getValues20Sec = function() {
					HygieneService.last20SecDataPoints(function(data) {
						$scope.values = data.data.body;
						applay20SecData($scope.values);
					}, function(data) {
					});
				};

				$scope.stop = function() {
					$interval.cancel(promise);

				};
				$scope.$on('$destroy', function() {
					$scope.stop();
				});

				var prettyMs = function(ms) {
					var date = new Date(ms);
					var dateString = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
					return dateString;
				};
				var createAndUpdateValueInGraph = function(data, selector, name) {
					//console.log('----');
					//console.log(data);
					var SMT_Line_1 = data['SMT Line 1'];
					var SMT_Line_2 = data['SMT Line 2'];
					var Production_Ground_Floor = data['Production Ground Floor'];

					var xValuesArray = [];
					var yValuesArray = [];
					var yValues = [];
					for (var j = 0; j < SMT_Line_1.length; j++) {
						var x = SMT_Line_1[j].x;
						var y = SMT_Line_1[j].y;

						yValues.push(y);
						xValuesArray.push(prettyMs(x));
					}
					yValuesArray.push(yValues);
					yValues = [];
					for (var j = 0; j < SMT_Line_2.length; j++) {

						var y = SMT_Line_2[j].y;
						yValues.push(y);
					}
					yValuesArray.push(yValues);
					yValues = [];
					for (var j = 0; j < Production_Ground_Floor.length; j++) {

						var y = Production_Ground_Floor[j].y;
						yValues.push(y);
					}
					yValuesArray.push(yValues);

					createGraph(selector, name, xValuesArray, yValuesArray);

				};

				var applay24HrsData = function(dataList) {
					var data = processData(dataList, 20);
					var temprature = data.temprature;
					var noise = data.noise;
					var humidity = data.humidity;
					createAndUpdateValueInGraph(temprature, '#graph_01', 'Temperature');
					createAndUpdateValueInGraph(noise, '#graph_02', 'Noise');
					createAndUpdateValueInGraph(humidity, '#graph_03', 'Noise');
				}

				var updateValueInGraph = function(data, chart) {
					var SMT_Line_1 = data['SMT Line 1'];
					var SMT_Line_2 = data['SMT Line 2'];
					var Production_Ground_Floor = data['Production Ground Floor'];
					var x = SMT_Line_1[0].x;
					var y = SMT_Line_1[0].y;

					// console.log(x + " " + y);
					// console.log(chart.series[0]);

					chart.series[0].addPoint([ prettyMs(x), y ], false, true);

					x = SMT_Line_2[0].x;
					y = SMT_Line_2[0].y;

					chart.series[1].addPoint([ prettyMs(x), y ], false, true);

					x = Production_Ground_Floor[0].x;
					y = Production_Ground_Floor[0].y;

					chart.series[2].addPoint([ prettyMs(x), y ], true, true);
				};
				var applay20SecData = function(dataList) {
					var data = processData(dataList, 1);
					var temprature = data.temprature;
					var noise = data.noise;
					var humidity = data.humidity;
					// console.log(charts);
					updateValueInGraph(temprature, charts[0]);
					updateValueInGraph(noise, charts[1]);
					updateValueInGraph(humidity, charts[2]);
				};

				var processData = function(dataList, count) {
					var returnData = [];
					returnData['temprature'] = {
						'SMT Line 1' : [],
						'SMT Line 2' : [],
						'Production Ground Floor' : []
					};
					returnData['noise'] = {
						'SMT Line 1' : [],
						'SMT Line 2' : [],
						'Production Ground Floor' : []
					};
					returnData['humidity'] = {
						'SMT Line 1' : [],
						'SMT Line 2' : [],
						'Production Ground Floor' : []
					};
					// console.log(dataList);
					for (var i = 0; i < count; i++) {

						returnData['temprature']['SMT Line 1'].push({
							y : dataList[0].temprature[i],
							x : dataList[0].timestamps[i]
						});
						returnData['noise']['SMT Line 1'].push({
							y : dataList[0].temprature[i],
							x : dataList[0].noise[i]
						});
						returnData['humidity']['SMT Line 1'].push({
							y : dataList[0].temprature[i],
							x : dataList[0].humidity[i]
						});

						returnData['temprature']['SMT Line 2'].push({
							y : dataList[1].temprature[i],
							x : dataList[1].timestamps[i]
						});
						returnData['noise']['SMT Line 2'].push({
							y : dataList[1].temprature[i],
							x : dataList[1].noise[i]
						});
						returnData['humidity']['SMT Line 2'].push({
							y : dataList[1].temprature[i],
							x : dataList[1].humidity[i]
						});

						returnData['temprature']['Production Ground Floor'].push({
							y : dataList[2].temprature[i],
							x : dataList[2].timestamps[i]
						});
						returnData['noise']['Production Ground Floor'].push({
							y : dataList[2].temprature[i],
							x : dataList[2].noise[i]
						});
						returnData['humidity']['Production Ground Floor'].push({
							y : dataList[2].temprature[i],
							x : dataList[2].humidity[i]
						});
					}

					// console.log(returnData);
					return returnData;

				};

				var createGraph = function(selector, yParam, xValues, yValues) {
					// console.log(this);

					Highcharts.setOptions({
						global : {
							useUTC : false
						}
					});
					$(selector).each(function() {
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
							credits : {
								enabled : false
							},

							xAxis : {
								type : 'datetime',
								title : {
									text : 'Time'
								},
								categories : xValues
							},
							series : [ {
								name : 'SMT Line 1',
								color : 'red',
								data : yValues[0]
							}, {
								name : 'SMT Line 2',
								color : 'blue',
								data : yValues[1]
							}, {
								name : 'Production Ground Floor',
								color : 'green',
								data : yValues[2]
							} ]
						});

						charts.push(chart);
					});

				};

				// getValues();

			} ]);
});