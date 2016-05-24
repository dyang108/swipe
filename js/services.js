(function () {
    "use strict";

    angular.module('choiceModule', [])
        .factory('theChoices', function () {
            var choices = [
                { name: 'eat', icon: 'fa-cutlery' },
                { name: 'post', icon: 'fa-bullhorn' },
                // { name: 'chat', icon: 'fa-comment' },
                { name: 'profile', icon: 'fa-user' }
            ];

            return {
                'choices': choices
            };
        });

    // authentication stuff
    angular.module('authentication', [])
        .factory('facebookService', function ($q) {
            return {
                getProPic: function () {
                    var deferred = $q.defer();
                    FB.api('/me/picture', { type: 'normal' }, function (response) {
                        if (!response || response.error) {
                            deferred.reject('Error occured');
                        } else {
                            deferred.resolve(response);
                        }
                    });
                    return deferred.promise;
                },
                getFullName: function () {
                    var deferred = $q.defer();
                    FB.api('/me', {
                        fields: 'name'
                    }, function (response) {
                        if (!response || response.error) {
                            deferred.reject('Error occured');
                        } else {
                            deferred.resolve(response);
                        }
                    });
                    return deferred.promise;
                }
            };
        });

    angular.module('mealAPI', [])
        .factory('postService', function ($http, $q) {
            var hallLocs = {
                Dewick: {
                    lat: 42.405412,
                    lng: -71.121312
                },
                Carm: {
                    lat: 42.409395,
                    lng: -71.122735
                }
            };
            return {
                getTravelTime: function (hall) {
                    var deferred = $q.defer(),
                        ret_val;
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (pos) {
                            var hallLat = hallLocs[hall].lat,
                                hallLng = hallLocs[hall].lng,
                                myLat = pos.coords.latitude,
                                myLong = pos.coords.longitude,

                                // latitude difference
                                dLat = (hallLat - myLat) * Math.PI / 180,

                                // longitude difference
                                dLon = (hallLng - myLong) * Math.PI / 180,

                                a = Math.sin(dLat / 2) *
                                    Math.sin(dLat / 2) +
                                    Math.cos(myLat *
                                        Math.PI / 180) *
                                    Math.cos(hallLat *
                                        Math.PI / 180) *
                                    Math.sin(dLon / 2) *
                                    Math.sin(dLon / 2),
                                c = 2 * Math.atan2(
                                    Math.sqrt(a),
                                    Math.sqrt(1 - a)
                                ),
                                mDistance = 6371000 * c;
                            // time to walk in milliseconds
                            ret_val = (mDistance / 0.0014);
                            deferred.resolve(ret_val);
                        });
                        return deferred.promise;
                    }
                    return 300000; // default time in milliseconds (5 mins)
                },
                postMeal: function (meal) {
                    return $http.post('/postmeal', meal);
                },
                getMeals: function (dateString, endTime) {
                    return $http({
                        url: '/getmeals',
                        method: 'GET',
                        params: {
                            start_time: dateString,
                            end_time: endTime
                        }
                    });
                }
            };
        });
}());
