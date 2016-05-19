angular.module('mainModule', ['authentication', 'choiceModule'])
    .run(function ($rootScope, $location) {
        if ($location.path()) {
            $rootScope.selection = $location.path().substring(1);
        } else {
            $rootScope.selection = 'eat';
            $location.path('/eat');
        }
    })
    // authentication stuff
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        notAuthenticated: 'auth-not-authenticated',
    })
    .controller('ApplicationController', function ($scope, $timeout) {
        $scope.curr_time = new Date(Date.now());
        var tick = function () {
            $scope.curr_time = new Date(Date.now());
            $timeout(tick, 1000);
        };
        $timeout(tick, 1000);
        // authentication stuff
        $scope.currentUser = null;
        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };
    })
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
    // authentication stuff
    .controller('LoginController', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
            }, function () { // error function
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
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
                        <img class="thumbnail propic pull-left" src="/img/favicon.png" alt="my propic">
                        <!-- if not logged in -->
                            <!-- <button class="btn btn-success login-btn" ng-click="setSelection('login')">Log in / Sign up</button>-->
                            <fb:login-button class="login-btn" scope="public_profile,email" onlogin="checkLoginState();">
                </fb:login-button>

                        <!-- else -->
                            <!-- <h4 class="username">guest</h4>
                            <h5>112 swipes left</h5> -->
                    </div>
                </div>
            `,
            replace: true
        };
    });
