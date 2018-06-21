var app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server);
var users 			= [];
var connections	= [];
var messages 		= [{user: 'admin', msg: 'start chatting...'}];
//app.set('view engine', 'ejs');
console.log('server is running');
app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(s){
  connections.push(s);
  io.emit('online', connections.length);
  io.emit('old msg', messages);

  s.on('new msg', function(msg){
    io.emit('new msg', msg);
    messages.push(msg);
  });

  s.on('old msg', function(messages){
    io.emit('old msg', messages);
    console.log(messages);
  });

  s.on('disconnect', function(s){
    connections.splice(connections.indexOf(s), 1);
    users.splice(users.indexOf(s), 1);
    io.emit('online', connections.length);
    io.emit('new user', users);
  });

  s.on('online', function(connections){
    io.emit('online', connections.length);
  })
  s.on('new user', function(user){
      users.push(user);
      io.emit('new user', users);
    });

});
server.listen(process.env.PORT ||3000);//eniroment port or 3000
