'use strict';
module.exports = function(sequelize, DataTypes) {
  const Passport = sequelize.define('Passport', {
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passportNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Passport.associate = (models) => {
    Passport.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'passport'
    });
  };

  return Passport;
};
