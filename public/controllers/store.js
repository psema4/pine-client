var testApp = angular.module('testapp');

function storeController($scope, $location, gamepad) {
    $scope.gamepad = gamepad;

    $scope.launchers = [
        {
            id: 'test',
            title: 'Test 1',
            icon: 'assets/icon.png'
        },
        {
            id: 'test2',
            title: 'Test 2',
            icon: 'assets/icon.png'
        }
    ];
    
    $scope.quit = function() {
        $location.path('/');
    }

    $scope.more = function(id) {
        $location.path('/game/info/' + id);
    }

    $scope.more2 = function() {
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
                // start (quit)
                if (gp0.buttons[9] == 1) {
                    setTimeout(function() { $scope.quit(); }, 100);
                }
            }
        });
    }, 250);
}

testApp.controller('storeController', storeController);
storeController.$inject = ['$scope', '$location', 'Gamepad'];

