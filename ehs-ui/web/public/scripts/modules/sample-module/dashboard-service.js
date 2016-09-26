define([ 'angular', './sample-module' ], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('DashBoardService', [ '$http', '$rootScope', 'AuthService', 'Config', function($http, $rootScope, AuthService, Config) {
		return {
			getAqiMachineValues : function(floor, interval, cb) {
				var thisObject = this;
				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getAqiMachine($rootScope.token, floor, interval, cb);
					});
				} else {
					thisObject.getAqiMachine($rootScope.token, floor, interval, cb);
				}
			},
			getAqiMachine : function(token, floor, interval, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/aqi/machine/' + floor + '?interval=' + interval,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			},
			getAqiAreaValues : function(floor, interval, cb) {
				var thisObject = this;
				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getAqiArea($rootScope.token, floor, interval, cb);
					});
				} else {
					thisObject.getAqiArea($rootScope.token, floor, interval, cb);
				}
			},
			getAqiArea : function(token, floor, interval, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/aqi/area/' + floor + '?interval=' + interval,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			},
			getHygieneValues : function(floor, interval, cb) {
				var thisObject = this;
				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getHygiene($rootScope.token, floor, interval, cb);
					});
				} else {
					thisObject.getHygiene($rootScope.token, floor, interval, cb);
				}
			},
			getHygiene : function(token, floor, interval, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/hygiene/' + floor + '?interval=' + interval,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			},
			prettyMs : function(timestamps) {
				var dates = [];
				for (var i = 0; i < timestamps.length; i++) {
					var date = new Date(timestamps[i]);
					var h = 0;
					var m = 0;
					var s = 0;
					if (date.getHours() < 10)
						h = '0' + date.getHours();
					else
						h = date.getHours();
					if (date.getMinutes() < 10)
						m = '0' + date.getMinutes();
					else
						m = date.getMinutes();
					if (date.getSeconds() < 10)
						s = '0' + date.getSeconds();
					else
						s = date.getSeconds();

					var dateString = h + ':' + m + ':' + s;
					dates.push(dateString);
				}
				return dates;
			},
			positionList : {
				aqiMachine : [ [ {
					top : 40,
					left : 30
				}, {
					top : 40,
					left : 20
				}, {
					top : 30,
					left : 41
				}, {
					top : 20,
					left : 50
				}, {
					top : 21,
					left : 60
				} ],

				[ {
					top : 40,
					left : 30
				}, {
					top : 35,
					left : 76
				}, {
					top : 30,
					left : 41
				}, {
					top : 34,
					left : 50
				}, {
					top : 21,
					left : 60
				} ],

				[ {
					top : 40,
					left : 30
				}, {
					top : 40,
					left : 20
				}, {
					top : 20,
					left : 41
				}, {
					top : 20,
					left : 50
				}, {
					top : 21,
					left : 60
				} ] ],
				aqiArea : [ [ {
					top : 34,
					left : 53
				}, {
					top : 24,
					left : 82
				}, {
					top : 32,
					left : 64
				}, {
					top : 72,
					left : 79
				}, {
					top : 28,
					left : 66
				} ],

				[ {
					top : 49,
					left : 38
				}, {
					top : 35,
					left : 70
				}, {
					top : 30,
					left : 49
				}, {
					top : 20,
					left : 53
				}, {
					top : 21,
					left : 80
				} ],

				[ {
					top : 40,
					left : 40
				}, {
					top : 40,
					left : 60
				}, {
					top : 20,
					left : 51
				}, {
					top : 20,
					left : 50
				}, {
					top : 29,
					left : 62
				} ] ],
				hygiene : [ [ {
					top : 45,
					left : 37
				}, {
					top : 70,
					left : 50
				}, {
					top : 30,
					left : 41
				}, {
					top : 28,
					left : 60
				}, {
					top : 22,
					left : 50
				} ],

				[ {
					top : 26,
					left : 60
				}, {
					top : 20,
					left : 80
				}, {
					top : 30,
					left : 45
				}, {
					top : 60,
					left : 50
				}, {
					top : 21,
					left : 60
				} ],

				[ {
					top : 40,
					left : 50
				}, {
					top : 40,
					left : 71
				}, {
					top : 20,
					left : 45
				}, {
					top : 20,
					left : 85
				}, {
					top : 79,
					left : 60
				} ] ]

			}
		};
	} ]);
});