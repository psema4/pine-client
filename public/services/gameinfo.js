var services = angular.module('testapp.services');

services.factory('GameInfo', ['$http', function($http) {
    return {
        get: function(id, cb) {
            $http({ method: 'GET', url: 'http://pinegames.org/game/' + id }).
                success(function(data, status, headers, config) {
                    console.log('gameinfo.get: success:', status, data);
                    if (cb && typeof cb == 'function') {
                        cb(data);
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log('gameinfo.get: error:', status, data, headers, config);
                })
            ;
        }
    };
}]);

