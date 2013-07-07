var services = angular.module('testapp.services');

services.factory('Sound', ['$http', function($http) {
    return {
        play: function(path) {
            // timeout after a short period so we don't block (play multiple sounds simultaneously)
            $http({ method: 'GET', url: '/sound', params: { snd: path }, timeout: 100 }).
                success(function(data, status, headers, config) {
                   //console.log('success playing sound:', status, data);
                }).
                error(function(data, status, headers, config) {
                    // should always fire due to timeout in configuration above; ignore it and carry on

                    //console.log('error playing sound:', status, data, headers, config);
                })
            ;
        }
    };
}]);
