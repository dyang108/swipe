angular.module('mainModule', ['choiceModule'])
    .run(function ($rootScope, $location) {
        if ($location.path()) {
            $rootScope.selection = $location.path().substring(1);
        } else {
            $rootScope.selection = 'eat';
            $location.path('/eat');
        }
    })
    .controller('ApplicationController', function ($scope, $timeout) {
        $scope.curr_time = new Date(Date.now());
        var tick = function () {
            $scope.curr_time = new Date(Date.now());
            $timeout(tick, 1000);
        };
        $timeout(tick, 1000);
    })
    .controller('NavController', ['$scope', '$rootScope', '$location', 'theChoices',
        function ($scope, $rootScope, $location, theChoices) {
            $scope.choices = theChoices.choices;
            $scope.setSelection = function (name) {
                $rootScope.selection = name;
                $location.path('/' + name);
            };
        }
    ])
    .controller('EatViewController', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.start_time = new Date(Math.floor((new Date(Date.now())).getTime() / 60000) * 60000);
    }]);
