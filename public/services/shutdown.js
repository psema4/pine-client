var services = angular.module('testapp.services');

services.factory('Shutdown', ['$http', function($http) {
    return {
        halt: function(reboot) {
            var path = reboot ? '/reboot' : '/halt';

            $http({ method: 'GET', url: path }).
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
