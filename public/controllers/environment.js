var testApp = angular.module('testapp', []);

function envController($scope, $location, splash, gamepad, sound, shutdown, update, sysinfo, news) {

$scope.launchers = [
    { id: 'explore', title: 'Explore', icon: "assets/icon.png" },
    { id: 'test', title: 'Test 1', icon: "assets/icon.png" },
    { id: 'test2', title: 'Test 2', icon: "assets/icon.png" }
];

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

    $scope.launch = function() {
        var id = this.l.id; // extract game id from the launcher directive

        if (id) {
            if (id == 'explore') {              // have to catch non-games as special cases
                $scope.explore();

            } else {
                $location.path('/game/'+id);    // otherwise send our ng-view to the gameController
            }

        } else {
            throw new Error('launch: no launcher id');
        }
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
