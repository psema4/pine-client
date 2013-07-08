var testApp = angular.module('testapp', []);

function envController($scope, $location, splash, gamepad, sound, shutdown, update, sysinfo, news) {
    $scope.news = news.get(function(latest) {
        $scope.news = latest;
    });
    $scope.splash = splash;

    $scope.isPineSystem = false;

    var info = sysinfo.get(function(info) {
        $scope.isPineSystem = info.ispine || false;
    });

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

    $scope.reboot = function() {
        shutdown.halt(true);
    }

    $scope.updateClient = function() {
        update.client();
    }

    $scope.launch = function(id) {
        $location.path('/game/'+id);
    }

    $scope.explore = function() {
        $location.path('/Explore');
    }

    $scope.dumper = function() {
        console.log($scope.gamepad());
    }
}

testApp.controller('envController', envController);
envController.$inject = ['$scope', '$location', 'Splash', 'Gamepad', 'Sound', 'Shutdown', 'Update', 'Sysinfo', 'News'];
