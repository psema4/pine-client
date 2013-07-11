var testApp = angular.module('testapp', []);

function gameController($scope, $location, splash, $routeParams, Sound, Achievements, gamepad) {
    $scope.gameid = $routeParams.id;
    $scope.splash = splash;
    $scope.sound = Sound;
    $scope.achievements = Achievements
    $scope.gamepad = gamepad;

//FIXME: Generalize, give user ability to configure gamepad mappings
$scope.bumController = true;

    $scope.setup = function() {
        var canvas = document.querySelector('canvas');
        canvas.style.top = parseInt(parseInt(window.innerHeight)/2) - 240 + 'px';
        canvas.style.left = parseInt(parseInt(window.innerWidth)/2) - 320 + 'px';
        canvas.style.visibility = 'visible';
        return canvas.getContext('2d');
    }

    $scope.quit = function() {
        $location.path('/');
    }

    /* Gamepad Handling */
    $scope.gamepadInterval = setInterval(function() {
        $scope.$apply(function() {
            var gpStates = gamepad.poll();
            var gp0 = gpStates[0];

            if (gp0) {
                // left
                if (gp0.axes[0] < 0) {
                    console.log('gamepad 0: left');
                }

                // right
                if (gp0.axes[0] > 0) {
                    console.log('gamepad 0: right');
                }

                // up
                if (gp0.axes[1] < 0) {
                    console.log('gamepad 0: up');
                }

                // down
                if (gp0.axes[1] > 0) {
                    console.log('gamepad 0: down');
                }

// see FIXME above
if ($scope.bumController) {
    // button 1
    if (gp0.buttons[2] == 1) {
        console.log('gamepad 0: button 1');
    }

    // button 2
    if (gp0.buttons[1] == 1) {
        console.log('gamepad 0: button 2');
    }

    // button 3
    if (gp0.buttons[3] == 1) {
        console.log('gamepad 0: button 3');
    }

    // button 4
    if (gp0.buttons[0] == 1) {
        console.log('gamepad 0: button 4');
    }
} else { 
                // button 1
                if (gp0.buttons[0] == 1) {
                    console.log('gamepad 0: button 1');
                }

                // button 2
                if (gp0.buttons[1] == 1) {
                    console.log('gamepad 0: button 2');
                }

                // button 3
                if (gp0.buttons[2] == 1) {
                    console.log('gamepad 0: button 3');
                }

                // button 4
                if (gp0.buttons[3] == 1) {
                    console.log('gamepad 0: button 4');
                }
}
                // bumper l
                if (gp0.buttons[4] == 1) {
                    console.log('gamepad 0: bumper left');
                }

                // bumper r
                if (gp0.buttons[5] == 1) {
                    console.log('gamepad 0: bumper right');
                }

                // trigger l
                if (gp0.buttons[6] == 1) {
                    console.log('gamepad 0: trigger left');
                }

                // trigger r
                if (gp0.buttons[7] == 1) {
                    console.log('gamepad 0: trigger right');
                }

                // select
                if (gp0.buttons[8] == 1) {
                    console.log('gamepad 0: select')
                }

                // start (quit)
                if (gp0.buttons[9] == 1) {
                    setTimeout(function() { $scope.quit(); }, 100);
                }
            }
        });
    }, 250);

}

testApp.controller('gameController', gameController);
gameController.$inject = ['$scope', '$location', 'Splash', '$routeParams', 'Sound', 'Achievements', 'Gamepad'];
