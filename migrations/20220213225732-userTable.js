'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.createTable("users", {
     id: {
       allowNull: false,
      //  autoIncrement: true,
       primaryKey: true,
       type: Sequelize.UUID,
       defaultValue: Sequelize.UUIDV4,
     },
    
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    amount: {
      type: Sequelize.NUMBER,
      allowNull: false
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    }
   });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("users");
  }
};
