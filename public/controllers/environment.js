var testApp = angular.module('testapp', []);

function envController($scope, $location, splash, gamepad, sound, shutdown, update, sysinfo, news) {
    $scope.games = [];
    $scope.launchers = [];
    $scope.focus = 0;
    $scope.splash = splash;
    $scope.isPineSystem = false;
    $scope.gamepad = gamepad;
    $scope.gamepadDump = gamepad.poll();
    $scope.launchTarget = false;

//FIXME: Generalize, give user ability to configure gamepad mappings
$scope.bumController = true;

    /* Watches */
    $scope.$watch('launchTarget', function(newValue, oldValue) {
        if ($scope.launchTarget && $scope.launchTarget.click && typeof $scope.launchTarget.click == 'function') {
            setTimeout(function() {
                $scope.launchTarget.click();
                $scope.launchTarget = false;
            }, 100);
        }
    });

    $scope.$watch('focus', function(newValue, oldValue) {
        var launcherEls = document.querySelectorAll('.launcher');

        [].forEach.call(launcherEls, function(launcherEl) {
            if (launcherEl) {
                launcherEl.classList.remove('focus');
            }
        });

        var launcherEl = launcherEls[newValue];
        if (launcherEl) {
            launcherEl.classList.add('focus');
        }
    });

    /* Init */
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

        $scope.launchers = newLaunchers.sort(function(a, b) {
            return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
        });

        setTimeout(function() {
            var launcherEl0 = document.querySelectorAll('.launcher')[0];
            if (launcherEl0) {
                launcherEl0.classList.add('focus');
            }
        }, 100);
    }

    /* Gamepad Handling */
    setInterval(function() {
        $scope.$apply(function() {
            var gpStates = gamepad.poll();
            var gp0 = gpStates[0];

            if (gp0) {
                // left stick horizontal
                if (gp0.axes[0] < 0) {
                    console.log('left');
                    if ($scope.focus > 0) {
                        $scope.focus--;
                    }
                }

                if (gp0.axes[0] > 0) {
                    console.log('right');
                    if ($scope.focus < ($scope.launchers.length-1)) {
                        $scope.focus++;
                    }
                }

                // left stick vertical:    gp.axes[1]
                // right stick horizontal: gp.axes[2]
                // right stick vertical:   gp.axes[3]

                // analog pad horizontal
                if (gp0.axes[4] < 0) {
                    console.log('left');
                    if ($scope.focus > 0) {
                        $scope.focus--;
                    }
                }

                if (gp0.axes[4] > 0) {
                    console.log('right');
                    if ($scope.focus < ($scope.launchers.length-1)) {
                        $scope.focus++;
                    }
                }

                // analog pad vertical:   gp.axes[5]

// see FIXME above
if ($scope.bumController) {
    if (gp0.buttons[2] == 1) {
        var launcherEl = document.querySelectorAll('.launcher')[$scope.focus];
        $scope.launchTarget = launcherEl;
    }
} else {
                if (gp0.buttons[0] == 1) {
                    var launcherEl = document.querySelectorAll('.launcher')[$scope.focus];
                    $scope.launchTarget = launcherEl;
                }
}
            }

            $scope.gamepadDump = JSON.stringify(gpStates);
        });
    }, 250);

    $scope.news         = news.get(function(latest) { $scope.news = latest; });
    $scope.explore      = function() { $location.path('/Explore'); }
    $scope.halt         = function() { shutdown.halt(); }
    $scope.reboot       = function() { shutdown.halt(true); }
    $scope.updateClient = function() { update.client(); }
    $scope.dumper       = function() { console.log($scope.gamepad()); }

    $scope.testSound = function() {
        var path = 'assets/bootsound.wav';
        console.log('testSound("' + path + '"): playing...');
        sound.play(path);
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
}

testApp.controller('envController', envController);
envController.$inject = ['$scope', '$location', 'Splash', 'Gamepad', 'Sound', 'Shutdown', 'Update', 'Sysinfo', 'News'];
