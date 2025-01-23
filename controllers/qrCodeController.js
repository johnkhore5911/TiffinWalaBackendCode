// const QRCodeModel = require('../models/QRCode'); // Import the QRCode model
// const User = require('../models/User');      // Assuming you have User model
// const QRCode = require('qrcode');
// const mongoose = require('mongoose');

// // Handle QR code scan

// const scanQRCode = async (req, res) => {
//     const { qrCode } = req.body;  // The scanned QR code from the frontend

    // try {
    //     const qr = await QRCodeModel.findOne({ code: qrCode });
    //     if (!qr) {
    //         return res.status(404).json({ message: 'QR code not found!' });
    //     }

    //     // Optionally, track the scan by adding the user to the `scannedBy` array
    //     const userId = req.user.id; // Assuming you have user authentication set up
    //     qr.scannedBy.push(userId);
    //     await qr.save();

    //     res.status(200).json({ message: 'QR code scanned successfully', qr });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Server error' });
    // }
// };


// // Generate and save QR code to database
// const generateQRCode = async (req, res) => {
//     try {
//         // Extract the expiration date and any other parameters from the request body (admin provides these)
//         const { validDate } = req.body;

//         // Generate the static QR code content (this could be a URL or any data)
//         const qrData = 'http://192.168.18.235:4000/api/qrCodeRoutes/scan-qr';

//         // Generate QR code image data as a string (you can save it as an image file too)
//         QRCode.toDataURL(qrData, async (err, url) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error generating QR code' });
//             }

//             // Create a new QRCode document in the database
//             const qrCode = new QRCodeModel({
//                 code: url,           // Save the QR code image URL
//                 validDate: new Date(validDate), // Expiration date
//             });

//             // Save the QR code in the database
//             await qrCode.save();

//             // Send the saved QR code data back to the client
//             res.status(201).json({
//                 message: 'QR code generated successfully',
//                 qrCode: qrCode,
//             });
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };



// module.exports = { scanQRCode,generateQRCode };



// controllers/QRCodeController.js

const QRCode = require('qrcode');
const QRCodeModel = require('../models/QRCode'); // QRCode model

// Controller to generate a new QR code for admin
// const generateQRCode = async (req, res) => {
//     const { validDate } = req.body;  // Extract expiration date

//     try {
//         // Validate the input
//         if (!validDate) {
//             return res.status(400).json({ message: 'Valid date is required' });
//         }

//         // Generate QR Code (static URL for simplicity, it could be dynamic)
//         const qrData = 'http://192.168.18.235:4000/api/qrCodeRoutes/scan-qr'; // Static URL to scan

//         // Generate the QR code image (base64 URL)
//         QRCode.toDataURL(qrData, async (err, url) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error generating QR code' });
//             }

//             // Create a new QR code entry in the database
//             const qrCode = new QRCodeModel({
//                 code: url,           // Save the QR code image URL
//                 validDate: new Date(validDate),  // Expiration date from request
//             });

//             // Save the QR code to the database
//             await qrCode.save();

//             // Respond with the saved QR code details
//             res.status(201).json({
//                 message: 'QR code generated successfully',
//                 qrCode: qrCode,
//             });
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


// Controller to handle QR code scan
// const scanQRCode = async (req, res) => {
//     const { qrCodeUrl } = req.body;  // Scanned QR code URL from the request

//     try {
//         // Validate the input
//         if (!qrCodeUrl) {
//             return res.status(400).json({ message: 'QR code URL is required' });
//         }

//         // Find the QR code in the database by URL
//         const qrCode = await QRCodeModel.findOne({ code: qrCodeUrl });

//         if (!qrCode) {
//             return res.status(404).json({ message: 'QR code not found!' });
//         }

//         // Check if the QR code has expired
//         const currentDate = new Date();
//         if (currentDate > qrCode.validDate) {
//             return res.status(400).json({ message: 'QR code has expired!' });
//         }

//         // For now, just return a message saying "Hello World" (success)
//         res.status(200).json({ message: 'Hello World' });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


