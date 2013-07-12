var services = angular.module('testapp.services');

services.factory('Toast', function() {
    return function(opts) {
        opts = opts || { msg: '' };
        if (! opts['delay']) opts.delay = 3000;

        var el = document.querySelector('#toast');
        el.innerHTML = opts.msg;
        el.style.display = 'inline-block';

        setTimeout(function() {
            var el = document.querySelector('#toast');
            el.innerHTML = '';
            el.style.display = 'none';
        }, opts.delay);
    }
});
