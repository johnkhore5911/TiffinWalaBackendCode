const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    itemName: { type: String, required: true },  // Name of the item purchased
    price: { type: Number, required: true },  // Cost of the item
    // category: { type: String, enum: ["Food", "Groceries", "Utilities", "Other"], default: "Other" },  // Category of expense
    date: { type: Date, default: Date.now },  // Purchase date
    // adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },  // Reference to the Admin who added this entry
});

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;