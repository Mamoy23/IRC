var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};
var rooms = {};

io.on('connection', (socket) => {
  socket.emit('ROOMS', rooms);

  socket.on('USER', function(user){
    users[user] = {id: socket.id, nick: ''};
    console.log(users);
    socket.on('disconnect', function(){
      delete users[user];
    })
  })

  socket.on('SEND_MESSAGE', function(data){
    var msg = data.message;
    var cmd = msg.split(' ');
    var channel = data.channel;
    var nickname = data.author.nickname;
    var username = data.author.username;

    switch (true){
      case msg.startsWith('/nick'):
        users[username].nick = cmd[1];
        //io.emit('NICKNAME', { username: username, nickname: cmd[1] });
        io.emit('RESPONSE', username+' is now nicknamed '+cmd[1]);
        socket.emit('NICKNAME_SET', users[username].nick);
        break;
      case msg.startsWith('/users'):
        var result = rooms[channel];
        socket.emit('USERS', result);
        break;
      case msg.startsWith('/create'):
        socket.join(cmd[1], function(){
          socket.emit('CHANGE_CHANNEL', cmd[1]);
          rooms[cmd[1]] = [username];
          io.emit('RESPONSE', username+' create channel "'+cmd[1]+'"');
          io.emit('ROOMS', rooms);
        });
        break;
      case msg.startsWith('/join'):
        if(cmd[1] in rooms){
          socket.join(cmd[1]);
          socket.emit('CHANGE_CHANNEL', cmd[1]);
          if(rooms[cmd[1]].includes(username) === false){
            rooms[cmd[1]].push(username);
          }
          io.in(cmd[1]).emit('RESPONSE', username+' join channel '+cmd[1]);
          io.emit('ROOMS', rooms);
        }
        else{
          socket.emit('RESPONSE', 'No channel found for '+cmd[1]);
        }
        console.log(rooms);
        break;
      case msg.startsWith('/list'):
        console.log(rooms);
        if(Object.keys(rooms).length > 0){
          if(cmd[1]){
            var result = {};
            Object.keys(rooms).forEach(function(element){
              if(element.includes(cmd[1])){
                result[element] = element;
              }
            })
            if(Object.keys(result).length > 0){
              socket.emit('LIST', result);
            }
            else{
              socket.emit('RESPONSE', 'No channel found for '+cmd[1]);
            }
          }
          else {
            socket.emit('LIST', rooms);
          }
        }
        else{
          socket.emit('RESPONSE', 'No channel, please create');
        }
        break;
      case msg.startsWith('/delete'):
        if(cmd[1] in rooms){
          if(rooms[cmd[1]][0] === username){
            delete rooms[cmd[1]];
            io.emit('RESPONSE', username+' delete channel '+cmd[1]);
            socket.emit('CHANGE_CHANNEL', '');
            io.emit('ROOMS', rooms);
          }
          else{
            socket.emit('RESPONSE', 'Sorry, permission denied for delete '+cmd[1]);
          }
        }
        else{
          socket.emit('RESPONSE', 'No channel found for '+cmd[1]);
        }
        break;
      case msg.startsWith('/part'):
        if(cmd[1] in rooms){
          socket.leave(cmd[1]);
          let index = rooms[cmd[1]].indexOf(username);
          rooms[cmd[1]].splice(index, 1);
          io.in(cmd[1]).emit('RESPONSE', username+' leave channel '+cmd[1]);
          io.emit('ROOMS', rooms);
          socket.emit('CHANGE_CHANNEL', '');
        }
        else{
          socket.emit('RESPONSE', 'No channel found for '+cmd[1]);
        }
        break;
      case msg.startsWith('/msg'):
        let receiver = cmd[1];
        if(users[receiver]){
          socket.join(receiver);
          socket.emit('CHANGE_CHANNEL', receiver);
          rooms[receiver] = [username, receiver];
          cmd.splice(0, 2);
          let privateMsg = cmd.join(' ');
          console.log(privateMsg);
          socket.to(users[receiver].id).emit('RECEIVE_MESSAGE', privateMsg);
        }
        else{
          socket.emit('RESPONSE', 'No user found for '+cmd[1]);
        }
        break;
      default:
        if(channel in rooms){
          io.in(channel).emit('RECEIVE_MESSAGE', data);
        }
        else{
          socket.emit('RESPONSE', 'Please first create your own channel, or join a channel');
        }
    }
  })
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});