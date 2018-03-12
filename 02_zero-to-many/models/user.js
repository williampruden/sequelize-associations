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
      }
    }
  }, {
  paranoid: true
});

  User.associate = (models) => {
    User.hasMany(models.Project, {
      foreignKey: {
        name: 'userId',
        allowNull: true
      },
      as: 'projects'
    });
  };

  return User;
};
