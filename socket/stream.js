module.exports = function(io, User, _) {
  const user = new User();
  io.on('connection', socket => {
    socket.on('refresh', data => {
      io.emit('refreshPage', {});
    });

    socket.on('online', data => {
      socket.join(data.room);
      user.enterRoom(socket.id, data.user, data.room);
      const list = user.getlistRoom(data.room);
      io.emit('usersOnline', _.uniq(list));
    });
    socket.on('disconnect', () => {
      const removedUser = user.removeUser(socket.id);
      if (removedUser) {
        const removedUsers = user.getlistRoom(removedUser.room);
        const arr = _.uniq(removedUsers);
        _.remove(arr, n => n === removedUser.name);
        io.emit('usersOnline', _.uniq(arr));
      }
    });
  });
};
