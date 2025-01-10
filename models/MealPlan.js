const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    planType:{
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    validity: {
        type: Number, // in days
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
