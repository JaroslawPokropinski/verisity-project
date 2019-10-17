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
const database = getDatabase();
const sessionConfig = getSessionConfig(session, database);

// TODO: pass user model
const userService = new UserService(null);

app.use(cors(corsConfig));
app.use(bodyParser.json());

app.use(session(sessionConfig));
sessionConfig.store.sync();

// Connect react application
app.get('/', (_req, res) => {
  res.redirect('/app/');
});
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(['/app', '/app/*'], (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
//
app.use('/api', api(userService));
app.use(swagger);

app.server = peerStartup(app);
app.server.on('connection', (client) => {
  log(`${client.id} connected!`);
});

app.server.on('disconnect', (client) => {
  log(`${client.id} disconnected!`);
});

module.exports = app;