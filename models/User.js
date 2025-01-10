// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'customer', 'deliveryBoy'],
//         required: true,
//     },
//     contact: {
//         type: String,
//     },
//     address: {
//         type: String,
//     },
//     mealPreferences: {
//         type: String, // e.g., "Vegetarian", "Non-Vegetarian"
//     },
//     fcmToken: {  
//         type: String, 
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'delivery'],
        required: true,
    },
    contact: {
        type: String,
    },
    address: {
        type: String,
    },
    mealPreferences: {
        type: String, // e.g., "Vegetarian", "Non-Vegetarian"
    },
    fcmToken: {  
        type: String,
        required: function() {
            return (this.role === 'customer'|| this.role==='delivery');  // Only required for 'customer' role
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
