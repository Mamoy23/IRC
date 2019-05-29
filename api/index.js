var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {
  socket.on('USER', function(user){
    users.push(user);
    socket.on('disconnect', function(){
      users.splice(users.indexOf(user), 1);
    })
  })
  socket.on('SEND_MESSAGE', function(data){
    var msg = data.message;
    var cmd = msg.split(' ');

    switch (true){
      case msg.startsWith('/nick'):
        socket.emit('NICKNAME', { username: data.author, nickname: cmd[1] });
        socket.broadcast.emit('NICKNAME', { username: data.author, nickname: cmd[1] });
        break;
      case msg.startsWith('/users'):
        socket.emit('USERS', users);
        break;
      default:
        socket.emit('RECEIVE_MESSAGE', data);
        socket.broadcast.emit('RECEIVE_MESSAGE', data);
    }

    // if(data.message.startsWith('/nick')){
    //   socket.emit('NICKNAME', { username: data.author, nickname: split[1] });
    //   socket.broadcast.emit('NICKNAME', { username: data.author, nickname: split[1] });
    // }
    // else{
    //   socket.emit('RECEIVE_MESSAGE', data);
    //   socket.broadcast.emit('RECEIVE_MESSAGE', data);
    // }
  })
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});