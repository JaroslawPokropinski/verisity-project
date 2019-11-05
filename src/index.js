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
const UserModel = database.import(path.join(__dirname, 'models', 'UserModel'));
// FriendsRelation Model
const FriendsModel = database.import(path.join(__dirname, 'models', 'FriendsModel'));
const userService = new UserService(UserModel, FriendsModel);
app.use(session(sessionConfig));

// Create tables in database and add admin admin
database.sync({ force: true })
  .then(() => userService.cryptPassword('adminadmin'))
  .then((hash) => {
    UserModel.create({
      email: 'admin@example.com',
      name: 'admin',
      hash_password: hash,
    })
  });

// Setup controllers
app.use('/api', api(userService));
app.use(swagger);

// Connect react application
app.get('/', (_req, res) => {
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
});

module.exports = app;