const express = require("express");
const dotenv = require("dotenv");
const { connectDb } = require("./config/database");
const fs = require('fs');
const https = require('https');
const userRouter = require("./routes/user.Routes");
const cors = require('cors');
const Stripe = require('stripe');
require('dotenv').config();



const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Iinitialized Database Configuration
connectDb();

//Allows the Frontend and backend Origins to communicate
app.use(cors());

app.use(express.json());

// Import The User Route
app.use("/api/v1/user", userRouter);

// Import The payment routes
app.post('/api/v1/payments/create-payment-intent', async (req, res) => {
  const { totalPrice } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Convert to cents
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// Root Entry Home of the Api
app.get("/", (req, res) => {
  res.send("Welcome to Nodejs Authentication Tutorial a real  the stripe api is here");
});

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem'),
};


// Start the server with HTTPS
https.createServer(options, app).listen(4000, () => {
  console.log('Server is running on https://localhost:4000');
});
