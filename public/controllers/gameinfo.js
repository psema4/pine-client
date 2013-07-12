var testApp = angular.module('testapp');

function gameInfoController($scope, $location, gameinfo, gamepad, installer) {
    $scope.id = /\/(\w+)$/.exec($location.$$path)[1];
    $scope.title = '';
    $scope.description = '';
    $scope.gamepad = gamepad;
    //$scope.install = install;

    gameinfo.get($scope.id, function(manifest) {
        $scope.title = manifest.title;
        $scope.description = manifest.description;
        if ($scope.id != manifest.id) {
            throw new Error("path id does not match manifest id");
        }
    });

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