// const generateQRCode = async (req, res) => {
//     const { validDate } = req.body;  // Expiration date for the QR code

//     try {
//         // Validate the input
//         if (!validDate) {
//             return res.status(400).json({ message: 'Valid date is required' });
//         }

//         // Static URL for QR Code scanning (you can change this to any valid URL)
//         const qrData = 'http://192.168.18.235:4000/api/qrCodeRoutes/scan-qr';

//         // Create the QR Code as a string (URL, not Base64 image)
//         QRCode.toDataURL(qrData, async (err, url) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error generating QR code' });
//             }

//             // Create a new QR Code entry in the database with the URL (not the Base64 string)
//             const qrCode = new QRCodeModel({
//                 code: qrData,  // Store the static URL, not the Base64 image
//                 validDate: new Date(validDate),  // Expiration date from request
//             });

//             // Save the QR code to the database
//             await qrCode.save();

//             // Respond with the saved QR code details
//             res.status(201).json({
//                 message: 'QR code generated successfully',
//                 qrCode: qrCode,
//             });
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const scanQRCode = async (req, res) => {
//     // const { qrCodeUrl } = req.body;  // Scanned QR code URL from the request
//     console.log("Hello ji")
//     // console.log("qrCodeUrl: ",qrCodeUrl);
//     const qrCodeUrl="http://192.168.18.235:4000/api/qrCodeRoutes/scan-qr"

//     try {
        // // Validate the input
        // if (!qrCodeUrl) {
        //     return res.status(400).json({ message: 'QR code URL is required' });
        // }

        // // Find the QR code in the database by URL
        // const qrCode = await QRCodeModel.findOne({ code: qrCodeUrl });

        // if (!qrCode) {
        //     return res.status(404).json({ message: 'QR code not found!' });
        // }

//         // Check if the QR code has expired
//         const currentDate = new Date();
//         if (currentDate > qrCode.validDate) {
//             return res.status(400).json({ message: 'QR code has expired!' });
//         }

//         // Return "Hello World" as plain HTML
//         res.status(200).send('<h1>Hello World</h1>');  // Sending HTML response to display in browser

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


// API to handle QR code scan


// const generateQRCode = async (req, res) => {
//     const { validDate } = req.body; // Expiration date for the QR code

//     try {
//         // Validate the input
//         if (!validDate) {
//             return res.status(400).json({ message: 'Valid date is required' });
//         }

//         // Static URL for QR Code scanning (you can change this to any valid URL)
//         const qrData = 'http://192.168.18.235:4000/api/qrCodeRoutes/scan-qr';

//         // Generate QR Code as a Base64 URL
//         const url = await QRCode.toDataURL(qrData); // Using async/await instead of callback

//         // Create a new QR Code entry in the database with the URL (not the Base64 string)
//         const qrCode = new QRCodeModel({
//             code: qrData, // Store the static URL, not the Base64 image
//             validDate: new Date(validDate), // Expiration date from request
//         });

//         // Save the QR code to the database
//         await qrCode.save();

//         // Respond with the saved QR code details
//         res.status(201).json({
//             success:true,
//             message: 'QR code generated successfully',
//             qrCode: qrCode,
//             qrCodeImage: url, // You can also return the Base64 URL for displaying the QR code
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const generateQRCode = async (req, res) => {
  const { validDate } = req.body; // Expiration date for the QR code

  try {
      // Validate the input
      if (!validDate) {
          return res.status(400).json({ message: 'Valid date is required' });
      }

      // Static URL for QR Code scanning (you can change this to any valid URL)
      // const qrData = 'http://192.168.18.235:4000/api/qrCodeRoutes/scan-qr';
      const qrData = 'https://tiffin-wala-backend.vercel.app/api/qrCodeRoutes/scan-qr';
      

      // Check if QR Code already exists in the database
      let qrCode = await QRCodeModel.findOne({ code: qrData }); // You can also check by validDate if needed

      // If the QR code exists, update it; else, create a new one
      if (qrCode) {
          qrCode.validDate = new Date(validDate); // Update the expiration date
          await qrCode.save();
          return res.status(200).json({
              success: true,
              message: 'QR code updated successfully',
              qrCode: qrCode,
          });
      } else {
          // Generate QR Code as a Base64 URL
          const url = await QRCode.toDataURL(qrData); // Using async/await instead of callback

          // Create a new QR Code entry in the database with the URL (not the Base64 string)
          qrCode = new QRCodeModel({
              code: qrData, // Store the static URL, not the Base64 image
              validDate: new Date(validDate), // Expiration date from request
          });

          // Save the QR code to the database
          await qrCode.save();

          // Respond with the saved QR code details
          return res.status(201).json({
              success: true,
              message: 'QR code generated successfully',
              qrCode: qrCode,
              qrCodeImage: url, // You can also return the Base64 URL for displaying the QR code
          });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};


// const scanQRCode = async(req, res) => {
//     const userId = req.user.id;
//     const qrCode = req.query.qrCode;
//     console.log("ScanQR code!",qrCode);
//     console.log("userId code!",userId);

// }


const Credit = require('../models/Credit');
const MealPlan = require('../models/MealPlan');

// const scanQRCode = async (req, res) => {
//   try {
    

//     const userId = req.user.id;
//     const qrCode = req.query.qrCode; // Assuming qrCode is passed as a query parameter

//     console.log("ScanQR code!", qrCode);
//     console.log("userId code!", userId);


//     // Find the user's credits
//     const creditRecord = await Credit.findOne({ user: userId }).populate('mealPlan');
//     if (!creditRecord) {
//       return res.status(404).json({ success: false, message: "Credits not found for user" });
//     }

//     console.log("Working 2");
//     console.log("creditRecord: ",creditRecord);

//     // Check if a meal plan is associated
//     if (!creditRecord.mealPlan) {
//       return res.status(400).json({ success: false, message: "No meal plan associated with user" });
//     }


//     const mealPlan = creditRecord.mealPlan;

//     // Validate meal plan's validity (e.g., ensure the plan has not expired)
//     const planValidityInMs = mealPlan.validity * 24 * 60 * 60 * 1000; // Convert days to milliseconds
//     const planExpirationDate = new Date(creditRecord.createdAt).getTime() + planValidityInMs;
//     const currentDate = new Date().getTime();


//     if (currentDate > planExpirationDate) {
//       return res.status(400).json({ success: false, message: "Meal plan has expired" });
//     }

//     // Check if user has available credits
//     if (creditRecord.availableCredits <= 0) {
//       return res.status(400).json({ success: false, message: "No available credits remaining" });
//     }

//     // Update credits: decrement available credits and increment used credits
//     creditRecord.availableCredits -= 1;
//     creditRecord.usedCredits += 1;
//     await creditRecord.save();

//     // Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "Meal successfully redeemed using QR code",
//       remainingCredits: creditRecord.availableCredits,
//     });

//   } catch (error) {
//     console.error("Error in scanQRCode:", error);
//     res.status(500).json({ success: false, message: "An error occurred while scanning the QR code" });
//   }
// };


// const scanQRCode = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const qrCodeUrl = req.query.qrCode; // Assuming qrCode is passed as a query parameter

//     // Validate the input
//     if (!qrCodeUrl) {
//         return res.status(400).json({ message: 'QR code URL is required' });
//     }

//     // Find the QR code in the database by URL
//     const qrCode = await QRCodeModel.findOne({ code: qrCodeUrl });
//     if (!qrCode) {
//         return res.status(404).json({ message: 'QR code not found!' });
//     }

//     // console.log("Scan QR code!", qrCode);
//     console.log("User ID:", userId);

//     // Find the user's credits and associated meal plan
//     const creditRecord = await Credit.findOne({ user: userId }).populate('mealPlan');
//     if (!creditRecord) {
//       return res.status(404).json({ success: false, message: "Credits not found for user" });
//     }

//     console.log("Credit Record: ", creditRecord);

//     // Check if a meal plan is associated
//     if (!creditRecord.mealPlan) {
//       return res.status(400).json({ success: false, message: "No meal plan associated with user" });
//     }

//     const mealPlan = creditRecord.mealPlan;

//     // Validate meal plan's validity (e.g., ensure the plan has not expired)
//     const planValidityInMs = mealPlan.validity * 24 * 60 * 60 * 1000; // Convert days to milliseconds
//     const planExpirationDate = new Date(creditRecord.mealPlanExpiryDate).getTime(); // Use the actual expiration date
//     const currentDate = new Date().getTime();

//     // Check if the meal plan has expired
//     if (currentDate > planExpirationDate) {
//       return res.status(400).json({ success: false, message: "Meal plan has expired" });
//     }

//     // Check if user has available credits
//     if (creditRecord.availableCredits <= 0) {
//       return res.status(400).json({ success: false, message: "No available credits remaining" });
//     }

//     // If QR code matches with the meal plan, proceed with redeeming the meal
//     // You can add more validation for QR code here, if required.
//     // if (qrCode !== mealPlan.qrCode) {
//     //   return res.status(400).json({ success: false, message: "Invalid QR code" });
//     // }

//     // Update credits: decrement available credits and increment used credits
//     creditRecord.availableCredits -= 1;
//     creditRecord.usedCredits += 1;
//     await creditRecord.save();

//     qrCode.scannedBy.push(userId);
//     await qrCode.save();

//     // Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "Meal successfully redeemed using QR code",
//       remainingCredits: creditRecord.availableCredits,
//     });

//   } catch (error) {
//     console.error("Error in scanQRCode:", error);
//     return res.status(500).json({ success: false, message: "An error occurred while scanning the QR code" });
//   }
// };


const scanQRCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const qrCodeUrl = req.query.qrCode; // Assuming qrCode is passed as a query parameter

    // Validate the input
    if (!qrCodeUrl) {
        return res.status(400).json({ message: 'QR code URL is required' });
    }

    // Find the QR code in the database by URL
    const qrCode = await QRCodeModel.findOne({ code: qrCodeUrl });
    if (!qrCode) {
        return res.status(404).json({ message: 'QR code not found!' });
    }

    console.log("User ID:", userId);

    // Find the user's credits and associated meal plan
    const creditRecord = await Credit.findOne({ user: userId }).populate('mealPlan');
    if (!creditRecord) {
      return res.status(404).json({ success: false, message: "Credits not found for user" });
    }

    console.log("Credit Record: ", creditRecord);

    // Check if a meal plan is associated
    if (!creditRecord.mealPlan) {
      return res.status(400).json({ success: false, message: "No meal plan associated with user" });
    }

    const mealPlan = creditRecord.mealPlan;

    // Validate meal plan's validity (e.g., ensure the plan has not expired)
    const planValidityInMs = mealPlan.validity * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const planExpirationDate = new Date(creditRecord.mealPlanExpiryDate).getTime(); // Use the actual expiration date
    const currentDate = new Date().getTime();

    // Check if the meal plan has expired
    if (currentDate > planExpirationDate) {
      return res.status(400).json({ success: false, message: "Meal plan has expired" });
    }

    // Check if user has available credits
    if (creditRecord.availableCredits <= 0) {
      return res.status(400).json({ success: false, message: "No available credits remaining" });
    }

    
    // Update credits: decrement available credits and increment used credits
    creditRecord.availableCredits -= 1;
    creditRecord.usedCredits += 1;
    await creditRecord.save();
    await qrCode.save();
    
    // Add the user to the scannedBy array
    // Check if the user has already scanned this QR code
    if (qrCode.scannedBy.includes(userId)) {
      // return res.status(400).json({ success: false, message: "You have already scanned this QR code" });
        await qrCode.save();
    }
    else{
      qrCode.scannedBy.push(userId);
      await qrCode.save();
    }
    

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Meal successfully redeemed using QR code",
      remainingCredits: creditRecord.availableCredits,
    });

  } catch (error) {
    console.error("Error in scanQRCode:", error);
    return res.status(500).json({ success: false, message: "An error occurred while scanning the QR code" });
  }
};



