'use strict';
module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName : 'Erlich',
      lastName : 'Bachman',
      email : 'bachmanity.insanity@yahoo.com',
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', [{
      firstName :'Erlich'
    }])
  }
};
