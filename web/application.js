try {

  var socket = io.connect('http://localhost:5000');

  socket.on('connect', function () {
    
    socket.emit('data', {'user_id':'1'});
  });
} catch (Exception) {

  console.log('Node server not running.');
}	