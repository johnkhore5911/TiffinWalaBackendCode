// const mongoose = require('mongoose');

// const DeliverySchema = new mongoose.Schema({
//     customer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     deliveryPerson: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     status: {
//         type: String,
//         enum: ['Pending', 'Delivered', 'Missed'],
//         required: true,
//     },
//     collectionStatus: {
//         type: String,
//         enum: ['Collected', 'Not Collected'],
//         default: 'Not Collected',
//     },
//     date: {
//         type: String,  
//         required: true,
//         // type: Date,
//         // default: Date.now,
//     },
//     feedback: {
//         type: String,
//     },
// });

// module.exports = mongoose.model('Delivery', DeliverySchema);


const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Pending', 'Delivered', 'Missed'],
        required: true,
        default: 'Pending',  // Default status is 'Pending'
    },
    collectionStatus: {
        type: String,
        enum: ['Collected', 'Not Collected', 'Not Found'],
        default: 'Not Collected',
    },
    date: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
    },
    isCustomerResponded: {
        type: Boolean,
        default: false,  // Initially, no response from the customer
    },
    isRefunded: {
        type: Boolean,
        default: false, // Initially, no refund has been processed
    },
    responseTime: {
        type: Date,  // To track when the response was received
    },
});

module.exports = mongoose.model('Delivery', DeliverySchema);
