var services = angular.module('testapp.services');

services.factory('Install', ['$http', function($http) {
    return {
        pkg: function(id, cb) {
            $http({ method: 'GET', url: '/download?id=' + id }).
                success(function(data, status, headers, config) {
                    console.log('install.pkg: success:', status, data);
                    if (cb && typeof cb == 'function') {
                        cb(data);
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log('install.pkg: error:', status, data, headers, config);
                })
            ;
        }
    };
}]);

