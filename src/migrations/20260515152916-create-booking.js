'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums} = require('../utils/common');
// deconstructing enums in the next line
const {BOOKED,CANCELLED,INITIATED,PENDING} = Enums.BOOKING_STATUS;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(BOOKED,CANCELLED,INITIATED,PENDING),
        allowNull: false 
      },
      noOfSeats: {
        type: Sequelize.INTEGER,  //no of seats requested by a user for booking
        allowNull: false,
        defaultValue:1
        
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};