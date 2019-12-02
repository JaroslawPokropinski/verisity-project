const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const log = require('debug')('app');

const api = require('./routes/api');
const getDatabase = require('./config/dbConfig');
const getSessionConfig = require('./config/sessionConfig');
const peerStartup = require('./config/peerStartup');
const corsConfig = require('./config/corsConfig');
const swagger = require('./config/swaggerConfig');

const UserService = require('./services/UserService');

const app = express();
app.use(cors(corsConfig));
app.use(bodyParser.json());

// Setup database and session
const database = getDatabase();
const sessionConfig = getSessionConfig(session, database);
// Setup database models
const UserModel = database['models']['user'];
const FriendsModel = database['models']['friends_relations'];
const MessageModel = database['models']['message'];
const userService = new UserService(UserModel, FriendsModel, MessageModel);
app.use(session(sessionConfig));

database.sync({ force: true })
  .then(() => userService.addUser('admin@example.com', 'admin', 'adminadmin'))
  .then(() => userService.addUser('admin2@example.com', 'admin2', 'adminadmin'))
  .then(() => userService.inviteFriend('admin@example.com', 'admin2@example.com'))
  .then(() => userService.acceptInvitation('admin2@example.com', 'admin@example.com'))

// Setup controllers
app.use('/api', api(userService));
app.use(swagger);

// Connect react application
app.get(['/', '/index.html'], (_req, res) => {
  res.redirect('/app/');
});
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(['/app', '/app/*'], (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Setup peerjs and start server
app.server = peerStartup(app);
app.server.on('connection', (client) => {
  log(`${client.id} connected!`);
});

app.server.on('disconnect', (client) => {
  log(`${client.id} disconnected!`);
  userService.dismissPeerId(client.id);
});

module.exports = app;