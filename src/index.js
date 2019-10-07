const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const log = require('debug')('app');

const api = require('./routes/api');
const getDbConfig = require('./dbConfig');
const peerStartup = require('./peerStartup');
const corsConfig = require('./corsConfig');

const app = express();
app.use(cors(corsConfig));
app.use(bodyParser.json());
const dbConfig = getDbConfig(session);
app.use(session({
  ...dbConfig,
  secret: process.env.COOKIE_SECRET || 'shhhh! its a secret1',
}));

if (process.env.NODE_ENV === 'production') {
  dbConfig.store.sync();
}

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/', (_req, res) => {
  res.redirect('/app');
});

app.get('/app/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use('/api', api);

if (process.env.NODE_ENV !== 'production') {
  const swaggerSpec = require('./docs/swaggerConfig');

  app.get('/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.get('/docs', (_req, res) => {
    res.sendFile(path.join(__dirname, 'docs/redoc.html'));
  });
}
app.server = peerStartup(app);
app.server.on('connection', (client) => {
  log(`${client.id} connected!`);
});

app.server.on('disconnect', (client) => {
  log(`${client.id} disconnected!`);
});

module.exports = app;