var testApp = angular.module('testapp', []);

function envController($scope, $location, splash, gamepad, sound, shutdown, update) {
    $scope.news = "Sample News Item.";

    $scope.splash = splash;

/* Gamepads */
    $scope.gamepad = gamepad;
    $scope.gamepadDump = gamepad.poll();

    setInterval(function() {
        $scope.$apply(function() {
            $scope.gamepadDump = JSON.stringify(gamepad.poll());
        });
    }, 250);

/* End Gamepads */

/* Sound */
    $scope.testSound = function() {
        var path = 'assets/bootsound.wav';
        console.log('testSound("' + path + '"): playing...');
        sound.play(path);
    }
/* End Sound */

    $scope.halt = function() {
        shutdown.halt();
    }

    $scope.updateClient = function() {
        update.client();
    }

    $scope.launch = function(id) {
        $location.path('/Game/'+id);
    }

    $scope.explore = function() {
        $location.path('/Explore');
    }

    $scope.dumper = function() {
        console.log($scope.gamepad());
    }
}

testApp.controller('envController', envController);
envController.$inject = ['$scope', '$location', 'Splash', 'Gamepad', 'Sound', 'Shutdown', 'Update'];
