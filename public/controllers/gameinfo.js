var testApp = angular.module('testapp', []);

function gameInfoController($scope, $location, gameinfo) {
    $scope.title = '';
    $scope.description = '';

    var id = /\/(\w+)$/.exec($location.$$path)[1];

    $scope.gameInfo = gameinfo.get(id, function(manifest) {
        $scope.title = manifest.title;
        $scope.description = manifest.description;
    });

    $scope.quit = function() {
        $location.path('/Explore');
    }
}

testApp.controller('gameInfoController', gameInfoController);
gameInfoController.$inject = ['$scope', '$location', 'GameInfo'];

