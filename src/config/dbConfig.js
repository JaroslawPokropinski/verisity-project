const Sequelize = require('sequelize');
const path = require('path');
const log = require('debug')('database');
const fs = require('fs')
const models_dir = path.join(__dirname, '..', 'models');



const getDatabase = () => {
  let sequelize = null;
  if (process.env.NODE_ENV === 'production') {
    sequelize = getProdDatabase();
  } else {
    sequelize = getDevdatabase();
  }

  // Initialize models and create associations
  fs
    .readdirSync(models_dir)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      var model = sequelize['import'](path.join(models_dir, file));
      sequelize['models'][model.name] = model;
    });

  Object.keys(sequelize['models']).forEach(modelName => {
    if(sequelize['models'][modelName].associate) {
      sequelize['models'][modelName].associate(sequelize['models']);
    }
  });

  return sequelize
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
