

// const express = require('express');
// const app = express();
// require("dotenv").config();
// const stripe = require("stripe")("sk_test_51QcLAFSEdSgPvqXOiNJlXGZM9YmI3dBMLg85xbbtKyV1j62itxlMetUKcYGA5wsmXPRVpbi6S1bE6QObt7qSsaNH00GbFCtPEF");
// const admin = require('firebase-admin');  // Import firebase-admin
// const mongoose = require("mongoose");


// const serviceAccount = {
//   type: process.env.FIREBASE_TYPE,
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//   private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   client_id: process.env.FIREBASE_CLIENT_ID,
//   auth_uri: process.env.FIREBASE_AUTH_URI,
//   token_uri: process.env.FIREBASE_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//   client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
//   universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount), // Ensure your serviceAccount is set up correctly
// });
// module.exports = admin;

// // Middleware to parse JSON request body
// app.use(express.json());

// const cors = require('cors');
// app.use(cors());

// const authRoutes = require('./routes/authRoutes');
// const mealPlanRoutes = require("./routes/mealPlanRoutes");
// const qrCodeRoutes = require("./routes/qrCodeRoutes");
// const userRoutes = require("./routes/userRoutes");
// const deliveryRoutes = require("./routes/deliveryRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/mealPlanRoutes", mealPlanRoutes);
// app.use("/api/qrCodeRoutes", qrCodeRoutes);
// app.use("/api/userRoutes", userRoutes);
// app.use("/api/deliveryRoutes", deliveryRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.send(`<h1>This is HOMEPAGE</h1>`);
// });

// // Connect to the database
// // const connect = require('./config/database');
// // connect();

// const connect = async () => {
//     try {
//       await mongoose.connect(process.env.MONGODB_URL);
//       console.log('MongoDB Connected');
//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//       process.exit(1); // Exit process with failure
//     }
// };
// connect();




// // Endpoint to create a payment intent with Stripe
// app.post('/create-payment-intent', async (req, res) => {
//   const { amount } = req.body; // Get the amount from the body

//   if (!amount) {
//     return res.status(400).send({ error: 'Amount is required' });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'inr',  // Specify the currency
//       payment_method_types: ['card'],
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });


// const User = require("./models/User");

// const sendMealNotification = async (req, res) => {
//   // Fetch all user tokens from your database
//   const {message} = req.body;
//   try {
//     // Assuming you have a User model that stores the FCM tokens
//     const users = await User.find(); // Modify as needed based on your DB schema

//     // Get an array of all user FCM tokens
//     const tokens = users.map(user => user.fcmToken).filter(token => token); // Ensure no null tokens
//     console.log("All tokens!",tokens);
//     // Notification payload
//     const payload = {
//       notification: {
//         title: 'Meal Notification',
//         body: message,
//       },
//     };

//     // Send notification to each user
//     const promises = tokens.map(token => {
//       return admin.messaging().send({
//         token: token,
//         notification: payload.notification,
//       });
//     });

//     // Wait for all notifications to be sent
//     const responses = await Promise.all(promises);

//     // Log the successful responses
//     console.log('Successfully sent messages:', responses);

//     return res.status(200).json({
//       success: true,
//       message: "Notifications sent successfully!",
//     });
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error sending notifications",
//     });
//   }
// };

// app.post('/send-meal-notification', sendMealNotification);

// // Start the server
// app.listen(process.env.PORT, () => {
//   console.log(`Server is started at port ${process.env.PORT} successfully`);
// });


const express = require('express');
const app = express();
require("dotenv").config();
const stripe = require("stripe")("sk_test_51QcLAFSEdSgPvqXOiNJlXGZM9YmI3dBMLg85xbbtKyV1j62itxlMetUKcYGA5wsmXPRVpbi6S1bE6QObt7qSsaNH00GbFCtPEF");
const admin = require('firebase-admin');  // Import firebase-admin
const mongoose = require("mongoose");

// Firebase Admin Configuration
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
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;

// Middleware to parse JSON request body
app.use(express.json());

