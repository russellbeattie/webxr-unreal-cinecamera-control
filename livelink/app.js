var express = require('express');
var udp = require('dgram');
var buffer = require('buffer');
var path = require('path');

var app = express();
app.use('/', express.static(path.join(__dirname, 'web')));

var http = require('http').createServer(app);
http.listen(3000, () => {
  console.log('listening on *:3000');
});

var client = udp.createSocket('udp4');

client.on('message',function(msg, info){
  console.log('Data received from server : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
});

client.on('error', function(e){
  console.error(e);
});

var command = {
    "EditorActiveCamera": [{
        "Type": "CameraAnimation"
    }, {
        "Location": [0, 0, 0],
        "Rotation": [0, 0, 0, 1],
        "Scale": [1, 1, 1],
    }]
};

var io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log('message: ' + JSON.stringify(msg, null, 2));

    command.EditorActiveCamera[1].Rotation = msg.r;
    command.EditorActiveCamera[1].Location = msg.t;

    sendCommand(command);

  });
});


function sendCommand(commandObj) {
  let cmd = Buffer.from(JSON.stringify(commandObj));
  client.send(cmd, 54321, 'localhost', function(error){
    if(error){
      console.log(error);
    } else {
      console.log('Data sent', cmd.toString());
    }
  });
}