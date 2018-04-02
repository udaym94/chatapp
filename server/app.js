const express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// var app = require('express')();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

const path = require('path');

const clientDir = path.join(__dirname,'..','client');

const port = process.env.PORT || 3000; //Dynamic Port For Heroku

// app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(clientDir));

app.get('/', (req, res) => {
  res.sendFile(clientDir + '/index.html');
  // res.render('index', {'message':'Welcome to the Chat App, Please Register to Get Started'});

});

io.on('connection', (socket) => {
  console.log('Client Connected');

  //A new User has joined the chat room
  socket.on('joinedchat',(data) => {
    socket.broadcast.emit('newuser', {
      name:data.name,
      message: ''+ data.name +' joined',
      joinedAt: new Date().getTime()
    })
    socket.emit('newuser', {
      name:data.name,
      message: 'Welcome '+data.name+', to the chat app',
      joinedAt: new Date().getTime()
    })
  });

  //Send Message from a user
  socket.on('sendMessage', (data) => {
    console.log('send Message', data);
    // io.emit('') //Could have used io.emit but won't cause zigzag pattern
    socket.broadcast.emit('newMessage', {
      name:data.name,
      message: '<div class="leftChat"><div class="from"><div class="msgtime"></div>'+ data.name +'</div>'+ data.message +'</div>',
      joinedAt: new Date().getTime()
    })
    socket.emit('newMessage', {
      name:data.name,
      message: '<div class="rightChat"><div class="from"><div class="msgtime"></div>'+ data.name +'</div>'+ data.message +'</div>',
      joinedAt: new Date().getTime()
    })
  });

  //A user has sent a message,render it
  socket.on('getMesage', (data) => {

  });

  //A user has left chat
  socket.on('disconnect', () => {
    console.log('Client Disconnected');
  });
});

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
