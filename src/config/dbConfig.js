const Sequelize = require('sequelize');
const path = require('path');
const log = require('debug')('database');

const getDatabase = () => {
  if (process.env.NODE_ENV === 'production') {
    return getProdDatabase();
  }
  return getDevdatabase();
}

const getProdDatabase = () => {
  return new Sequelize(
    `${process.env.DATABASE_URL}?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory`
  );
}

const getDevdatabase = () => {
  log(`Connect to ${path.join(__dirname, '..', 'database.sqlite')}`)
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: null,
  });
  sequelize
    .authenticate()
    .then(() => {
      log('Connection has been established successfully.');
    })
    .catch(err => {
      log('Unable to connect to the database:', err);
    });
  return sequelize;
}

module.exports = getDatabase;
