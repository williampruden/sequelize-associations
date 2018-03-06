'use strict';
module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    paranoid: true
  });

  Project.associate = function(models) {
    Project.hasMany(models.User, {
      foreignKey: {
        name: 'projectId',
        allowNull: false
      },
      as: 'users'
    });
  };

  return Project;
};
