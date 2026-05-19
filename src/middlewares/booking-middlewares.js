const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');

function validateCreateBooking(req, res, next) {
    if(!req.body.flightId) {
        ErrorResponse.message = 'Something went wrong while creating booking';
        ErrorResponse.error = { explanation: 'flightId not found in the incoming request' };
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.userId) {
        ErrorResponse.message = 'Something went wrong while creating booking';
        ErrorResponse.error = { explanation: 'userId not found in the incoming request' };
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.noOfSeats) {
        ErrorResponse.message = 'Something went wrong while creating booking';
        ErrorResponse.error = { explanation: 'noOfSeats not found in the incoming request' };
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

function validateMakePayment(req, res, next) {
    if(!req.body.bookingId) {
        ErrorResponse.message = 'Something went wrong while making payment';
        ErrorResponse.error = { explanation: 'bookingId not found in the incoming request' };
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.userId) {
        ErrorResponse.message = 'Something went wrong while making payment';
        ErrorResponse.error = { explanation: 'userId not found in the incoming request' };
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.totalCost) {
        ErrorResponse.message = 'Something went wrong while making payment';
        ErrorResponse.error = { explanation: 'totalCost not found in the incoming request' };
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateCreateBooking,
    validateMakePayment
}