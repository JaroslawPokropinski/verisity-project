const ExpressPeerServer = require('peer').ExpressPeerServer;
const http = require('http');
const https = require('https');

const options = {
  port: process.env.PORT || 9000,
  expire_timeout: 5000,
  alive_timeout: 60000,
  key: 'peerjs',
  path: '/myapp',
  concurrent_limit: 5000,
  allow_discovery: false,
  proxied: false,
  cleanup_out_msgs: 1000,
  ssl: {
    key: '',
    cert: '',
  },
};

/**
 * @typedef {import('http').Server} Server
 * @typedef {import('express').Application} Application
 */

/**
 * Starts peerjs server on existing express server.
 *
 * @param {Application} app - A express app
 * @return {Server} A http(s) server
 */

const peerStartup = (app) => {
  let server;
  if (options.ssl && options.ssl.key && options.ssl.cert) {
    server = https.createServer(options.ssl, app);
    delete options.ssl;
  } else {
    server = http.createServer(app);
  }
  // eslint-disable-next-line new-cap
  const peerjs = ExpressPeerServer(server, options);
  app.use(peerjs);
  server.listen(options.port);
  return server;
};

module.exports = peerStartup;
