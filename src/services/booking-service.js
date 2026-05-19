const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');
// const {StatusCodes} = require('http-status-codes');
const {ServerConfig} = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const bookingRepository = new BookingRepository();
async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightdata = flight.data.data;
            if(data.noOfSeats > flightdata.total_seats){
                throw new AppError('Required number of seats not available',StatusCodes.BAD_REQUEST);
            }
            const totalBillingAmount = data.noOfSeats * flightdata.price;
            const bookingpayload = {...data, totalCost: totalBillingAmount}; //booking payload is just like a object that we are going to send
            // we will be passsing the same payload in order to make booking
            const booking  =  await bookingRepository.create(bookingpayload,transaction);
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{seats: Number(data.noOfSeats), dec: true});



            await transaction.commit();
            return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
    

module.exports = {
    createBooking
}