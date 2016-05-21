angular.module('mainModule', ['authentication', 'choiceModule'])
    .run(function ($rootScope, $location, $window) {
        if ($location.path()) {
            $rootScope.selection = $location.path().substring(1);
        } else {
            $rootScope.selection = 'eat';
            $location.path('/eat');
        }
        $rootScope.logged_in = false;
    })
    .controller('ApplicationController', ['$scope', '$rootScope', '$timeout', '$window', 'facebookService', function ($scope, $rootScope, $timeout, $window, facebookService) {
        $scope.curr_time = new Date(Date.now());
        var tick = function () {
            $scope.curr_time = new Date(Date.now());
            $timeout(tick, 1000);
        };
        $timeout(tick, 1000);
        $scope.propic = '/img/favicon.png';
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
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
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
    .controller('EatViewController', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.start_time = new Date(Math.floor((new Date(Date.now())).getTime() / 60000) * 60000);
        $scope.has_changed = false;
        var tick = function () {
            if (!$scope.has_changed) {
                $scope.start_time = new Date(Math.floor((new Date(Date.now())).getTime() / 60000) * 60000);
                $timeout(tick, 1000);
            }
        };
        $timeout(tick, 1000);
    }])
    .controller('PostViewController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
        $scope.meal = {
            time: new Date(Math.floor($scope.curr_time / 60000) * 60000),
            numswipes: 1,
            hall: 'Carm'
        };
        $scope.postMeal = function(meal) {
            if (!$rootScope.logged_in) return;
            meal.user = $scope.fullName;
            meal.img = $scope.propic;
            $http.post('/postmeal', meal);
            console.log(meal);
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
                        </ul>
                    </div>
                    <div class="user-info">
                        <img class="thumbnail propic pull-left" ng-src="{{propic}}" alt="my propic">
                        <!-- if not logged in -->
                            <!-- <button class="btn btn-success login-btn" ng-click="setSelection('login')">Log in / Sign up</button>-->
                            <fb:login-button ng-show="!logged_in" class="login-btn" scope="public_profile,email">
                            </fb:login-button>
                        <!-- else -->
                            <h4 class="username" ng-show="logged_in">{{fullName}}</h4>
                            <h5 ng-show="logged_in">112 swipes left</h5>
                    </div>
                </div>
            `,
            replace: true
        };
    });