// Enable CORS
const cors = require('cors');
app.use(cors());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const userRoutes = require("./routes/userRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const billRoutes = require("./routes/billRoutes");


// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/mealPlanRoutes", mealPlanRoutes);
app.use("/api/qrCodeRoutes", qrCodeRoutes);
app.use("/api/userRoutes", userRoutes);
app.use("/api/deliveryRoutes", deliveryRoutes);
app.use("/api/billRoutes", billRoutes);

//payment
app.use("/api/payments", paymentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send(`<h1>This is HOMEPAGE</h1>`);
});

// Connect to the database
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

// Stripe Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).send({ error: 'Amount is required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Notification Endpoint
const User = require("./models/User");

// const sendMealNotification = async (req, res) => {
//   console.log("I am being called to notfiy!")
//   const { message } = req.body;
//   try {
//     const users = await User.find({role: 'customer'});
//     const tokens = users.map(user => user.fcmToken).filter(token => token);

//     const payload = {
//       notification: {
//         title: 'Meal Notification',
//         body: message,
//       },
//     };
//     console.log("tokens: ",tokens);

//     const promises = tokens.map(token => {
//       return admin.messaging().send({
//         token: token,
//         notification: payload.notification,
//       });
//     });


//     const responses = await Promise.all(promises);
//     console.log('Successfully sent messages:', responses);

//     return res.status(200).json({
//       success: true,
//       message: "Notifications sent successfully!",
//     });
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error sending notifications",
//     });
//   }
// };


const sendMealNotification = async (req, res) => {
  console.log("I am being called to notify!");
  const { message } = req.body;
  try {
    const users = await User.find({ role: 'customer' });
    let tokens = users.map(user => user.fcmToken).filter(token => token);

    const payload = {
      notification: {
        title: 'Meal Notification',
        body: message,
      },
    };
    console.log("Tokens before filtering:", tokens);

    const validTokens = [];
    const promises = tokens.map(async (token) => {
      try {
        await admin.messaging().send({
          token: token,
          notification: payload.notification,
        });
        validTokens.push(token); // Only keep valid tokens
      } catch (error) {
        if (error.code === 'messaging/registration-token-not-registered') {
          console.warn(`Invalid token removed: ${token}`);
        } else {
          console.error(`FCM error: ${error.message}`);
        }
      }
    });

    await Promise.all(promises);

    console.log("Valid tokens:", validTokens);

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


// const sendMealNotification = async (req, res) => {
//   const { message } = req.body;
//   try {
//     // Fetch only customers (excluding delivery personnel)
//     const users = await User.find({ role: 'customer' });

//     const tokens = users.map(user => user.fcmToken).filter(token => token);

//     if (tokens.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No customers found with valid FCM tokens.",
//       });
//     }

//     const payload = {
//       notification: {
//         title: 'Meal Notification',
//         body: message,
//       },
//     };

//     const promises = tokens.map(token => {
//       return admin.messaging().send({
//         token: token,
//         notification: payload.notification,
//       });
//     });

//     const responses = await Promise.all(promises);
//     console.log('Successfully sent messages:', responses);

//     return res.status(200).json({
//       success: true,
//       message: "Notifications sent successfully!",
//     });
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error sending notifications",
//     });
//   }
// };


app.post('/send-meal-notification', sendMealNotification);




const sendNotificationToUser = async (req, res) => {
  console.log("Send Notification to User");
  const { fcmToken, message } = req.body;
  console.log("FCM Token:", fcmToken);
  console.log("Message:", message);

  try {
    if (!fcmToken || !message) {
      return res.status(400).json({
        success: false,
        message: "FCM token and message are required",
      });
    }

    const payload = {
      notification: {
        title: 'Meal Notification',
        body: message,
      },
    };

    // Send the message to the specific user using their FCM token
    const response = await admin.messaging().send({
      token: fcmToken,
      notification: payload.notification,
    });

    console.log('Successfully sent message:', response);

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully!",
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({
      success: false,
      message: "Error sending notification",
    });
  }

};

app.post('/send-notification-to-user', sendNotificationToUser);



app.listen(process.env.PORT, () => {
  console.log(`Server is started at port ${process.env.PORT} successfully`);
});

// Export the app for Vercel
module.exports = app; // <--- Add this to make it work on Vercel
