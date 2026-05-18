const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');
// const {StatusCodes} = require('http-status-codes');
const {ServerConfig} = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
async function createBooking(data){
    return new Promise((resolve,reject)=>{
        
        const result = db.sequelize.transaction(async function bookingImpl(t){
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightdata = flight.data.data;
            if(data.noOfSeats > flightdata.total_seats){
                reject(new AppError('Required number of seats not available',StatusCodes.BAD_REQUEST));
            }
            resolve(true);
        });
    })
    }
    

module.exports = {
    createBooking
}