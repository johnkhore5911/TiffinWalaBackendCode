const mongoose = require('mongoose');

const MealOptOutSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Linking it to the customer
        required: true,
    },
    date: {
        type: String,  // The date of the meal the customer is opting out of
        required: true,
    },
    reason: {
        type: String,  // Optional: Reason for opting out
        default: 'No meal today',
    },
});

module.exports = mongoose.model('MealOptOut', MealOptOutSchema);
