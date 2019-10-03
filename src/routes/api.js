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

router.post('/session', (req, res) => {
  if (req.session.login) {
    res.send({});
  } else {
    res.status(403).send();
  }
});

router.post('/login', (req, res) => {
  if (req.body.login === undefined || req.body.password === undefined) {
    return res.status(400).send();
  }
  // check login and password in db
  if (req.body.login === 'admin' && req.body.password === 'admin') {
    req.session.login = req.body.login;
    log(`User ${req.session.login} logged in`, req.sessionID);
    return res.send();
  }
  res.status(403).send();
});

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

router.post('/register', (req, res) => {
  if (req.body.login === undefined || req.body.password === undefined) {
    return res.status(400).send();
  }

  // TODO: add user to database  
});

module.exports = router;
