var testApp = angular.module('testapp');

function gameInfoController($scope, $location, gameinfo, gamepad, installer) {
    $scope.id = /\/(\w+)$/.exec($location.$$path)[1];
    $scope.title = '';
    $scope.description = '';
    $scope.gamepad = gamepad;
    $scope.focus = 0;
    $scope.launchTarget = false;

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
    gameinfo.get($scope.id, function(manifest) {
        $scope.title = manifest.title;
        $scope.description = manifest.description;
        if ($scope.id != manifest.id) {
            throw new Error("path id does not match manifest id");
        }
    });

    function updateLaunchers() {
        var newLaunchers = [];

        [].forEach.call($scope.store.games, function(game) {
            if (game.id == 'explore') return; // explore is a special case, don't include it

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

    $scope.quit = function() {
        $location.path('/Explore');
    }

    $scope.install = function() {
        installer.pkg($scope.id);
    }

   /* Gamepad Handling */
    $scope.gamepadInterval = setInterval(function() {
        $scope.$apply(function() {
            var gpStates = gamepad.poll();
            var gp0 = gpStates[0];

            if (gp0) {
                // left stick horizontal
                if (gp0.axes[0] < 0) {
                    if ($scope.focus > 0) {
                        $scope.focus--;
                    }
                }

                if (gp0.axes[0] > 0) {
                    if ($scope.focus < ($scope.launchers.length-1)) {
                        $scope.focus++;
                    }
                }

                // left stick vertical:    gp.axes[1]
                // right stick horizontal: gp.axes[2]
                // right stick vertical:   gp.axes[3]

                // analog pad horizontal
                if (gp0.axes[4] < 0) {
                    if ($scope.focus > 0) {
                        $scope.focus--;
                    }
                }

                if (gp0.axes[4] > 0) {
                    if ($scope.focus < ($scope.launchers.length-1)) {
                        $scope.focus++;
                    }
                }

                // analog pad vertical:   gp.axes[5]

                // button 1 (launch)
                if (gp0.buttons[0] == 1) {
                    var launcherEl = document.querySelectorAll('.launcher')[$scope.focus];
                    $scope.launchTarget = launcherEl;
                }

                // button 2 (quit)
                if (gp0.buttons[1] == 1) {
                    setTimeout(function() { $scope.quit(); }, 100);
                }
            }
        });
    }, 250);
}

testApp.controller('gameInfoController', gameInfoController);
gameInfoController.$inject = ['$scope', '$location', 'GameInfo', 'Gamepad', 'Install'];

