var fs = require('fs');
var express = require('express');
var server = express();
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require('util');

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
    res.send('{"ispine":"' + isPine + '"}');
});

server.get('/testsound', function(req, res) {
    exec('/usr/bin/aplay /etc/bootsound.wav'
      , { cwd: process.env.pwd, env: process.env }
      , function(error, stdout, stderr) {
            puts(error, stdout, stderr);
            res.send('ok');
        }
    );
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
    var msg = '/update: stub - trying update.sh';
    console.log(msg);
/*
    exec('./update.sh'
      , { cwd: process.env.pwd, env: process.env }
      , function(error, stdout, stderr) {
            puts(error, stdout, stderr);
            res.send('update & reboot');
        }
    );
*/
    var proc = spawn('./update.sh', []);

    proc.on('stdout', function(data) {
        console.log('/sound: stdout: ' + data);
    });

    proc.on('stderr', function(data) {
        console.log('/sound: stderr: ' + data);
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

//        proc.on('stdout', function(data) {
//            console.log('/sound: stdout: ' + data);
//        });

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

server.use('/public', express.static(__dirname + '/public'));

server.listen(5000, 'localhost', function() {
    console.log('Pine dev server is now listening on port 5000.');
    console.log('Press ctrl+c to kill the server.');
});
