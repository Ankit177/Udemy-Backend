module.exports = function(io) {
  io.on('connection', socket => {
    socket.on('join chat', params => {
      socket.join(params.room1);
      socket.join(params.room2);
    });
    socket.on('start typing', data => {
      io.to(data.receiver).emit('isTyping', data);
    });
    socket.on('stop_typing', data => {
      io.to(data.receiver).emit('has_stopped_typing', data);
    });
  });
};
