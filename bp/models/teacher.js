'use strict';
module.exports = (sequelize, DataTypes) => {
  var Teacher = sequelize.define('Teacher', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Teacher.associate = function(models) {

  };

  return Teacher;
};

// NEEDS MIGRATION FILE
