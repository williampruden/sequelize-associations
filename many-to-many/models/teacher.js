'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
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
    },
    numberOfClasses: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
  paranoid: true
});

  Teacher.associate = (models) => {


  };

  return Teacher;
};
