const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const api = require('./routes/api');
const getDbConfig = require('./dbConfig');
const peerStartup = require('./peerStartup');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  ...getDbConfig(session),
  secret: process.env.COOKIE_SECRET || 'shhhh! its a secret1',
}));

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('/', (_req, res) => {
  res.redirect('/app');
});

app.get('/app/*', (_req, res) => {
  res.sendFile(path.join(__dirname + '/react/dist/index.html'));
});

app.use('/api', api);
app.server = peerStartup(app);

module.exports = app;