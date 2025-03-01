const Credit = require("../models/Credit");
const MealPlan = require("../models/MealPlan");
const User = require("../models/User");
const Delivery = require('../models/Delivery'); 
const admin = require('../index');

const mongoose = require('mongoose');

const getUserData = async (req, res) => {
    try {
        // Extract the user ID from the request
        const userId  = req.user.id;
        console.log("i got id in getUserData controller!");

        // Validate user ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        // Find the credit details for the user
        const creditDetails = await Credit.findOne({ user: userId })
            .populate("mealPlan", "name description price credits") // Populate meal plan details
            .populate("user", "name email showTiffinModal contact"); // Populate user details

        // If no credit details are found
        if (!creditDetails) {
            return res.status(404).json({
                success: false,
                message: "No meal credits found for this user.",
            });
        }
        // Send the credit details in the response
        return res.status(200).json({
            success: true,
            data: {
                user: {
                    name: creditDetails.user.name,
                    email: creditDetails.user.email,
                    showTiffinModal:creditDetails.user.showTiffinModal,
                    phoneNumber:creditDetails.user.contact
                },
                mealPlan: creditDetails.mealPlan
                    ? {
                          name: creditDetails.mealPlan.name,
                          description: creditDetails.mealPlan.description,
                          price: creditDetails.mealPlan.price,
                          planCredits:creditDetails.mealPlan.credits
                      }
                    : null,
                credits: {
                    available: creditDetails.availableCredits,
                    used: creditDetails.usedCredits,
                    lowCreditThreshold: creditDetails.lowCreditThreshold,
                },
                createdAt: creditDetails.createdAt,
            },
        });
    } catch (error) {
        console.error("Error fetching meal credits:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching meal credits. Please try again.",
        });
    }
};


const getUserMealPlan = async (req, res) => {
    try {
        const userId = req.user.id; 

        // Find the credit document for the given user ID
        const credit = await Credit.findOne({ user: userId }).populate("mealPlan", "name description price credits validity");

        if (!credit) {
            return res.status(404).json({ message: "No credit record found for this user." });
        }

        // Extract meal plan details
        const mealPlanDetails = credit.mealPlan;
        
        res.status(200).json({
            userId: userId,
            mealPlan: mealPlanDetails ? mealPlanDetails : null,
            validity: credit.mealPlanValidity,
            mealPlanExpiryDate: credit.mealPlanExpiryDate,
        });
    } catch (error) {
        console.error("Error fetching user meal plan details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updatePlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { mealPlanId } = req.body;

        console.log("Request Body: ", req.body);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        if (!mealPlanId) {
            return res.status(400).json({
                success: false,
                message: "Meal Plan ID is required.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Meal Plan ID.",
            });
        }

        // Fetch current credit details of the user
        const creditDetails = await Credit.findOne({ user: userId });
        if (!creditDetails) {
            return res.status(404).json({
                success: false,
                message: "No meal credits found for this user.",
            });
        }

        // Fetch the new meal plan details
        const newMealPlan = await MealPlan.findById(mealPlanId);
        if (!newMealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal Plan not found.",
            });
        }

        // Update meal plan details
        creditDetails.mealPlan = mealPlanId;
        creditDetails.availableCredits = newMealPlan.credits; // Reset available credits to plan credits
        creditDetails.usedCredits = 0; // Reset used credits to zero

        // Set meal plan validity and calculate the expiry date
        creditDetails.mealPlanValidity = newMealPlan.validity;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + newMealPlan.validity);
        creditDetails.mealPlanExpiryDate = expiryDate;

        // Save the updated credit details
        await creditDetails.save();

        console.log("Updated Credit Details: ", creditDetails);

        return res.status(200).json({
            success: true,
            message: "Meal Plan updated successfully.",
        });
    } catch (error) {
        console.error("Error updating Meal Plan:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the Meal Plan. Please try again.",
        });
    }
};



