define([ 'angular', './sample-module' ], function(angular, controllers) {
	'use strict';

	// Controller definition
	controllers.controller('DashboardsCtrl', [ '$state', '$timeout', '$interval', '$scope', '$rootScope', '$http', '$log', 'PredixAssetService', 'PredixViewService', 'AuthService', 'HygieneService',
			function($state, $timeout, $interval, $scope, $rootScope, $http, $log, PredixAssetService, PredixViewService, AuthService, HygieneService) {
				$scope.hoverme = true;
				$scope.hoverfun = function(x) {

					$("." + x).siblings().css('display', 'none');
					$("." + x).siblings().css('display', 'none');
					console.log("i m in hoverfun ");
				};

				$scope.hoverout = function(x) {
					console.log("i m in hoverout ");
					$("." + x).siblings().css('display', 'block');
					$("." + x).siblings().css('display', 'block');

				}

				$scope.hide_othr = function(x) {
					// $(".f1_tit").CSS('display','none');

					// console.log(x + "i am in func");
					if (x == 'f1') {
						$scope.hoverme = false;
						console.log(x + "i am in func f1");
						$(".floor1").parent(this).parent(this).parent(this).addClass('bgtra');
						$(".floor1").parent(this).parent(this).parent(this).parent(this).addClass('bgtra');
						$(".floor1").siblings(".floor2").css('display', 'none');
						$(".floor1").siblings(".floor3").css('display', 'none');
						$(".floor1").addClass('highwidth');
						$(".floor1").css('display', 'block');
						$(".f1_tit").CSS('display', 'none');

					} else if (x == 'f2') {
						$scope.hoverme = false;
						console.log(x + "i am in func111");
						$(".floor2").parent(this).parent(this).parent(this).addClass('bgtra');
						$(".floor2").parent(this).parent(this).parent(this).parent(this).addClass('bgtra');
						$(".floor2").siblings(".floor1").css('display', 'none');
						$(".floor2").siblings(".floor3").css('display', 'none');

						$(".floor1").removeClass('highwidth');
						$(".floor2").addClass('highwidth');
						$(".floor2").css('left', '231px');
						$(".floor2").css('display', 'block');
						$(".f1_tit").CSS('display', 'none');

					} else if (x == 'f3') {
						$scope.hoverme = false;
						console.log(x + "i am in func111");
						$(".floor3").parent(this).parent(this).parent(this).addClass('bgtra');
						$(".floor3").parent(this).parent(this).parent(this).parent(this).addClass('bgtra');
						$(".floor3").siblings(".floor1").css('display', 'none');
						$(".floor3").siblings(".floor2").css('display', 'none');
						$(".floor2").removeClass('highwidth');
						$(".floor3").addClass('highwidth');
						$(".floor3").css('display', 'block');
					} else {
						$scope.hoverme = true;

						$(".floor1").parent(this).parent(this).parent(this).removeClass('bgtra');
						$(".floor1").parent(this).parent(this).parent(this).parent(this).removeClass('bgtra');
						$(".floor1").removeClass('highwidth');
						$(".floor2").removeClass('highwidth');
						$(".floor3").removeClass('highwidth');

						$(".floor1").css('display', 'block');
						$(".floor2").css('display', 'block');
						$(".floor3").css('display', 'block');
						$(".f1_tit").CSS('display', 'none');

					}

				};

				$scope.count = 0;
				var max = 3;
				var min = 0;

				$scope.increment = function() {
					if ($scope.count >= max) {
						return;
					}

					$scope.count++;
					console.log(" $scope.increment" + $scope.count);
					$scope.f1($scope.count);
				};
				$scope.decrement = function() {
					if ($scope.count <= min) {
						return;
					}
					$scope.count--;
					$scope.f1($scope.count);
					console.log(" $scope.decrement" + $scope.count);
				};
				$scope.f1 = function(x) {
					if (x == 1) {
						console.log("i am in count if");
						$scope.hide_othr("f1");

					}
					;
					if (x == 2) {
						console.log("i am in count if2");
						$scope.hide_othr("f2");

					}
					;
					if (x == 3) {
						console.log("i am in count if2");
						$scope.hide_othr("f3");

					}
					;
					if (x == 0) {
						$scope.hide_othr("f4");

					}

				};

				/*
				 * $('.loaderpg_dash').css('display', 'block');
				 * $('.lad_img_dash').css('display', 'block');
				 */
				/*
				 * var startFetching = function() { if (!$rootScope.token) {
				 * AuthService.getTocken(function(token) { $scope.token = token
				 * //console.log( $scope.token); //loadData_machine();
				 * loadData(token); getValues(token);
				 * 
				 * }); } else { //loadData_machine(); loadData(token);
				 * getValues();
				 *  } };
				 */

				/*
				 * var promise = null;
				 * 
				 * function startRefreshData() { promise = $interval(function() {
				 * 
				 * startFetching(); }, 20000); };
				 * 
				 * startRefreshData(); $scope.stop = function() {
				 * $interval.cancel(promise);
				 *  }; $scope.stop1 = function() { $interval.cancel(promise);
				 *  }; var loadData = function(token){ $http({ headers: {
				 * "Authorization": token, "Content-Type":'application/json',
				 *  }, method: 'GET', url:
				 * 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/geography/appDashBoard',
				 * }).success(function(data){
				 * 
				 * 
				 * 
				 * 
				 * 
				 * 
				 * 
				 * 
				 * $scope.contlist = data;
				 * //console.log("JSON*********"+JSON.stringify($scope.contlist));
				 * //$scope.SMT_maxaqi = data.body[0].maxAqi.aqiValue;
				 * 
				 * //$scope.PGF_maxaqi = data.body[1].maxAqi.aqiValue;
				 * //$scope.NSM_maxaqi = data.body[2].maxAqi.aqiValue;
				 * $scope.SMT_maxaqi_name = data.body[0].maxAqi.name;
				 * $scope.PGF_maxaqi_name = data.body[0].maxAqi.name;
				 * $scope.NSM_maxaqi_name = data.body[0].maxAqi.name;
				 * //console.log($scope.SMT_maxaqi); loadChart('#camp31', 0.0,
				 * 200.0, data.body[0].maxAqi.aqiValue); loadChart('#camp32',
				 * 0.0, 200.0, data.body[1].maxAqi.aqiValue);
				 * loadChart('#camp33', 0.0, 200.0,
				 * data.body[2].maxAqi.aqiValue);
				 * 
				 * $scope.SMT_updated_status=
				 * getStatus(data.body[0].maxAqi.name,
				 * data.body[0].maxAqi.aqiValue); $scope.PGF_updated_status=
				 * getStatus(data.body[1].maxAqi.name,
				 * data.body[1].maxAqi.aqiValue); $scope.NSM_updated_status=
				 * getStatus(data.body[2].maxAqi.name,
				 * data.body[2].maxAqi.aqiValue);
				 * 
				 * 
				 * $scope.HM_no2 = data.body[3].attributes[0].NO2 $scope.HM_so2 =
				 * data.body[3].attributes[1].SO2 $scope.HM_pm2_5 =
				 * data.body[3].attributes[2].PM2_5
				 * 
				 * $scope.SM_no2 = data.body[4].attributes[0].NO2 $scope.SM_so2 =
				 * data.body[4].attributes[1].SO2 $scope.SM_pm2_5 =
				 * data.body[4].attributes[2].PM2_5
				 * 
				 * $scope.Ro_no2 = data.body[5].attributes[0].NO2 $scope.Ro_so2 =
				 * data.body[5].attributes[1].SO2 $scope.Ro_pm2_5 =
				 * data.body[5].attributes[2].PM2_5
				 * 
				 * $scope.Wsm_no2 = data.body[6].attributes[0].NO2
				 * $scope.Wsm_so2 = data.body[6].attributes[1].SO2
				 * $scope.Wsm_pm2_5 = data.body[6].attributes[2].PM2_5
				 * 
				 * 
				 * if($scope.HM_no2 > 80 || $scope.HM_so2 > 80||$scope.HM_pm2_5 >
				 * 60){
				 * 
				 * $scope.war = true; }
				 * 
				 * else if($scope.SM_no2 >80 || $scope.SM_so2
				 * >80||$scope.SM_pm2_5>60){
				 * 
				 * $scope.war = true; } else if($scope.Ro_no2 >80 ||
				 * $scope.Ro_so2 >80||$scope.Ro_pm2_5>60){
				 * 
				 * $scope.war = true; } else if($scope.Wsm_no2 >80 ||
				 * $scope.Wsm_so2 >80||$scope.Wsm_pm2_5>60){
				 * 
				 * $scope.war = true; } else{
				 * 
				 * $scope.sat = true; }
				 * 
				 * 
				 * if ($('.dropdown > div').is(':visible')) {
				 * $('.loaderpg_dash').css('display', 'none');
				 * $('.lad_img_dash').css('display', 'none');
				 *  } else { $('.loaderpg_dash').css('display', 'block');
				 * $('.lad_img_dash').css('display', 'block');
				 *  }
				 * 
				 *  // console.log("hm_no2" + $scope.Wsm_no2);
				 * 
				 * });
				 *  }
				 * 
				 * $scope.hide_red = function(){
				 * 
				 * $('.air_red').css('display', 'none');
				 * $('.air_grn').css('display', 'block');
				 * $('.hygn_grn').css('display', 'block');
				 * $('.hygn_red').css('display', 'none');
				 *  }; $scope.hide_green = function(){
				 * $('.air_grn').css('display', 'none');
				 * $('.air_red').css('display', 'block');
				 * $('.hygn_grn').css('display', 'none');
				 * $('.hygn_red').css('display', 'block');
				 *  }; $scope.show_all = function(){
				 * $('.air_grn').css('display', 'block');
				 * $('.air_red').css('display', 'block');
				 * $('.hygn_grn').css('display', 'block');
				 * $('.hygn_red').css('display', 'block'); };
				 */
				/*
				 * var percentColors = [ { pct : 0.0, color : {
				 * 
				 * r : 0x00, g : 0xff, b : 0 } }, { pct : 0.5, color : { r :
				 * 0xff, g : 0xff, b : 0 } }, { pct : 1.0, color : { r : 0xff, g :
				 * 0x00, b : 0 } } ];
				 * 
				 * var getColorForPercentage = function(pct) { //
				 * console.log(pct);
				 * 
				 * for (var i = 1; i < percentColors.length - 1; i++) { if (pct <
				 * percentColors[i].pct) { break; } } var lower =
				 * percentColors[i - 1]; var upper = percentColors[i]; var range =
				 * upper.pct - lower.pct; var rangePct = (pct - lower.pct) /
				 * range; var pctLower = 1 - rangePct; var pctUpper = rangePct;
				 * var color = { r : Math.floor(lower.color.r * pctLower +
				 * upper.color.r * pctUpper), g : Math.floor(lower.color.g *
				 * pctLower + upper.color.g * pctUpper), b :
				 * Math.floor(lower.color.b * pctLower + upper.color.b *
				 * pctUpper) }; return 'rgb(' + [ color.r, color.g, color.b
				 * ].join(',') + ')'; // or output as hex if preferred }
				 * 
				 * var loadChart = function(selector, min, max, val) { var per =
				 * (val / max); var chart = c3.generate({ bindto : selector,
				 * data : {
				 * 
				 * columns : [ [ 'data', val ] ], type : 'gauge' }, gauge : {
				 * label : { format : function(value, ratio) { return value; }, },
				 * min : min, max : max, units : '', width : 15 }, color : {
				 * pattern : [ getColorForPercentage(per) ] }, size : { height :
				 * 55, width : 100 } }); }; var
				 * getStatus=function(prominentParameter,max){ // var aqiValue =
				 * {}; // aqiValue.name = name; // aqiValue.avg = avg; var
				 * status = '';
				 * 
				 * switch (prominentParameter) { case 'PM10': if (max >= 0 &&
				 * max <= 50) { var status = 'GOOD'; $scope.green = true; } else
				 * if (max >= 51 && max <= 100) { status= 'SATISFACTORY';
				 * $scope.green = true;
				 *  } else if (max >= 101 && max <= 250) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 251 && max <= 350) { status= 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 351 && max <= 430) { status = 'VERY_POOR';
				 * $scope.sever = true;
				 *  } else if (max > 430) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  }
				 * 
				 * break; case 'PM2_5': if (max >= 0 && max <= 30) { status =
				 * 'GOOD'; $scope.green = true;
				 *  } else if (max >= 31 && max <= 60) { status =
				 * 'SATISFACTORY'; $scope.green = true;
				 *  } else if (max >= 61 && max <= 90) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 91 && max <= 120) { status = 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 121 && max <= 250) { status = 'VERY_POOR';
				 * $scope.sever = true;
				 *  } else if (max > 250) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  } break; case 'NO2': if (max >= 0 && max <= 40) { status =
				 * 'GOOD'; $scope.green = true; //console.log("max vale:" +max);
				 *  } else if (max >= 41 && max <= 80) { status =
				 * 'SATISFACTORY'; $scope.green = true;
				 *  } else if (max >= 81 && max <= 180) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 181 && max <= 280) { status = 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 281 && max <= 400) { status = 'VERY_POOR';
				 * $scope.sever = true;
				 *  } else if (max > 400) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  } break; case 'O3': if (max >= 0 && max <= 50) { status =
				 * 'GOOD'; $scope.green = true;
				 *  } else if (max >= 51 && max <= 100) { status=
				 * 'SATISFACTORY'; $scope.green = true;
				 *  } else if (max >= 101 && max <= 168) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 169 && max <= 208) { status = 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 209 && max <= 748) { status= 'VERY_POOR';
				 * $scope.sever = true;
				 *  } else if (max > 748) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  } break; case 'CO2': if (max >= 0 && max <= 1.0) { status =
				 * 'GOOD'; $scope.green = true;
				 *  } else if (max >= 1.1 && max <= 2.0) { status=
				 * 'SATISFACTORY'; $scope.green = true;
				 *  } else if (max >= 2.1 && max <= 10) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 10.1 && max <= 17) { status = 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 17.1 && max <= 34) { status = 'VERY_POOR';
				 * $scope.sever = true;
				 *  } else if (max > 34) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  } break; case 'SO2': if (max >= 0 && max <= 40) { status =
				 * 'GOOD'; $scope.green = true;
				 *  } else if (max >= 41 && max <= 80) { status =
				 * 'SATISFACTORY'; $scope.green = true;
				 *  } else if (max >= 81 && max <= 380) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 381 && max <= 800) { status = 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 801 && max <= 1600) { status =
				 * 'VERY_POOR'; $scope.sever = true;
				 *  } else if (max > 1600) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  } break; case 'NH3': if (max >= 0 && max <= 200) { status =
				 * 'GOOD'; $scope.green = true;
				 *  } else if (max >= 201 && max <= 400) { status =
				 * 'SATISFACTORY'; $scope.green = true;
				 *  } else if (max >= 401 && max <= 800) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 801 && max <= 1200) { status = 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 1201 && max <= 1800) { status =
				 * 'VERY_POOR'; $scope.sever = true;
				 *  } else if (max > 1800) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  } break; case 'PB': if (max >= 0 && max <= 0.5) { status =
				 * 'GOOD'; $scope.green = true;
				 *  } else if (max >= 0.6 && max <= 1.0) { status =
				 * 'SATISFACTORY'; $scope.green = true;
				 *  } else if (max >= 1.1 && max <= 2.0) { status = 'MODERATE';
				 * $scope.green = true;
				 *  } else if (max >= 2.1 && max <= 3.0) { status = 'POOR';
				 * $scope.sever = true;
				 *  } else if (max >= 3.1 && max <= 3.5) { status = 'VERY_POOR';
				 * $scope.sever = true;
				 *  } else if (max > 3.5) { status = 'SEVERE'; $scope.sever =
				 * true;
				 *  } break;
				 * 
				 * default: break; }
				 * 
				 * return status;
				 * 
				 *  };
				 * 
				 * 
				 *  // hygrn part
				 * 
				 * 
				 * var getValues = function() {
				 * 
				 * HygieneService.dashboardValues2().success(function(data) {
				 * $('.loaderpg').css('display', 'none');
				 * $('.lad_img').css('display', 'none'); $scope.values =
				 * data.body; //$scope.value = $scope.values[0];
				 * //console.log(JSON.stringify($scope.values));
				 * 
				 * $scope.smt1_temp = data.body[0].temperature; $scope.smt1_nois =
				 * data.body[0].noise; $scope.smt1_hums = data.body[0].humidity;
				 * 
				 * $scope.smt2_temp = data.body[1].temperature; $scope.smt2_nois =
				 * data.body[1].noise; $scope.smt2_hums = data.body[1].humidity;
				 * 
				 * $scope.Hpg_temp = data.body[2].temperature; $scope.Hpg_nois =
				 * data.body[2].noise; $scope.Hpg_hums = data.body[2].humidity;
				 * 
				 * if(($scope.smt1_temp >= 20 && $scope.smt1_temp <= 40) &&
				 * ($scope.smt1_hums >= 20 && $scope.smt1_hums <= 60) &&
				 * ($scope.smt1_nois <= 75)){ $scope.hygn_sat= true;
				 * //console.log("value: " +$scope.hygiene_satsifactory); } else {
				 * $scope.hygn_wa= true; // console.log("Warning"); }
				 * 
				 * if(($scope.smt2_temp >= 20 && $scope.smt2_temp <= 40) &&
				 * ($scope.smt2_hums >= 20 && $scope.smt2_hums <= 60) &&
				 * ($scope.smt2_nois <= 75)){ $scope.hygn_sat= true;
				 * //console.log("value: " +$scope.hygiene_satsifactory); } else {
				 * $scope.hygn_wa= true; // console.log("Warning"); }
				 * 
				 * if(($scope.Hpg_temp >= 20 && $scope.Hpg_temp <= 40) &&
				 * ($scope.Hpg_hums >= 20 && $scope.Hpg_hums <= 60) &&
				 * ($scope.Hpg_nois <= 75)){ $scope.hygn_sat= true;
				 * //console.log("value: " +$scope.hygiene_satsifactory); } else {
				 * $scope.hygn_wa= true; // console.log("Warning"); }
				 * 
				 * 
				 * 
				 * //console.log($scope.Hpg_temp); })
				 *  };
				 * 
				 */
				$scope.gotoaqi = function(assetName) {
					console.log(assetName);

					document.querySelector('px-app-nav').markSelected('/airquality');
					$state.go('airquality', {
						'smtare' : assetName
					});

				}

				$scope.gotohygn = function(assetName) {
					console.log(assetName);

					document.querySelector('px-app-nav').markSelected('/industrial-hygiene');
					$state.go('industrial-hygiene', {
						'smtare' : assetName
					});

				}

				// https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/geography/appDashBoard
			} ]);
});
