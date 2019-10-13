const express = require('express');
const log = require('debug')('api');

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello world!
 *     description: Welcome the world!
 *     responses:
 *       200:
 *         description: Welcome world string
 *         schema:
 *           type: string
 */
router.get('/', (req, res) => {
  res.send('Hello world!');
});

function UserInfo(login) {
  this.login = login;
}
/**
 * @swagger
 * /session/create:
 *   post:
 *     summary: Create session
 */
router.post('/session/create', (req, res) => {
  res.send(req.session.sessionID);
});

/**
 * @swagger
 * /session/userinfo:
 *   post:
 *     summary: Get user information from session
 */
router.post('/session/userinfo', (req, res) => {
  if (req.session.login) {
    return res.send(new UserInfo(req.session.login));
  }
  res.send();
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login
 */
router.post('/login', (req, res) => {
  if (req.body.login === undefined || req.body.password === undefined) {
    return res.status(400).send('Bad request!');
  }
  // check login and password in db
  if (req.body.login === 'admin' && req.body.password === 'admin') {
    req.session.login = req.body.login;
    log(`User ${req.session.login} logged in`, req.sessionID);
    return res.send();
  }
  res.status(403).send('Bad login or password!');
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout
 */
router.post('/logout', (req, res, next) => {
  const name = req.session.login;
  const id = req.sessionID;
  req.session.destroy((err) => {
    if (err) {
      log(`User ${name} failed to logout ${id}`);
      return next(err);
    }
    log(`User ${name} logged out`, id);
    res.send();
  });
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register
 */
router.post('/register', (req, res) => {
  if (req.body.login === undefined || req.body.password === undefined) {
    return res.status(400).send();
  }

  // TODO: add user to database  
});

module.exports = router;
