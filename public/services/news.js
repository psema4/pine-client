var services = angular.module('testapp.services');

services.factory('News', ['$http', function($http) {
    return {
        get: function(cb) {
            $http({ method: 'GET', url: 'http://pinegames.org/news' }).
                success(function(data, status, headers, config) {
                    console.log('news.get: success:', status, data);
                    if (cb && typeof cb == 'function') {
                        cb(data.latest);
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log('news.get: error:', status, data, headers, config);
                })
            ;
        }
    };
}]);

