const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');
// const {StatusCodes} = require('http-status-codes');
const {ServerConfig} = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const bookingRepository = new BookingRepository();
const {Enums} = require('../utils/common');
const {BOOKED, CANCELLED} = Enums.BOOKING_STATUS;
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
            const booking  =  await bookingRepository.create    (bookingpayload,transaction);
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{seats: Number(data.noOfSeats), dec: true}); // here we are sending the number of seats that we want to decrease from the flight service and we are also sending dec as true because we want to decrease the number of seats
            await transaction.commit();
            return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
// because we are not implementing any payment integration so we will use a simple api
async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction);
        if(bookingDetails.status==CANCELLED) throw new AppError('The booking has been expired',StatusCodes.BAD_REQUEST);
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime-bookingTime>300000){  //5mins check if payment will not be done in 5 minutes it will automatically canceled
            await bookingRepository.update(data.bookingId,{status: CANCELLED}, transaction);
            throw new AppError('The booking has been expired',StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.totalCost!=data.totalCost){
            throw new AppError('The amount of payment doesnot match',StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId){
            throw new AppError('The user corresponding to the booking doesnot match',StatusCodes.BAD_REQUEST);
        }
        // here we will assume that payment is successful
        const response = await bookingRepository.update(data.bookingId,{status: BOOKED}, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment
}