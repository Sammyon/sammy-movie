'use strict';
const fs = require('fs')

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
    //  let data =  JSON.parse(fs.readFileSync('./data/movies.json'))
    //  data.forEach(el => {
    //    el.createdAt = new Date()
    //    el.updatedAt = new Date()
    //  })
    //  await queryInterface.bulkInsert("Movies", data)
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
