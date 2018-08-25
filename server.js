const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const dbconfig = require('./config/secret');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.Promise = global.Promise;

mongoose.connect(
  dbconfig.url,
  { useNewUrlParser: true }
);

require('./socket/stream')(io);
require('./socket/private-chat')(io);
const auth = require('./routes/auth-route');
const post = require('./routes/post-routes');
const users = require('./routes/user-route');
const friends = require('./routes/friends-route');
const messages = require('./routes/message-route');

app.use('/api/chatapp', auth);
app.use('/api/chatapp', post);
app.use('/api/chatapp', users);
app.use('/api/chatapp', friends);
app.use('/api/chatapp', messages);

server.listen(3000, () => {
  console.log('server is running on port 3000');
});
