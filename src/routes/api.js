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
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }

  router.post('/login', celebrate(loginSchema), (req, res) => {
    const { email, password } = req.body;
    // check login and password in db
    userService
      .getUser(email, password)
      .then((userInfo) => {
        req.session.userInfo = userInfo;
        log(`User ${email} logged in`, req.sessionID);
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
      email: Joi.string().email().required(),
      name: Joi.string().min(3).required(),
      password: Joi.string().min(8).required()
    }
  }

  router.post('/register', celebrate(registerSchema), (req, res) => {
    const { email, name, password } = req.body;
    // add user to database  
    userService.addUser(email, name, password)
      .then((user) => res.send(user))
      .catch((error) => res.status(400).send(error));
  });

  // get friends list
  /**
   * @swagger
   * /friends:
   *   get:
   *     summary: Get list of friends for authenticated user, if not authenticated - response.code = 401
   */
  router.get('/friends', (req, res) => {
    if (req.session.userInfo) {
      const user = req.session.userInfo.name;
      userService.getFriendsList(user)
        .then((friendsList) => res.send(friendsList))
        .catch((error) => res.status(500).send(error));
    } else {
      res.status(401).send();
    }

  });

  const addFriendSchema = {
    body: {
      username: Joi.string().required()
    }
  }

  // invite friend
  /**
   * @swagger
   * /friends:
   *   post:
   *     summary: Invite new friend, if not authenticated - response.code = 401
   */
  router.post('/friends', celebrate(addFriendSchema), (req, res) => {
    if (req.session.userInfo) {
      const { username } = req.body;
      const user = req.session.userInfo.name;
      userService.inviteFriend(user, username)
        .then((result) => res.send(result))
        .catch((error) => res.status(400).send(error));
    } else {
      res.status(401).send();
    }
  });

  // get pending invitations
  /**
   * @swagger
   * /friends/invitations:
   *   get:
   *     summary: Get pending invitations for authenticated user, if not authenticated - response.code = 401
   */
  router.get('/friends/invitations', (req, res) => {
    if (req.session.userInfo) {
      const user = req.session.userInfo.name;
      userService.getPendingInvitations(user)
        .then((invitations) => res.send(invitations))
        .catch((error) => res.status(500).send(error));
    } else {
      res.status(401).send();
    }
  })

  // accept invitation
  /**
   * @swagger
   * /friends/invitations:
   *   post:
   *     summary: Accept pending invitation, if not authenticated - response.code = 401
   */
  router.post('/friends/invitations', celebrate(addFriendSchema), (req, res) => {
    if (req.session.userInfo) {
      const { username } = req.body;
      const user = req.session.userInfo.name;
      userService.acceptInvitation(user, username)
        .then((result) => res.send(result))
        .catch((error) => res.status(400).send(error));
    } else {
      res.status(401).send();
    }
  })

  // get all messages between users
  /**
   * @swagger
   * /friends/:name:
   *   get:
   *     summary: Get messages sent and recieved from user(:name param), if not authenticated - response.code = 401
   */
  router.get('/friends/:name', (req, res) => {
    if (req.session.userInfo) {
      const username = req.params.name;
      const user = req.session.userInfo.name;
      userService.getConversation(user, username)
        .then((messages) => res.send(messages))
        .catch((error) => res.status(400).send(error));
    } else {
      res.status(401).send();
    }
  })

  const sendMessageSchema = {
    body: {
      message: Joi.string().min(1).max(500).required()
    }
  }

  // send message
  /**
   * @swagger
   * /friends/:name:
   *   post:
   *     summary: Send message to user, which name is specified in :name param, if not authenticated - response.code = 401
   */
  router.post('/friends/:name', celebrate(sendMessageSchema), (req, res) => {
    if (req.session.userInfo) {
      const username = req.params.name;
      const user = req.session.userInfo.name;
      const { message } = req.body;
      userService.sendMessage(user, username, message)
        .then((result) => res.send(result))
        .catch((error) => res.status(400).send(error));
    } else {
      res.status(401).send();
    }
  })

  const peerSchema = {
    body: {
      id: Joi.string().required(),
    }
  }

  router.post('/peer', celebrate(peerSchema), (req, res) => {
    if (req.session.userInfo) {
      userService.setPeerId(req.session.userInfo.email, req.body.id);
      res.send();
    } else {
      res.status(401).send();
    }
  });

  router.get('/peer', (req, res) => {
    if (req.session.userInfo) {
      if (!req.query.email) {
        return res.status(400).send();
      }

      const id = userService.getPeerId(req.query.email);
      if (id) {
        res.send(id);
      } else {
        res.status(404).send('User is not connected!');
      }
    } else {
      res.status(401).send();
    }
  });


  router.use(errors());
  return router;
}
