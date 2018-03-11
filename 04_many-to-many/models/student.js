'use strict';
module.exports = function(sequelize, DataTypes) {
  const Student = sequelize.define('Student', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gradeLevel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gpa: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Student.associate = (models) => {
    Student.belongsToMany(models.Teacher, {
      through: "TeacherStudent",
      foreignKey: 'studentId',
      as: 'teachers'
    });
  };

  return Student;
};
