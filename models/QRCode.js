const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    validDate: {
        type: Date,
        required: true,
    },
    scannedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
