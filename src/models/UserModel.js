const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Sequelize.Model { }
  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hash_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'user'
  });
  
  User.associate = function(models) {
    models['user'].belongsToMany(models['user'], {
      as: 'user',
      through: models['friends_relations'],
      foreignKey: 'friend',
      otherKey: 'user'
    });
    
    models['user'].belongsToMany(models['user'], {
      as: 'friend',
      through: models['friends_relations'],
      foreignKey: 'user',
      otherKey: 'friend'
    });
  }

  return User;
};
