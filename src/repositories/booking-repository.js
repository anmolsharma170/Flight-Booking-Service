const {StatusCodes} = require('http-status-codes');
const {Booking} = require('../models');
const CrudRepository = require('./crud-repository');
class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }
    // we have to create a booking we wont be using create booking crud operation because we need to pass a transaction object than that we will be using here 

    async createBooking(data,transaction){
        const response = await Booking.create(data, {transaction:transaction});
        return response;
    }
}


module.exports={
    BookingRepository
}