const getAllCustomers = async (req, res) => {
    try {
      // Fetch all users with their credit details and meal plan
      const customers = await User.aggregate([
        {
          $lookup: {
            from: 'credits', // Join with the Credit collection
            localField: '_id',
            foreignField: 'user',
            as: 'creditDetails',
          },
        },
        {
          $unwind: {
            path: '$creditDetails',
            preserveNullAndEmptyArrays: true, // If no credits found, still return user
          },
        },
        {
          $lookup: {
            from: 'mealplans', // Join with the MealPlan collection
            localField: 'creditDetails.mealPlan',
            foreignField: '_id',
            as: 'mealPlanDetails',
          },
        },
        {
          $unwind: {
            path: '$mealPlanDetails',
            preserveNullAndEmptyArrays: true, // If no meal plan, still return user
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            availableCredits: '$creditDetails.availableCredits',
            usedCredits: '$creditDetails.usedCredits',
            mealPlanName: '$mealPlanDetails.name',
            mealPlanDescription: '$mealPlanDetails.description',
            mealPlanCredits: '$mealPlanDetails.credits',
            mealPlanExpiryDate: '$creditDetails.mealPlanExpiryDate',
          },
        },
      ]);
  
      res.status(200).json(customers);  // Return the data as a JSON response
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Error fetching customers' });
    }
};



const getTiffinSystemCustomers = async (req, res) => {
    try {
        // Step 1: Get all users with role "customer"
        const customers = await User.find({ role: 'customer' }).select('_id');

        if (customers.length === 0) {
            return res.status(404).json({ message: 'No customers found' });
        }

        // Step 2: Filter customers who have a Tiffin System meal plan
        const customerIds = customers.map(customer => customer._id);
        
        // Find credits of those customers and join with MealPlan to check meal name
        const credits = await Credit.find({ user: { $in: customerIds } })
            .populate({
                path: 'mealPlan',
                match: { type: 'Tiffin System' }  // Only include meal plans with name 'Tiffin System'
            });

        // Step 3: Filter out customers who don't have 'Tiffin System' meal plan
        const filteredCredits = credits.filter(credit => credit.mealPlan  && credit.availableCredits >= 1); // Ensure the mealPlan exists and matches

        if (filteredCredits.length === 0) {
            return res.status(404).json({ message: 'No customers found with Tiffin System meal plan' });
        }

        // Step 4: Retrieve complete details of customers and include remaining credits
        const result = await Promise.all(
            filteredCredits.map(async (credit) => {
                const user = await User.findById(credit.user); // Get the user details
                return {
                    ...user.toObject(), // Convert Mongoose document to plain object
                    remainingCredits: credit.availableCredits, // Add remaining credits
                };
            })
        );

        res.status(200).json({ customers: result });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};




const getDeliverUserData = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in `req.user`
        console.log("Fetching deliveries with 'Pending' status for userId:", userId);


        const user = await User.findById(userId).select('name email contact');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find deliveries where deliveryPerson matches userId and status is "Pending"
        const pendingDeliveries = await Delivery.find({ 
                deliveryPerson: userId, 
                // status: { $eq: "Pending" } // Ensures only "Pending" status is fetched
            })
            .populate('customer', 'name address fcmToken latitude longitude contact') // Populate `customer` with relevant fields
            .select('status collectionStatus date customer deliveryUserResponse'); // Select only required fields

        if (!pendingDeliveries.length) {
            return res.status(200).json({
                success: true,
                message: "No pending deliveries found for the specified delivery person",
                user: {
                    name: user.name,
                    contact: user.contact,
                }
            });
        }

        // Send response with the filtered data
        res.status(200).json({
            success: true,
            message: "Successfully fetched pending deliveries",
            deliveries: pendingDeliveries,
            user: {
                name: user.name,
                contact: user.contact,
            }
        });
    } catch (error) {
        console.error("Error fetching pending deliveries:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching pending deliveries",
        });
    }
};








const getDeliveryUsers = async (req, res) => {
    try {
        // Fetch users with role 'delivery'
        const deliveryUsers = await User.find({ role: 'delivery' });

        // Send the response with the fetched users
        res.status(200).json({
            success: true,
            message: 'Delivery users retrieved successfully',
            data: deliveryUsers,
        });
    } catch (error) {
        // Handle any errors during the operation
        console.error('Error fetching delivery users:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching delivery users',
        });
    }
};




