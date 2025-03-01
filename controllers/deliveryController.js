const mongoose = require('mongoose');
const Delivery = require('../models/Delivery'); // Assuming your schema is in models/Delivery
const User = require('../models/User'); // Assuming your user model is in models/User
const Credit = require("../models/Credit");


const admin = require('../index');

const assignDelivery = async (req, res) => {
    console.log("Assign delivery hit");

    try {
        // Extracting the array of customer assignments from the request body
        const customerAssignments = req.body; // Array of objects with {customerId, deliveryPersonId, status, date}

        // Check if any customer assignments are provided
        if (customerAssignments.length === 0) {
            return res.status(400).json({ message: 'No customer assignments provided' });
        }

        // Initialize an array to store all the delivery assignments
        const savedDeliveries = [];

        // Initialize an object to group FCM tokens by delivery persons
        const deliveryNotifications = {};

        for (const assignment of customerAssignments) {
            const { customerId, deliveryPersonId, status = 'Pending', date } = assignment;

            // Check if the customer exists
            const customer = await User.findById(customerId);
            if (!customer) {
                return res.status(404).json({ message: `Customer with ID ${customerId} not found` });
            }

            // Check if the delivery person exists
            const deliveryPerson = await User.findById(deliveryPersonId);
            if (!deliveryPerson) {
                return res.status(404).json({ message: `Delivery person with ID ${deliveryPersonId} not found` });
            }

            // Create a new delivery document
            const newDelivery = new Delivery({
                customer: customerId,
                deliveryPerson: deliveryPersonId,
                status: status, // Default status is 'Pending', can be passed from request
                date: date, // Delivery time
            });

            // Save the delivery document to the database
            const savedDelivery = await newDelivery.save();

            // Add the saved delivery to the array
            savedDeliveries.push(savedDelivery);

            // Group FCM tokens for notifications
            if (deliveryPerson.fcmToken) {
                console.log("!23",deliveryPerson.fcmToken);
                if (!deliveryNotifications[deliveryPersonId]) {
                    deliveryNotifications[deliveryPersonId] = {
                        fcmToken: deliveryPerson.fcmToken,
                        assignments: [],
                    };
                }
                deliveryNotifications[deliveryPersonId].assignments.push({
                    customerName: customer.name,
                    date,
                });
            }
        }

        // Send notifications to delivery persons
        const notificationPromises = Object.values(deliveryNotifications).map(async ({ fcmToken, assignments }) => {
            const message = {
                notification: {
                    title: 'New Delivery Assignments',
                    body: `You have ${assignments.length} new delivery assignments.`,
                },
                token: fcmToken,
            };

            try {
                const response = await admin.messaging().send(message);
                console.log('Notification sent successfully:', response);
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        });

        await Promise.all(notificationPromises);

        // Respond with the saved deliveries
        res.status(201).json({
            message: 'Deliveries assigned successfully and notifications sent.',
            deliveries: savedDeliveries,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



const getAllDeliveries = async (req, res) => {
    try {
        // Fetch all deliveries, populate deliveryPerson and customer
        const deliveries = await Delivery.find()
            .populate('customer', 'name email') // Populating customer details like name and email
            .populate('deliveryPerson', 'name email') // Populating delivery person's name and email
            .exec();

        // Organize the data into a structured format by deliveryPerson
        const deliveryPersonList = deliveries.reduce((acc, delivery) => {
            // If the delivery person already exists in the accumulator, add the new delivery
            if (!acc[delivery.deliveryPerson._id]) {
                acc[delivery.deliveryPerson._id] = {
                    deliveryPerson: delivery.deliveryPerson,
                    deliveries: [],
                };
            }

            // Push the customer and delivery details to this delivery person's entry
            acc[delivery.deliveryPerson._id].deliveries.push({
                customer: delivery.customer,
                status: delivery.status,
                collectionStatus: delivery.collectionStatus,
                date: delivery.date,
                feedback: delivery.feedback || 'No Feedback',
            });

            return acc;
        }, {});

        // Convert the accumulator into an array of objects for response
        const structuredResponse = Object.values(deliveryPersonList);

        res.status(200).json({
            message: 'Deliveries fetched successfully',
            deliveryPersons: structuredResponse,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteDelivery = async (req, res) => {
    console.log("!2345")
    try {
      const { deliveryId, customerId } = req.params;
  
      if (!deliveryId || !customerId) {
        return res.status(400).json({ message: 'Delivery ID and Customer ID are required.' });
      }
  
      const delivery = await Delivery.findOneAndDelete({
        deliveryPerson: deliveryId,
        customer: customerId,
      });
  
      if (!delivery) {
        return res.status(404).json({ message: 'Delivery not found.' });
      }
  
      res.status(200).json({ message: 'Delivery deleted successfully.' });
    } catch (error) {
      console.error('Error deleting delivery:', error);
      res.status(500).json({ message: 'Server error while deleting delivery.' });
    }
};


const notifyCustomerTiffin = async (req, res) => {
    try {
        // Extract deliveryId from the request
        const { deliveryId } = req.body;

        // Fetch the delivery record from the database
        const delivery = await Delivery.findById(deliveryId).populate('customer');

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Delivery not found',
            });
        }

        // Extract the FCM token from the customer
        const customer = delivery.customer;
        const fcmToken = customer.fcmToken;

        if (!fcmToken) {
            return res.status(404).json({
                success: false,
                message: 'FCM Token not found for customer',
            });
        }

        // Fetch the customer's credit record
        const credit = await Credit.findOne({ user: customer._id });

        if (!credit) {
            return res.status(404).json({
                success: false,
                message: 'Credit record not found for customer',
            });
        }

        // Check if the customer has sufficient credits
        if (credit.availableCredits <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient credits to deduct',
            });
        }

        // Deduct one credit
        credit.availableCredits -= 1;

        // Save the updated credit record
        await credit.save();


        // Create the notification message
        const message = {
            notification: {
                title: 'Tiffin Delivery Status',
                body: `Your tiffin delivery status is ${delivery.status}`,
            },
            data: {
                deliveryId: delivery._id.toString(),  // Include deliveryId in the data payload
            },
            token: fcmToken, // Send notification to the customer's device
        };

        // Send notification via FCM
        await admin.messaging().send(message);

        const user = await User.findById(credit.user);
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User not found!',
            });
        }
        // user.showTiffinModal=true;
        
        // Push the delivery ID into the showTiffinModal array
        user.showTiffinModal.push(delivery._id.toString());
        await user.save();


        // **Update `deliveryUserResponse` to `true`**
        delivery.deliveryUserResponse = true;
        await delivery.save();  // Save the updated delivery document


        // Respond back with success
        res.status(200).json({
            success: true,
            message: 'Notification sent successfully to customer',
        });
    } catch (error) {
        // Handle any errors during the operation
        console.error('Error notifyCustomerTiffin', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending the notification',
        });
    }
};


