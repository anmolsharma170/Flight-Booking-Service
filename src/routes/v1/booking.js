const express = require('express');
const {BookingController} = require('../../controllers');
const { BookingMiddlewares } = require('../../middlewares');

const router = express.Router();

router.post('/', 
    BookingMiddlewares.validateCreateBooking,
    BookingController.createBooking
);

router.post('/payments', 
    BookingMiddlewares.validateMakePayment,
    BookingController.makePayment
);

module.exports = router;