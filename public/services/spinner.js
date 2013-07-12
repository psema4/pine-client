var services = angular.module('testapp.services', []);

services.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('PineHttpInterceptor');

    var spinnerFunction = function (data, headersGetter) {
        document.querySelector('#spinner').style.visibility = 'visible';
        return data;
    };

    $httpProvider.defaults.transformRequest.push(spinnerFunction);
})

services.factory('PineHttpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            document.querySelector('#spinner').style.visibility = 'hidden';
            return response;

        }, function (response) {
            document.querySelector('#spinner').style.visibility = 'hidden';
            return $q.reject(response);
        });
    };
});
