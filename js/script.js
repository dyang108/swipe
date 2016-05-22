angular.module('mainModule', ['authentication', 'choiceModule', 'mealAPI'])
    .run(function ($rootScope, $location, $window) {
        // initialization code, set URL
        // note of bad practice: client side routing...
        if ($location.path()) {
            $rootScope.selection = $location.path().substring(1);
        } else {
            $rootScope.selection = 'eat';
            $location.path('/eat');
        }

        // 
        $rootScope.logged_in = false;
    })
    .controller('ApplicationController', ['$scope', '$rootScope', '$timeout', '$window', 'facebookService', 'postService', function ($scope, $rootScope, $timeout, $window, facebookService, postService) {
        // generally stuff for the sidebar and more 'global' variables
        $scope.curr_time = new Date(Date.now());
        var tick = function () {
            $scope.curr_time = new Date(Date.now());
            $timeout(tick, 5000);
        };

        $timeout(tick, 5000);
        $scope.propic = '/img/favicon.png';

        // initialize facebook. This causes a whole host of problems
        // due to asynchronicity... fixed by the FB.getloginstatus.
        // we could do better by using $broadcast on $rootScope
        $window.fbAsyncInit = function () {
            FB.init({
                appId: '1156678381029883',
                status: true,
                cookie: true,
                xfbml: true,
                version: 'v2.4'
            });
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    $rootScope.logged_in = true;
                    facebookService.getProPic()
                        .then(function (response) {
                            $scope.propic = response.data.url;
                        });
                    facebookService.getFullName()
                        .then(function (response) {
                            $scope.fullName = response.name;
                        });
                } else {}
            });
        };

        // connect to facebook API
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        $scope.quickMeal = function (hall) {
            postService.getTravelTime(hall).then(function (travelTime) {
                if (!$rootScope.logged_in) return;

                var meal = {
                    user: $scope.fullName,
                    img: $scope.propic,
                    time: new Date($scope.curr_time.getTime() + travelTime),
                    hall: hall,
                    numswipes: 1
                };

                postService.postMeal(meal);
            });
        };
    }])
    .controller('NavController', ['$scope', '$rootScope', '$location', 'theChoices',
        function ($scope, $rootScope, $location, theChoices) {
            $scope.choices = theChoices.choices;
            $rootScope.setSelection = function (name) {
                $rootScope.selection = name;
                $location.path('/' + name);
            };
        }
    ])
    .controller('EatViewController', ['$scope', '$timeout', '$http', 'postService', function ($scope, $timeout, $http, postService) {
        $scope.hall = {
            Carm: true,
            Dewick: true
        };
        $scope.start_time = new Date(Math.floor($scope.curr_time / 60000) * 60000);
        $scope.has_changed = false;
        $scope.isMeals = true;

        var tick = function () {
            if (!$scope.has_changed) {
                $scope.start_time = new Date(Math.floor($scope.curr_time / 60000) * 60000);
                $timeout(tick, 5000);
            }
        };

        $scope.timeChange = function () {
            $scope.has_changed = true;
            $scope.isMeals = true;
            $scope.getMeals();
        };

        $scope.getMeals = function () {
            var timeoffset = new Date().getTimezoneOffset() * 60000;
            var endTime = (new Date(Math.ceil(($scope.start_time - timeoffset + 1) / 86400000) * 86400000 + timeoffset));
            postService.getMeals($scope.start_time, endTime).then(function (response) {
                if (response.data.length === 0) {
                    $scope.isMeals = false;
                }

                $scope.mealList = response.data;
            }, function (response) {
                $scope.isMeals = false;
            });
        };
    }])
    .controller('PostViewController', ['$scope', '$timeout', 'postService', '$rootScope', function ($scope, $timeout, postService, $rootScope) {
        $scope.show_msg = false;
        $scope.msg = "";
        $scope.newmeal = {
            time: new Date(Math.floor($scope.curr_time / 60000) * 60000),
            numswipes: 1,
            hall: 'Carm'
        };

        $scope.postMeal = function (meal) {
            if (meal.time < $scope.curr_time - 60000) {
                $scope.msg = "Cannot post past times";
                $scope.show_msg = true;
                $timeout(function () {
                    $scope.show_msg = false;
                }, 5000);
                return;
            }
            if (!$rootScope.logged_in) {
                $scope.msg = "Please log in first";
                $scope.show_msg = true;
                $timeout(function () {
                    $scope.show_msg = false;
                }, 5000);
                return;
            }
            meal.user = $scope.fullName;
            meal.img = $scope.propic;
            postService.postMeal(meal).then(function (response) {
                $scope.msg =  "Success!";
                $scope.show_msg = true;
                $timeout(function () {
                    $scope.show_msg = false;
                }, 5000);
            }, function () {});
        };
    }])
    .directive('sidebar', function () {
        return {
            template: `
                <div id="sidebar" class="bs-sidebar affix menu col-sm-4 col-md-3">
                    <a href="/"><img class="logo-with-text" src="img/swipetext3.png" alt="logo"></a>
                    <hr>
                    <div ng-controller="NavController">
                        <ul class="nav nav-pills nav-stacked list-group">
                            <li ng-class="[{sel: item.name == selection }, 'list-group-item', 'menu-item']" ng-repeat="item in choices" ng-click="setSelection(item.name)">
                                <i class="pull-left fa {{item.icon}}" aria-hidden="true"></i> {{item.name}}
                            </li>
                            <h3 class="pull-left">Leaving now?</h3>
                            <div class="btn-group btn-group-justified quick-post" role="group">
                                <div class="btn-group" role="group">
                                    <button class="btn btn-primary btn-sm" ng-click="quickMeal('Dewick')">going to Dewick</button>
                                </div>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-primary btn-sm" ng-click="quickMeal('Carm')"">going to Carm</button>
                                </div>
                            </div>
                        </ul>
                    </div>
                    <div class="user-info">
                        <img class="thumbnail propic pull-left" ng-src="{{propic}}" alt="my propic">
                            <fb:login-button ng-show="!logged_in" class="login-btn" scope="public_profile,email" onlogin="window.location='/'">
                            </fb:login-button>
                            <h4 class="username" ng-show="logged_in">{{fullName}}</h4>
                    </div>
                </div>
            `,
            replace: true
        };
    });