const getNotCollectedDeliveriesByUserId = async (req, res) => {
    const deliveryPersonId = req.user.id; // Get deliveryPersonId from the request parameters

    try {
        // Validate deliveryPersonId
        if (!deliveryPersonId) {
            return res.status(400).json({ success: false, message: 'Delivery person ID is required.' });
        }

        // Find deliveries with the given deliveryPersonId and collectionStatus "Not Collected"
        const deliveries = await Delivery.find({
            deliveryPerson: deliveryPersonId,
            collectionStatus: 'Not Collected',
            status: { $ne: 'Pending' }
        }).populate('customer', 'name address'); // Populate customer details if needed

        // Check if deliveries are found
        if (deliveries.length === 0) {
            return res.status(200).json({ success: true, message: 'No pending deliveries found for this user.' });
        }

        // Respond with the found deliveries
        res.status(200).json({ success: true, deliveries });
    } catch (error) {
        console.error('Error fetching deliveries:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching deliveries.', error });
    }
};


const updateDeliveryCollectionStatus = async(req,res)=>{
    try{
        const {deliveryId,status} = req.body;
        console.log("deliveryId: ",deliveryId);
        console.log("status: ",status);
        if(!deliveryId && !status){
            return res.status(500).json({
                success: false,
                message: 'All fields are required!',
            });
        }
        const delivery = await Delivery.findById(deliveryId);
        delivery.collectionStatus = status;
        delivery.save();
        res.status(200).json({
            success:true,
            message:"Status updated Successfully!"
        })

    }
    catch(error){
        console.error('Error while updating the delivery Status:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the delivery Status',
        });
    }
}

const adminReportMissedTiffins = async(req,res)=>{
    try {
        // Query the Delivery collection to find all deliveries with status 'Missed'
        const missedDeliveries = await Delivery.find({  
            $or: [
            { status: 'Missed' },
            { collectionStatus: 'Not Found' }
        ] })
            .populate('customer', 'name contact')  // Optionally populate customer details
            .populate('deliveryPerson', 'name contact'); // Optionally populate deliveryPerson details
        
        // Check if there are any missed deliveries
        if (missedDeliveries.length === 0) {
            return res.status(404).json({ message: 'No missed deliveries found' });
        }
        
        // Send the missed deliveries as a response
        return res.status(200).json(missedDeliveries);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}


module.exports = { assignDelivery,getAllDeliveries,deleteDelivery,notifyCustomerTiffin, getNotCollectedDeliveriesByUserId,updateDeliveryCollectionStatus,adminReportMissedTiffins };
