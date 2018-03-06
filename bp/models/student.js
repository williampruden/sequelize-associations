'use strict';
module.exports = (sequelize, DataTypes) => {
  var Student = sequelize.define('Student', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Student.associate = function(models) {

  };

  return Student;
};

// NEEDS MIGRATION FILE
