angular.module('testapp.services', [], function($provide) {
    $provide.factory('Gamepad', function() {
        return {
            supported: !!navigator.webkitGetGamepads || !!navigator.webkitGamepads
          , connected: false
          , poll: function() {
                var pads = navigator.webkitGetGamepads() || navigator.webkitGamepds();
                return pads;
            }
        };
    });

    $provide.factory('Sound', ['$http', function($http) {
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

    $provide.factory('Splash', function() {
        return function() {
            var delay = arguments[1] || 6000
              , start = false
              , images = []
              , prefix = ''
              , ptr = 0
              , handler = function(images, delay, prefix) {
                    var el = document.querySelector('#splash');

                    if (ptr == 0) {
                        el.style.display = 'block';
                    }

                    if (++ptr == images.length+1) {
                        el.style.display = 'none';

                    } else {
                        // add splash img 
                        el.innerHTML = '<img id="splash-' + (ptr-1) + '" class="splash-img" src="' + prefix + images[ptr-1] + '" style="visibility: hidden;" />';

                        // next tick get the dom element
                        setTimeout(function() {
                            var el = document.querySelector('img.splash-img')
                                screenW = parseInt(window.innerWidth)
                              , screenH = parseInt(window.innerHeight)
                            ;

                            // next tick get the calculated size of the dom element
                            setTimeout(function() {
                                var tmp = null
                                  , imgW = parseInt(window.getComputedStyle(el).width) || 64
                                  , imgH = parseInt(window.getComputedStyle(el).height) || 64
                                  , halfScreenW = parseInt(screenW/2)
                                  , halfScreenH = parseInt(screenH/2)
                                  , halfImageW = parseInt(imgW/2)
                                  , halfImageH = parseInt(imgH/2)
                                ;

                                el.style.position = 'absolute';
                                el.style.top = halfScreenH - halfImageH + 'px';
                                el.style.left = halfScreenW - halfImageW + 'px';
                                el.style.visibility = 'visible';
                            }, 0);
                        }, 0);

                        setTimeout(function() { handler(images, delay, prefix); }, delay);
                    }
                }
            ;

            if (typeof arguments[0] == 'string') {
                start = true;
                images.push(arguments[0]);

            } else if (arguments[0] && 'deck' in arguments[0]) {
                if ('delay' in arguments[0]) {
                    delay = arguments[0].delay;
                }

                start = true;
                images = arguments[0].deck;
            }

            if (arguments[0] && 'prefix' in arguments[0]) {
                prefix = arguments[0].prefix;
            }

            if (start) {
                handler(images, delay, prefix);
            }
        }
    });
});
