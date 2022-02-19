'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let data = [{
      username: "Adit",
      email: "adit@email.com",
      password: "secure",
      role: "user",
      phoneNumber: "test",
      address: "test",
      createdAt : new Date(),
      updatedAt : new Date(),
    }]
     await queryInterface.bulkInsert("Users", data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
