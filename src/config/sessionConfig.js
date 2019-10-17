const getStore = (session, database) => {
  const DBStore = require('connect-session-sequelize')(session.Store);
  const store = new DBStore({ db: database });
  return {
    resave: false,
    saveUninitialized: true,
    store,
    secret: process.env.COOKIE_SECRET || 'shhhh! its a secret1',
  };
}

module.exports = getStore;
