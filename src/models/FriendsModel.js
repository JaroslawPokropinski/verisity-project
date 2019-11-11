const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friends extends Sequelize.Model { }
  Friends.init({
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'friends_relations',
  });

  return Friends;
};
