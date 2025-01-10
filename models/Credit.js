// // const mongoose = require('mongoose');

// // const CreditSchema = new mongoose.Schema({
// //     user: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: 'User',
// //         required: true,
// //     },
// //     mealPlan: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: 'MealPlan',
// //         // required: true,
// //         default: null,
// //     },
// //     availableCredits: {
// //         type: Number,
// //         required: true,
// //     },
// //     usedCredits: {
// //         type: Number,
// //         default: 0,
// //     },
// //     lowCreditThreshold: {
// //         type: Number,
// //         default: 5,
// //     },
// //     createdAt: {
// //         type: Date,
// //         default: Date.now,
// //     },
// // });

// // module.exports = mongoose.model('Credit', CreditSchema);
// const mongoose = require('mongoose');

// const CreditSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     mealPlan: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'MealPlan',
//         default: null,  // initially, meal plan can be null
//     },
//     availableCredits: {
//         type: Number,
//         required: true,
//     },
//     usedCredits: {
//         type: Number,
//         default: 0,
//     },
//     lowCreditThreshold: {
//         type: Number,
//         default: 5,
//     },
//     mealPlanValidity: {  // Only populate if meal plan exists
//         type: Number,
//         default: null,
//     },
//     mealPlanExpiryDate: {  // Only populate if meal plan exists
//         type: Date,
//         default: null,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });
// module.exports = mongoose.model('Credit', CreditSchema);


const mongoose = require('mongoose');

const CreditSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mealPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealPlan',
        default: null,  // Initially, meal plan can be null
    },
    availableCredits: {
        type: Number,
        required: true,
    },
    usedCredits: {
        type: Number,
        default: 0,
    },
    lowCreditThreshold: {
        type: Number,
        default: 5,
    },
    mealPlanValidity: {  // Only populate if meal plan exists
        type: Number,
        default: null,
    },
    mealPlanExpiryDate: {  // Only populate if meal plan exists
        type: Date,
        default: null,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Credit', CreditSchema);
