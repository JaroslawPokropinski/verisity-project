const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friends extends Sequelize.Model { }
  Friends.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'friends_relations',
  });

  Friends.associate = function(models) {
    // user -> sender
    // friend -> receiver
    models['friends_relations'].hasMany(models['message'], { });
  }

  return Friends;
};
