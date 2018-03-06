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
    bio: {
      type: DataTypes.TEXT,
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
    User.hasMany(models.Task, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tasks',
      onDelete: 'CASCADE'
    });
    
  };

  return User;
};
