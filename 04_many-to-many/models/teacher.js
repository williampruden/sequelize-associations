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
    Teacher.belongsToMany(models.Student, {
      through: "TeacherStudent",
      foreignKey: 'teacherId',
      as: 'students'
    });
  };

  return Teacher;
};
