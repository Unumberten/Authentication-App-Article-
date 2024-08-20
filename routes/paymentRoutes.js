// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('./controllers/paymentController');

// Define the route for creating payment intent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