// router.get('/scanned/:qrCode', async (req, res) => {
// const getScannedCustomers = async (req, res) => {
//   const { qrCode } = req.body;  // The QR code passed as a URL parameter

//   try {
//       // Find the QR code by its unique code
//       const qr = await QRCodeModel.findOne({ code: qrCode }).populate('scannedBy', 'name email');  // Populate user details

//       if (!qr) {
//           return res.status(404).json({ message: 'QR code not found' });
//       }

//       // Return the list of users who scanned the QR code
//       res.status(200).json({
//           success: true,
//           message: 'Users who scanned the QR code',
//           scannedBy: qr.scannedBy,
//       });
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server error' });
//   }
// };


// const getScannedCustomers = async (req, res) => {
//   const { qrCode } = req.body;  // The QR code passed as a request body parameter

//   try {
//       // Find the QR code by its unique code
//       const qr = await QRCodeModel.findOne({ code: qrCode })
//         .populate({
//           path: 'scannedBy', 
//           select: 'name email', // Select user name and email
//           populate: {
//             path: 'credits',  // Populate the associated Credit record
//             select: 'availableCredits usedCredits',  // Select credits info
//             populate: {
//               path: 'mealPlan',  // Populate meal plan details
//               select: 'name',  // Select meal plan name
//             }
//           }
//         });

