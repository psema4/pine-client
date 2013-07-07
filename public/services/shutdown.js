var services = angular.module('testapp.services');

services.factory('Shutdown', ['$http', function($http) {
    return {
        halt: function(path) {
            // timeout after a short period so we don't block (play multiple sounds simultaneously)
            $http({ method: 'GET', url: '/halt' }).
                success(function(data, status, headers, config) {
                   console.log('halt: success:', status, data);
                }).
                error(function(data, status, headers, config) {
                    console.log('halt: error:', status, data, headers, config);
                })
            ;
        }
    };
}]);
