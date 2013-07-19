var services = angular.module('testapp.services');

services.factory('Achievements', ['$http', '$routeParams', 'Toast', function($http, $routeParams, toast) {
    function notify (slug) {
        $http({ method: 'GET', params: {game: $routeParams.id, slug: slug}, url: '/achievements/about' }).
            success(function(data, status, headers, config) {
                toast({ msg: '<h3>Unlocked: ' + data.title + '</h3>' + data.description });
            }).
            error(function(data, status, headers, config) {
                if (cb && typeof cb == 'function') cb(status);
            })
        ;
    }

    return {
        incr: function (slug, amount, options, cb) {
            if (typeof amount === 'object' || amount == null) {
                options = amount
                amount = 1
            }
            
            if (typeof options === 'function') {
                cb = options;
                options = null;
            }

            $http({ method: 'GET', params: {game: $routeParams.id, slug: slug, amount: amount}, url: '/achievements/incr' }).
                success(function(data, status, headers, config) {
                    if (data === 'true' && !(options && options.silent === true)) notify(slug);
                    if (cb && typeof cb == 'function') cb(status);
                }).
                error(function(data, status, headers, config) {
                    if (cb && typeof cb == 'function') cb(status);
                })
            ;
        },

        set: function (slug, amount, options, cb) {
            if (typeof amount === 'object' || amount == null) {
                options = amount
                amount = 1
            }
            
            if (typeof options === 'function') {
                cb = options;
                options = null;
            }

            $http({ method: 'GET', params: {game: $routeParams.id, slug: slug, amount: amount}, url: '/achievements/set' }).
                success(function(data, status, headers, config) {
                    if (data === 'true' && !(options && options.silent === true)) notify(slug);
                    if (cb && typeof cb == 'function') cb(status);
                }).
                error(function(data, status, headers, config) {
                    if (cb && typeof cb == 'function') cb(status);
                })
            ;
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

            $http({ method: 'GET', params: {game: $routeParams.id, slug: slug}, url: '/achievements/unlock' }).
                success(function(data, status, headers, config) {
                    if (data === 'true' && !(options && options.silent === true)) notify(slug);
                    if (cb && typeof cb == 'function') {
                        cb(data);
                    }
                }).
                error(function(data, status, headers, config) {
                    if (cb && typeof cb == 'function') cb(status);
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
                    if (cb && typeof cb == 'function') cb(status);
                })
            ;
        }
    };
}]);
