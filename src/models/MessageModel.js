const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Sequelize.Model { }
  Message.init({
    content: {
      type: DataTypes.STRING(500), // (max length)
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    modelName: 'message'
  });

  Message.associate = function(models) {
      models['message'].belongsTo(models['friends_relations'], { });
  }

  return Message;
};
