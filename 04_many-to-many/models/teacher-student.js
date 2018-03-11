'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeacherStudent = sequelize.define('TeacherStudent', {
    teacherId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER
  }, {
    paranoid: true
  });

  return TeacherStudent;
};
