const {BookingService} =  require('../services');
const {StatusCodes} = require('http-status-codes');
const {SuccessResponse, ErrorResponse} = require('../utils/common');
const inMemDb = {};
async function createBooking(req,res){
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats || req.body.seats
        });
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function makePayment(req,res){
    try {
        const idempotencykey = req.headers['x-idempotency-key'];
        if(!idempotencykey){
            return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: 'Idempotency key is missing'});
        
        }
        if(inMemDb[idempotencykey]){
            return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: 'cannot retry on a successful payment'});
        }
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        inMemDb[idempotencykey]=idempotencykey;
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}
module.exports = {
    createBooking,
    makePayment
}