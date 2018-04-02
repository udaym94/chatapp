const socket = io();
socket.on('connect', function(){
  console.log('Connected to Server');
});
socket.on('disconnect', function(){
  console.log('Disconnected from Server');
});
socket.on('newuser', function(data){
  // var message = "Welcome "+ data.name +" to the chat room";
  $('.chats').append('<div class="weclomemsg">'+ data.message +'</div>');
});

socket.on('newMessage', function(data){
  // var message = "Welcome "+ data.name +" to the chat room";
  $('.chats').append(data.message);
});

$('.joinform').on('submit', function(e){
  e.preventDefault();
  var name = $('input[name="name"]').val();
  var email = $('input[name="emailid"]').val();
  socket.emit('joinedchat', {
    name:name,
    email:email
  });
  Cookies.set('name', name);
  Cookies.set('email', email);
  $('#joinModal').modal('hide');
});

$('.sendMessage').on('submit',function(e){
  e.preventDefault();
  var name = Cookies.get('name');
  var message = $('input[name="message"]').val();
  alert('sendMessage');
  socket.emit('sendMessage',{
    name:name,
    message:message
  });
})