//       if (!qr) {
//           return res.status(404).json({ message: 'QR code not found' });
//       }

//       // Get the details of each user who scanned the QR code
//       const scannedUsersDetails = await Promise.all(qr.scannedBy.map(async (user) => {
//           // Find the user's credit record
//           const creditRecord = await Credit.findOne({ user: user._id })
//             .populate('mealPlan', 'name');  // Populate meal plan details

//           return {
//               user: {
//                   name: user.name,
//                   email: user.email,
//               },
//               credits: {
//                   usedCredits: creditRecord ? creditRecord.usedCredits : 0,
//                   remainingCredits: creditRecord ? creditRecord.availableCredits : 0,
//               },
//               mealPlan: creditRecord && creditRecord.mealPlan ? creditRecord.mealPlan.name : null,
//           };
//       }));

//       // Return the scanned users with their details
//       res.status(200).json({
//           success: true,
//           message: 'Users who scanned the QR code',
//           scannedUsers: scannedUsersDetails,
//       });

//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server error' });
//   }
// };


const getScannedCustomers = async (req, res) => {
  const { qrCode } = req.body;  // The QR code passed as a request body parameter

  try {
      // Find the QR code by its unique code
      const qr = await QRCodeModel.findOne({ code: qrCode })
        .populate({
          path: 'scannedBy', 
          select: 'name email', // Select user name and email
        });

      if (!qr) {
          return res.status(404).json({ message: 'QR code not found' });
      }

      // Get the details of each user who scanned the QR code
      const scannedUsersDetails = await Promise.all(qr.scannedBy.map(async (user) => {
          // Find the user's credit record
          const creditRecord = await Credit.findOne({ user: user._id })
            .populate('mealPlan', 'name');  // Populate meal plan details

          return {
              user: {
                  name: user.name,
                  email: user.email,
              },
              credits: {
                  usedCredits: creditRecord ? creditRecord.usedCredits : 0,
                  remainingCredits: creditRecord ? creditRecord.availableCredits : 0,
                  updatedAt: creditRecord ? creditRecord.updatedAt : 0
              },
              mealPlan: creditRecord && creditRecord.mealPlan ? creditRecord.mealPlan.name : null,
          };
      }));

      // Return the scanned users with their details
      res.status(200).json({
          success: true,
          message: 'Users who scanned the QR code',
          scannedUsers: scannedUsersDetails,
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { generateQRCode, scanQRCode,getScannedCustomers };
