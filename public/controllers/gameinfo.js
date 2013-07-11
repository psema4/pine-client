var testApp = angular.module('testapp');

function gameInfoController($scope, $location, gameinfo, gamepad) {
    $scope.title = '';
    $scope.description = '';
    $scope.gamepad = gamepad;

    var id = /\/(\w+)$/.exec($location.$$path)[1];

console.log('looking up game id:', id);

    $scope.gameInfo = gameinfo.get(id, function(manifest) {
        $scope.title = manifest.title;
        $scope.description = manifest.description;
    });

    $scope.quit = function() {
        $location.path('/Explore');
    }

   /* Gamepad Handling */
    $scope.gamepadInterval = setInterval(function() {
        $scope.$apply(function() {
            var gpStates = gamepad.poll();
            var gp0 = gpStates[0];

            if (gp0) {
                // button 2 (quit)
                if (gp0.buttons[1] == 1) {
                    setTimeout(function() { $scope.quit(); }, 100);
                }
            }
        });
    }, 250);
}

testApp.controller('gameInfoController', gameInfoController);
gameInfoController.$inject = ['$scope', '$location', 'GameInfo', 'Gamepad'];

