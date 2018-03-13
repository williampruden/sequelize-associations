'use strict';
module.exports = (sequelize, DataTypes) => {
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
      }
    }
  }, {
    paranoid: true
  });

  User.associate = (models) => {
    User.hasOne(models.Passport, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'passport'
    });
  };

  return User;
};
