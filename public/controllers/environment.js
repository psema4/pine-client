var testApp = angular.module('testapp', []);

function envController($scope, $location, splash, gamepad, sound, shutdown, update, sysinfo, news) {
    $scope.games = [];
    $scope.launchers = [];

    $scope.news = news.get(function(latest) {
        $scope.news = latest;
    });

    $scope.splash = splash;

    $scope.isPineSystem = false;

    var info = sysinfo.get(function(info) {
        $scope.isPineSystem = info.ispine || false;
        $scope.games = JSON.parse(info.games) || [];
        updateLaunchers();
    });

    function updateLaunchers() {
        var newLaunchers = [];
        [].forEach.call($scope.games, function(game) {
            newLaunchers.push({
                id: game.id,
                title: game.title,
                icon: game.icon
            });
        });
        $scope.launchers = newLaunchers;
    }

    $scope.gamepad = gamepad;
    $scope.gamepadDump = gamepad.poll();

    setInterval(function() {
        $scope.$apply(function() {
            $scope.gamepadDump = JSON.stringify(gamepad.poll());
        });
    }, 250);

    $scope.testSound = function() {
        var path = 'assets/bootsound.wav';
        console.log('testSound("' + path + '"): playing...');
        sound.play(path);
    }

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
