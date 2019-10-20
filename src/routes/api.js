const { Router: getRouter } = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const log = require('debug')('api');

module.exports = (userService) => {
  const router = getRouter();
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
    if (req.session.userInfo) {
      return res.send(req.session.userInfo);
    }
    res.send();
  });

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login
   */
  const loginSchema = {
    body: {
      login: Joi.string().required(),
      password: Joi.string().required()
    }
  }

  router.post('/login', celebrate(loginSchema), (req, res) => {
    const { login, password } = req.body;
    // check login and password in db
    userService
      .getUser(login, password)
      .then((userInfo) => {
        req.session.userInfo = userInfo;
        log(`User ${login} logged in`, req.sessionID);
        res.send();
      })
      .catch((err) => {
        log(err);
        res.status(403).send(err);
      })
  });

  /**
   * @swagger
   * /logout:
   *   post:
   *     summary: Logout
   */
  router.post('/logout', (req, res, next) => {
    const name = req.session.userInfo.login;
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
  const registerSchema = {
    body: {
      login: Joi.string().min(3).required(),
      password: Joi.string().min(8).required()
    }
  }

  router.post('/register', celebrate(registerSchema), (req, res) => {
    const { login, password } = req.body;
    // add user to database  
    userService.addUser(login, password)
      .then((user) => res.send(user))
      .catch((error) => res.status(400).send(error));
  });

  router.use(errors());
  return router;
}
