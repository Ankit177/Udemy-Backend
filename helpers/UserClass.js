class User {
  constructor() {
    this.globalArray = [];
  }
  enterRoom(socket_id, name, room) {
    const user = {
      socket_id,
      name,
      room
    };
    this.globalArray.push(user);
    return user;
  }
  getUserId(socket_id) {
    const socketId = this.globalArray.filter(
      userId => userId.socket_id === socket_id
    )[0];
    return socketId;
  }
  removeUser(socket_id) {
    const user = this.getUserId(socket_id);
    if (user) {
      this.globalArray = this.globalArray.filter(
        userId => userId.socket_id !== socket_id
      );
    }
    return user;
  }
  getlistRoom(room) {
    const roomName = this.globalArray.filter(user => user.room === room);
    const names = roomName.map(user => user.name);
    return names;
  }
}

module.exports = { User };
