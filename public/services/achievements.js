var services = angular.module('testapp.services');

services.factory('Achievements', ['$http', '$routeParams', function($http, $routeParams) {
    return {
        incr: function (slug, amount, options) {

        },

        set: function (slug, amount, options) {

        },

        progress: function (slug, cb) {
            $http({ method: 'GET', params: {game: $routeParams.id, slug: slug}, url: '/achievements/progress' }).
                success(function(data, status, headers, config) {
                    if (cb && typeof cb == 'function') {
                        cb(data);
                    }
                }).
                error(function(data, status, headers, config) {
                    cb(status);
                })
            ;
        },

        unlock: function (slug, options, cb) {
            if (typeof options === 'function') {
                cb = options;
                options = null;
            }

            if (!(options && options.silent === true)) console.log("Unlocked achievement '" + slug + "'");

            $http({ method: 'GET', params: {game: $routeParams.id, slug: slug}, url: '/achievements/unlock' }).
                success(function(data, status, headers, config) {
                    if (cb && typeof cb == 'function') {
                        cb(data);
                    }
                }).
                error(function(data, status, headers, config) {
                    cb(status);
                })
            ;
        },

        unlocked: function (slug, cb) {
            $http({ method: 'GET', params: {game: $routeParams.id, slug: slug}, url: '/achievements/unlocked' }).
                success(function(data, status, headers, config) {
                    if (cb && typeof cb == 'function') {
                        cb(data);
                    }
                }).
                error(function(data, status, headers, config) {
                    cb(status);
                })
            ;
        }
    };
}]);