const updateDeliveryStatus = async (req, res) => {
    try {
        const { deliveryId, status } = req.body;

        // Check if both deliveryId and status are provided
        if (!deliveryId || !status) {
            return res.status(500).json({
                success: false,
                message: 'All fields are required!',
            });
        }

        // Find the delivery object
        const delivery = await Delivery.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Delivery not found!',
            });
        }

        // Update the delivery status
        delivery.status = status;
        await delivery.save();  // Make sure to await the save operation here


        // Send a successful response
        res.status(200).json({
            success: true,
            message: "Status updated successfully!",
        });

    } catch (error) {
        console.error('Error while updating the delivery Status:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the delivery Status',
        });
    }
};





const refundCredits = async(req,res)=>{
    const { deliveryId } = req.body;

    try {
        // Step 1: Fetch the delivery
        const delivery = await Delivery.findById(deliveryId).populate('customer');
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // if (delivery.status !== 'Missed') {
        //     return res.status(400).json({ message: 'Refund not allowed for non-missed deliveries' });
        // }

        if (delivery.isRefunded) {
            return res.status(400).json({ message: 'Refund already processed for this delivery' });
        }

        const customerId = delivery.customer._id;

        // Step 2: Update credits
        const credit = await Credit.findOne({ user: customerId });
        if (!credit) {
            return res.status(404).json({ message: 'Credit record not found' });
        }

        credit.availableCredits += 1;
        await credit.save();

        // Step 3: Fetch FCM token
        const customer = await User.findById(customerId);
        if (!customer || !customer.fcmToken) {
            return res.status(404).json({ message: 'Customer or FCM token not found' });
        }

        // Step 4: Send notification
        const message = {
            notification: {
                title: 'Credit Refunded',
                body: '1 credit has been refunded to your account successfully!',
            },
            data: {
                Message:"Refunded",  // Include deliveryId in the data payload
            },
            token: customer.fcmToken,
        };

        await admin.messaging().send(message);

        // Step 5: Mark refund as processed
        delivery.isRefunded = true;
        await delivery.save();

        res.status(200).json({ message: 'Credit refunded and notification sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}



const closeTiffinModal = async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming userId is available in the request object
        const { deliveryId } = req.body;  // Extract deliveryId from request body
        console.log("USERId: ", userId);
        console.log("deliveryId: ", deliveryId);

        // Find the user by their ID
        const user = await User.findById(userId);
        
        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Remove the deliveryId from the showTiffinModal array
        user.showTiffinModal = user.showTiffinModal.filter(id => id !== deliveryId);
        
        // Save the updated user document
        await user.save();

        // Send a successful response
        return res.status(200).json({
            success: true,
            message: 'Tiffin modal closed successfully!',
        });

    } catch (error) {
        console.error('Error occurred while updating closeTiffinModal:', error);
        return res.status(500).json({
            success: false,
            message: 'Error occurred while updating the closeTiffinModal',
        });
    }
};


const getDeliveryDetails = async (req, res) => {
    const { deliveryId } = req.body; // Get delivery ID from request parameters
  
    try {
      // Fetch the delivery details along with delivery person details
      const delivery = await Delivery.findById(deliveryId)
        .populate('deliveryPerson', 'name contact') // Populate deliveryPerson field to fetch their name
        .exec();
  
      if (!delivery) {
        return res.status(404).json({ message: 'Delivery not found' });
      }
  
      // Prepare the response data
      const response = {
        deliveryPersonName: delivery.deliveryPerson ? delivery.deliveryPerson.name : 'Not Assigned',
        deliveryPersonContact: delivery.deliveryPerson ? delivery.deliveryPerson.contact : 'Not Available',
        timeOfDelivery: delivery.date || 'NAN',
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };



const MealOptOut = require('../models/MealOptOut');

const optOutMeal = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { date } = req.body;  // Get customer ID, date, and reason from request

        // Check if the customer has already opted out for this day
        const existingOptOut = await MealOptOut.findOne({ customer: customerId, date: date });

        if (existingOptOut) {
            return res.status(400).json({ message: 'Already opted out for this meal' });
        }

        const optOutRecord = new MealOptOut({ customer: customerId, date });
        await optOutRecord.save();

        return res.status(200).json({ message: 'Successfully opted out of meal for today' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getOptOutReports = async (req, res) => {
    try {
        const optOuts = await MealOptOut.find()
            .populate('customer', 'name email contact')  // Populate customer details
            .sort({ date: -1 });  // Sort by most recent opt-outs

        if (optOuts.length === 0) {
            return res.status(404).json({ message: 'No opt-outs found' });
        }

        return res.status(200).json(optOuts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const deleteOptOutById = async (req, res) => {
    try {
        const { id } = req.body;  // Get opt-out record ID from the request params
        const optOutRecord = await MealOptOut.findByIdAndDelete(id);
        if (!optOutRecord) {
            return res.status(404).json({ message: 'Opt-out record not found' });
        }
        return res.status(200).json({ message: 'Opt-out record deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



const getDashboardData = async (req, res) => {
    try {
        // Get all customers
        const customers = await User.find({ role: "customer" }).select("_id name contact address fcmToken");
        const customerIds = customers.map(user => user._id);

        // Filter customers who have a valid meal plan
        const activeCredits = await Credit.find({
            user: { $in: customerIds },
            mealPlan: { $ne: null },
        }).select("user mealPlan mealPlanExpiryDate");
        const activeCustomerIds = activeCredits.map(credit => credit.user.toString());

        // Count total customers with a meal plan
        const totalCustomers = activeCustomerIds.length;

        // Get all meal plans
        const mealPlans = await MealPlan.find().select("_id name type");

        // Compute lowerStats dynamically
        const lowerStats = {};
        for (const plan of mealPlans) {
            const count = await Credit.countDocuments({
                user: { $in: activeCustomerIds },
                mealPlan: plan._id,
            });

            lowerStats[plan.name] = {
                type: plan.type,
                totalCustomers: count,
            };
        }

        // Get all delivery partners
        const deliveryPartners = await User.find({ role: "delivery" }).select("name address");

        // Get plan purchased users sorted by expiry date (ascending order)
        const planUsers = await Credit.find({
            user: { $in: activeCustomerIds },
        })
            .populate("user", "name contact fcmToken")
            .populate("mealPlan", "name")
            .sort({ mealPlanExpiryDate: 1 }) // Sorting by nearest expiry
            .select("user mealPlan mealPlanExpiryDate createdAt");

        const PlanPurchasedUser = planUsers.map(credit => ({
            name: credit.user.name,
            contact: credit.user.contact,
            Plan: credit.mealPlan.name,
            Date: credit.createdAt.toISOString().split("T")[0],
            Expiry: credit.mealPlanExpiryDate.toISOString().split("T")[0],
            fcmtoken: credit.user.fcmToken,
        }));

        res.status(200).json({
            totalCustomer: totalCustomers,
            lowerStats,
            DeliveryPartners: deliveryPartners,
            PlanPurchasedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newAddress } = req.body;

        if (!userId || !newAddress) {
            return res.status(400).json({
                success: false,
                message: "User ID and new address are required.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID.",
            });
        }

        // Find and update the user's address
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { address: newAddress },
            { new: true, runValidators: true } // Return updated document & validate changes
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            user: updatedUser, // Optionally return updated user details
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the address. Please try again.",
        });
    }
};



const updateUserLocation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { latitude, longitude } = req.body;

        // Validate inputs
        if (!userId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'userId, latitude, and longitude are required.' });
        }

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { latitude, longitude },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ message: 'Location updated successfully.', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};



module.exports = { getUserMealPlan,getDashboardData,optOutMeal,getOptOutReports,deleteOptOutById,getDeliveryDetails,closeTiffinModal,getUserData,updatePlan,getAllCustomers,getTiffinSystemCustomers,getDeliveryUsers,getDeliverUserData,updateDeliveryStatus,refundCredits,updateAddress,updateUserLocation };
