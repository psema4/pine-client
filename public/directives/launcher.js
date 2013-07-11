var directives = angular.module('testapp.directives', []);
 
directives.directive('launcher', function factory() {
    return {
        restrict: 'E',
        replace: true,
        scope: { handler: '&onClick', title: '@title', icon: '@icon' },
        template: '<button ng-click="handler()" class="launcher" style="background-image: url({{ icon }});">{{ title }}</button>',
        compile: function compile(tElement, tAttrs) {
            return function postLink(scope, iElement, iAttrs) {
            }
        }
    };
});
