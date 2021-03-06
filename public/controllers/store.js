var testApp = angular.module('testapp');

function storeController($scope, $location, gamepad, storeinfo, $sessionStorage) {
    // setup localStorage/sessionStorage
    $scope.id = 'store';
    if (! $sessionStorage[$scope.id]) {
        $sessionStorage[$scope.id] = {
            focus: 0
        }
    }
    $scope.gamepad = gamepad;

$scope.bumController = false;

    $scope.focus = ($sessionStorage && $sessionStorage[$scope.id] && $sessionStorage[$scope.id].focus) || 0;
    $scope.launchTarget = false;

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

    var store = storeinfo.get(function(info) {
        $scope.store = info || [];
        updateLaunchers();
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
            var launcherSelected = document.querySelectorAll('.launcher')[$scope.focus];
            if (launcherSelected) {
                launcherSelected.classList.add('focus');
            }
        }, 100);
    }

    
    $scope.quit = function() { $location.path('/'); }

    $scope.more = function() {
        var id = this.l.id; // extract game id from the launcher directive
        if (id) {
            $location.path('/game/info/' + id);
        }
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

                // button 2 (quit)
                if (gp0.buttons[1] == 1) {
                    setTimeout(function() { $scope.quit(); }, 100);
                }
            }
        });
    }, 250);
}

testApp.controller('storeController', storeController);
storeController.$inject = ['$scope', '$location', 'Gamepad', 'Storeinfo', '$sessionStorage'];

