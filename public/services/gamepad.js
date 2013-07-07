var services = angular.module('testapp.services');

services.factory('Gamepad', function() {
    return {
        supported: !!navigator.webkitGetGamepads || !!navigator.webkitGamepads
      , connected: false
      , poll: function() {
            var pads = navigator.webkitGetGamepads() || navigator.webkitGamepds();
            return pads;
        }
    };
});
