'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
  paranoid: true
});

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: true
      },
      as: 'projects'
    });
  };

  return Project;
};
