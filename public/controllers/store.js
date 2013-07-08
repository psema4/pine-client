var testApp = angular.module('testapp', []);

function storeController($scope, $location) {
    $scope.quit = function() {
        $location.path('/Environment');
    }

    $scope.more = function(id) {
        $location.path('/game/info/' + id);
    }
}

testApp.controller('storeController', storeController);
storeController.$inject = ['$scope', '$location'];

