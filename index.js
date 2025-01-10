

const express = require('express');
const app = express();
require("dotenv").config();
const stripe = require("stripe")("sk_test_51QcLAFSEdSgPvqXOiNJlXGZM9YmI3dBMLg85xbbtKyV1j62itxlMetUKcYGA5wsmXPRVpbi6S1bE6QObt7qSsaNH00GbFCtPEF");
const admin = require('firebase-admin');  // Import firebase-admin
const mongoose = require("mongoose");


// Firebase Admin SDK initialization
// const serviceAccount = require('./tiffinwala-5f83f-firebase-adminsdk-qk18s-8ca085eb2d.json'); // Make sure to replace this with your actual service account path
// const serviceAccount = {
//   "type": "service_account",
//   "project_id": "tiffinwala-5f83f",
//   "private_key_id": "8ca085eb2d9f0f84741e9763a3f5e5de290198d7",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTq8IcF9QWJVhn\nJPakYRJT99JFPsEyz4OtJDg3c8lyXa6/WbyVr7DysuuZJklCNbeXLKKjWJsJgXFq\nW3bHbD3ejVoduiiHdi6P/8j41h9NjRJRGGrKbhJ/8/9D1XECbA3BGY9gDn/5KeQr\nuFD3wBqU0pXXav3FdcBxch0582xQsSlJXO5CPE0QnThClG7TM2AwLcdfUsIZkDQ/\nCnHGIxKWE23es4zcAA/RO5mQKUdanrP6zauQloRvbsSch+rwvKsb2z3TWtXzyrU5\nvfC8J9hll20GyEFitoTQzKN5BAPHVDjXYdcl/edawHBe2ocUukmRVAiHItRkz35f\n4MaBES3TAgMBAAECggEAAxK50T2ZUy78nxa+y/kq0nRFJcM4+9tebouZk1iHgrUQ\nfe+4GLZBy+xEFmejZaYxAa1guR1mttcdxe0JBvEv3sTPm6Hhx8G0AFw210IIl1Am\nhW3k0waRFzF8MchuCRp3gqez2LGtMvlkOixFZKtx11pNWaDQiWbhwePlv7skhfFd\nwmzq9JyRHVZqNMm6dNmbGEhIgCyWkdoh2zWrBv3Yi1Ho9LjdJr86tEQl1zms9nGd\nwY3l61LICziJsUCtIx7UKi0dq/gSOOM3ckcA6rYFooJ9kKjt5udPv6TUMgWpnQ7C\n74LGTpl/SlcJMm1VS81yRX3lv4vaUgBRZKJq4emtTQKBgQD2SGa9tETGVu/1UDvE\n+ahISIdIx3Dbip5FKOeONK3TggZS8hWzHgR3MbLxplmdJ1rZJuIbViNZPwzEkzDR\ne1hTO9tzAY/rCUY/GgUDx9ZTI7URJ9rm2Nq0awWOQM56Tu95AeqfhrviaIHowxgo\nVcDFZrERSC3UK+IB6eUnNzJMnwKBgQDcBcHB1UJC0PEM0DHay6upwmt/JJIyT8x6\n5l+hVtbmySImuhV6EL9XpipTVONjrWRbHkVMXlBc0/FKwQBcXzRgNtOTGoFIBKGy\nqVq0zMjim9jsCmFMDgnqPP70KqkOlxlIb/pLBwdlca+FMmsjYltLrtQjHbPK2v4P\npLa9vJqeTQKBgQCH6abBVCWMK1gbUh7Z8kj7MwNtl5rhnVsAobU/1jSDf8MLrUtq\nYMtoGAY/s2TLBHfvVLT9DwlM7C2Yof4T7PTuYh8WFaudsq2Qj0RrNLJDiXYYNJ1q\nPgxb+p/DRGJuPveLGRKo3Mr9BF2E3X2MbN6IUcav2dxotZrxIWnzvVNF0wKBgBQ7\nC0fRXhhase9lrU/a7lvbnprAOBkcMUcTq7NgEr6Bu/wnnBXvOEjM5JNo+MePh+zA\n6cpN2cHPUx52hJv5vQ0jvWyHQV/n3R5aaBa7xbTgc5+wjKW7nLnHBgJZcdX/mrmI\nYlFHwixXubXbnvJP9ukMmEDqWD/MxxOVJ6BmmSj5AoGBAPUECm/SF33wviY+phcj\nIFmIFnpIpBL02ulGoEdIrIi5Nvr2afz3j6UJI8wP3PvfWO35N3fCafYIeHWX4xa5\nNZyu4ULvFV5E6lYCWhcg5PMyZlV14JN0RztzFWk6Zw30kcXb+wQBTeuP++YhoYVe\ns5vuDz0OO4pG3mNpuHUIY+wR\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-qk18s@tiffinwala-5f83f.iam.gserviceaccount.com",
//   "client_id": "108407133472340441449",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qk18s%40tiffinwala-5f83f.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }


const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Ensure your serviceAccount is set up correctly
});
module.exports = admin;

// Middleware to parse JSON request body
app.use(express.json());

const cors = require('cors');
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const userRoutes = require("./routes/userRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/mealPlanRoutes", mealPlanRoutes);
app.use("/api/qrCodeRoutes", qrCodeRoutes);
app.use("/api/userRoutes", userRoutes);
app.use("/api/deliveryRoutes", deliveryRoutes);

// Default route
app.get("/", (req, res) => {
  res.send(`<h1>This is HOMEPAGE</h1>`);
});

// Connect to the database
// const connect = require('./config/database');
// connect();

const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('MongoDB Connected');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); // Exit process with failure
    }
};
connect();




// Endpoint to create a payment intent with Stripe
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Get the amount from the body

  if (!amount) {
    return res.status(400).send({ error: 'Amount is required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',  // Specify the currency
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


const User = require("./models/User");

const sendMealNotification = async (req, res) => {
  // Fetch all user tokens from your database
  const {message} = req.body;
  try {
    // Assuming you have a User model that stores the FCM tokens
    const users = await User.find(); // Modify as needed based on your DB schema

    // Get an array of all user FCM tokens
    const tokens = users.map(user => user.fcmToken).filter(token => token); // Ensure no null tokens
    console.log("All tokens!",tokens);
    // Notification payload
    const payload = {
      notification: {
        title: 'Meal Notification',
        body: message,
      },
    };

    // Send notification to each user
    const promises = tokens.map(token => {
      return admin.messaging().send({
        token: token,
        notification: payload.notification,
      });
    });

    // Wait for all notifications to be sent
    const responses = await Promise.all(promises);

    // Log the successful responses
    console.log('Successfully sent messages:', responses);

    return res.status(200).json({
      success: true,
      message: "Notifications sent successfully!",
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return res.status(500).json({
      success: false,
      message: "Error sending notifications",
    });
  }
};

app.post('/send-meal-notification', sendMealNotification);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is started at port ${process.env.PORT} successfully`);
});
