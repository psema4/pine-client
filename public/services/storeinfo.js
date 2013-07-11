var services = angular.module('testapp.services');

services.factory('Storeinfo', ['$http', function($http) {
    return {
        get: function(cb) {
            $http({ method: 'GET', url: 'http://pinegames.org/system/info' }).
                success(function(data, status, headers, config) {
                    console.log('sysinfo.get: success:', status, data);
                    if (cb && typeof cb == 'function') {
                        cb(data);
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log('sysinfo.get: error:', status, data, headers, config);
                })
            ;
        }
    };
}]);
