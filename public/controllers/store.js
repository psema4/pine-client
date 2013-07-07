var testApp = angular.module('testapp', []);

function storeController($scope, $location) {
    $scope.quit = function() {
        $location.path('/Environment');
    }
}

testApp.controller('storeController', storeController);
storeController.$inject = ['$scope', '$location'];

