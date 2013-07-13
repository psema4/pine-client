var services = angular.module('testapp.services');

// Controller test app & button layout:
//      http://www.html5rocks.com/en/tutorials/doodles/gamepad/gamepad-tester/tester.html

services.factory('Gamepad', function() {
    return {
        supported: !!navigator.webkitGetGamepads || !!navigator.webkitGamepads
      , poll: function() {
            var pads = navigator.webkitGetGamepads() || navigator.webkitGamepds();
            return pads;
        }
    };
});
