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
