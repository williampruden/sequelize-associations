'use strict';
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    }
  }, {
    paranoid: true
  });

  User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tasks'
    });
  };

  return User;
};
