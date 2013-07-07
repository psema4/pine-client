var services = angular.module('testapp.services');

services.factory('Update', ['$http', function($http) {
    return {
        client: function(path) {
            // timeout after a short period so we don't block (play multiple sounds simultaneously)
            $http({ method: 'GET', url: '/update', params: { tgt: 'client' } }).
                success(function(data, status, headers, config) {
                   console.log('update: success:', status, data);
                }).
                error(function(data, status, headers, config) {
                    console.log('update: error:', status, data, headers, config);
                })
            ;
        }
    };
}]);
