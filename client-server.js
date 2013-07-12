var fs = require('fs');
var express = require('express');
var server = express();
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require('util');
//var http = require('http');

// configurables
//   IMPORTANT: On a Raspberry Pi (pine-distro) or propery configured Ubuntu/Debian machine, be sure to set
//              isPublic to false; otherwise  proxy-services such as halt, reboot & update may be exposed to
//              the world at large.
//
var isPublic = false;    // if false, will reject ALL requests unless they originate from localhost
var serverPort = 5000;  // pine default port is 5000

function puts(error, stdout, stderr) {
    util.puts(stdout);
    util.puts(stderr);
}

server.get('/', function (req, res) {
  var html = fs.readFileSync(__dirname + '/public/index.html', 'utf8');
  res.send(html);
});

server.get('/system/info', function(req, res) {
    var isPine = process.env.PINESYSTEM || '0';

    fs.readdir('public/games', function(err, folders) {
        var games = [];

        [].forEach.call(folders, function(folder) {
            var filename = 'public/games/' + folder + '/game.json';
            games.push(JSON.parse(fs.readFileSync(filename, 'utf8')));
        });

        var info = {
            ispine: isPine,
            games: games
        }

        res.send(JSON.stringify(info));
    });
});

server.get('/halt', function(req, res) {
    exec('sudo /sbin/shutdown -a -h 0'
      , { cwd: process.env.pwd, env: process.env }
      , function(error, stdout, stderr) {
            puts(error, stdout, stderr);
            res.send('halt');
        }
    );
});

server.get('/reboot', function(req, res) {
    exec('sudo /sbin/shutdown -a -r 0'
      , { cwd: process.env.pwd, env: process.env }
      , function(error, stdout, stderr) {
            puts(error, stdout, stderr);
            res.send('reboot');
        }
    );
});

server.get('/update', function(req, res) {
    var msg = '/update: running';
    console.log(msg);

    var proc = spawn('./update.sh', []);

    proc.on('stdout', function(data) {
        console.log('/update: stdout: ' + data);
    });

    proc.on('stderr', function(data) {
        console.log('/update: stderr: ' + data);
    });

    proc.on('exit', function(statusCode) {
        console.log('/update: result: ' + statusCode);
        var msg = '';

        if (statusCode == 0) {
            msg = 'rebooting';
        } else if (statusCode == 1) {
            msg = 'up-to-date - no update required';
        } else if (statusCode == 2) {
            msg = 'merge conflict - manual intervention required';
        } else {
            msg = 'unknown error';
        }

        console.log(msg);
        res.send(msg);
    });
});

server.get('/sound', function(req, res) {
    var path = req.query && req.query.snd;

    if (path) {
        path = './public/' + path;

        //FIXME: sanitize, test for existence
        var proc = spawn('/usr/bin/aplay', [path]);

        proc.on('stderr', function(data) {
            console.log('/sound: stderr: ' + data);
        });

        proc.on('exit', function(statusCode) {
            console.log('/sound: ok: ' + path);
            res.send('ok');
        });

    } else {
        var msg = '/sound: no sound specified';
        console.log(msg);
        res.send(msg);
    }
});

//FIXME: Fetch data from serverside rather than using a temporary object
var achievement_data = {}
function getAchievementProgress (game, slug, cb) {
    if (!achievement_data[game]) achievement_data[game] = {};
    cb(achievement_data[game][slug] || 0)
}

function setAchievementProgress (game, slug, value, cb) {
    if (!achievement_data[game]) achievement_data[game] = {};
    achievement_data[game][slug] = value
    cb(null)
}

server.get('/achievements/progress', function (req, res) {
    getAchievementProgress(req.query.game, req.query.slug, function (progress) {
        res.send(progress)
    })
})

server.get('/achievements/unlocked', function (req, res) {
    fs.readFile('public/games/' + req.query.game + '/game.json', 'utf8', function (err, game) {
        var achievement = JSON.parse(game).achievements[req.query.slug];
        
        getAchievementProgress(req.query.game, req.query.slug, function (progress) {
            res.send(
                !achievement.goal && !!progress
             || achievement.goal === progress
            );
        });
    })
})

server.get('/achievements/unlock', function (req, res) {
    fs.readFile('public/games/' + req.query.game + '/game.json', 'utf8', function (err, game) {
        var achievement = JSON.parse(game).achievements[req.query.slug];
        getAchievementProgress(req.query.game, req.query.slug, function (amount) {
            if (amount === (achievement.goal || 1)) {
                res.send(false)
            }
            else
            {
                setAchievementProgress(req.query.game, req.query.slug, achievement.goal || 1, function (err) {
                    res.send(true);
                });
            }
        })
    })
})

server.get('/achievements/incr', function (req, res) {
    fs.readFile('public/games/' + req.query.game + '/game.json', 'utf8', function (err, game) {
        var achievement = JSON.parse(game).achievements[req.query.slug], goal = achievement.goal || 1;
        
        getAchievementProgress(req.query.game, req.query.slug, function (amount) {
            if (amount === goal) {
                res.send(false);
            }
            else
            {
                amount += parseInt(req.query.amount);
                if (amount > goal) amount = achievement.goal;
                setAchievementProgress(req.query.game, req.query.slug, amount, function (err) {
                    res.send(amount === goal);
                });
            }
        });
    })
})

server.use('/public', express.static(__dirname + '/public'));

function writeLogHead() {
    var mode = isPublic ? 'public' : 'private';
    console.log('Pine client-server is ' + mode + ' and now listening on port ' + serverPort + '.');
    console.log('Press ctrl+c to kill the server.');
}

if (isPublic) {
    server.listen(serverPort, writeLogHead);
} else {
    server.listen(serverPort, 'localhost', writeLogHead);
}
