var testApp = angular.module('testapp', ['ngStorage']);

function envController($scope, $location, splash, gamepad, sound, shutdown, update, sysinfo, news, toast, $sessionStorage) {
    // setup localStorage/sessionStorage
    $scope.id = 'env';
    if (! $sessionStorage[$scope.id]) {
        $sessionStorage[$scope.id] = {
            hasRun: false,
            focus: 0
        };
    }

    $scope.games = [];
    $scope.launchers = [];
    $scope.focus = ($sessionStorage && $sessionStorage[$scope.id] && $sessionStorage[$scope.id].focus) || 0;
    $scope.splash = splash;
    $scope.isPineSystem = false;
    $scope.gamepad = gamepad;
    $scope.gamepadDump = gamepad.poll();
    $scope.launchTarget = false;
    $scope.$storage = $sessionStorage;

//FIXME: Generalize, give user ability to configure gamepad mappings
$scope.bumController = false;

    // wait for splash (only show on first view, per session)
    var hasRun = $sessionStorage[$scope.id].hasRun || false;
    if (! hasRun) {
        $sessionStorage[$scope.id].hasRun = true;
        setTimeout(function() {
            toast({ delay: 10000, msg: "<h3>Welcome to Pine!</h3>Gamepad users should note:<ul><li>Left and right to select a launcher</li><li>Button 1 to activate a launcher</li><li>Button 2 to go back</li><li>In-game: Button 10 (Start button) for the main menu</li></ul>" });
        }, 8000);
    }

    /* Watches */
    $scope.$watch('focus', function() {
        $sessionStorage[$scope.id].focus = $scope.focus;
    });

    $scope.$watch(function() {
        return angular.toJson($sessionStorage);
    }, function() {
        $scope.focus = $sessionStorage[$scope.id].focus;
    });

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
    sysinfo.get(function(info) {
        $scope.isPineSystem = info.ispine || false;
        $scope.games = info.games || [];
        updateLaunchers();
    });

    function updateLaunchers() {
        var newLaunchers = [];

        [].forEach.call($scope.games, function(game) {
            newLaunchers.push({
                id: game.id,
                title: game.title,
                icon: 'games/' + game.id + '/' + game.icon
            });
        });

        $scope.launchers = newLaunchers.sort(function(a, b) {
            return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
        });

        // append system-proxy launchers
        if ($scope.isPineSystem > 0) {
            $scope.launchers.push({ id: 'halt', title: 'Halt', icon: 'assets/halt.png' });
            $scope.launchers.push({ id: 'reboot', title: 'Reboot', icon: 'assets/reboot.png' });
            $scope.launchers.push({ id: 'update', title: 'Update', icon: 'assets/update.png' });
        }

        setTimeout(function() {
            var launcherSelected = document.querySelectorAll('.launcher')[$scope.focus];
            if (launcherSelected) {
                launcherSelected.classList.add('focus');
            }
        }, 100);
    }

    /* Gamepad Handling */
    $scope.gamepadInterval = setInterval(function() {
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
    $scope.dumper       = function() { console.log($scope.gamepad()); }

    $scope.updateClient = function() {
        update.client(function(data) {
            toast({ msg: 'Update result: ' + data });
        });
    }

    $scope.testSound = function() {
        var path = 'assets/bootsound.wav';
        console.log('testSound("' + path + '"): playing...');
        sound.play(path);
    }

    $scope.launch = function() {
        var id = this.l.id; // extract game id from the launcher directive

        if (id) {
            //FIXME: convert to switch
            if (id == 'explore') {              // have to catch non-games as special cases
                $scope.explore();

            } else if (id == 'halt') {
                $scope.halt();

            } else if (id == 'reboot') {
                $scope.reboot();

            } else if (id == 'update') {
                $scope.updateClient();

            } else {
                $location.path('/game/'+id);    // otherwise send our ng-view to the gameController
            }

        } else {
            throw new Error('launch: no launcher id');
        }
    }
}

testApp.controller('envController', envController);
envController.$inject = ['$scope', '$location', 'Splash', 'Gamepad', 'Sound', 'Shutdown', 'Update', 'Sysinfo', 'News', 'Toast', '$sessionStorage'];
