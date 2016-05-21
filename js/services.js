angular.module('choiceModule', [])
    .factory('theChoices', function () {
        var choices = [
            { name: 'eat', icon: 'fa-cutlery' },
            { name: 'post', icon: 'fa-bullhorn' },
            { name: 'chat', icon: 'fa-comment' },
            { name: 'profile', icon: 'fa-user' }
        ];

        return {
            'choices': choices
        };
    });

//authentication stuff
angular.module('authentication', [])
    .factory('facebookService', function ($q) {
        return {
            // getMyLastName: function () {
            //     var deferred = $q.defer();
            //     FB.api('/me', {
            //         fields: 'last_name'
            //     }, function (response) {
            //         if (!response || response.error) {
            //             deferred.reject('Error occured');
            //         } else {
            //             deferred.resolve(response);
            //         }
            //     });
            //     return deferred.promise;
            // },
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

// angular.module('dbCommunicator', [])
//     .factory('dbService', function ($http) {
//         return {
//             postMeal: function (meal) {
//                 $http.
//             }
//         };
//     });




// .service('Session', function () {
//     this.create = function (sessionId, userId, userRole) {
//         this.id = sessionId;
//         this.userId = userId;
//         this.userRole = userRole;
//     };
//     this.destroy = function () {
//         this.id = null;
//         this.userId = null;
//         this.userRole = null;
//     };
// })
// .factory('AuthService', function ($http, Session) {
//     var authService = {};
//     authService.login = function (credentials) {
//         return $http
//             .post('/login', credentials)
//             .then(function (res) {
//                 Session.create(res.data.id, res.data.user.id,
//                     res.data.user.role);
//                 return res.data.user;
//             });
//     };
//     authService.isAuthenticated = function () {
//         return !!Session.userId;
//     };

//     authService.isAuthorized = function (authorizedRoles) {
//         if (!angular.isArray(authorizedRoles)) {
//             authorizedRoles = [authorizedRoles];
//         }
//         return (authService.isAuthenticated() &&
//             authorizedRoles.indexOf(Session.userRole) !== -1);
//     };

//     return authService;
// });
