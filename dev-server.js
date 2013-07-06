var fs = require('fs');
var express = require('express');
var server = express();
var exec = require('child_process').exec;
var util = require('util');

function puts(error, stdout, stderr) {
    util.puts(stdout);
    util.puts(stderr);
}

server.get('/', function (req, res) {
  var html = fs.readFileSync(__dirname + '/public/index.html', 'utf8');
  res.send(html);
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

server.use('/public', express.static(__dirname + '/public'));

server.listen(5000);

console.log('Pine dev server is now listening on port 5000.');
console.log('Press ctrl+c to kill the server.');
