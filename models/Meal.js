const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"], // Enum for meal type
  },
  itemName: {
    type: String, // Example: "Chicken Masala" or "Dal Roti"
    required: true,
  },
  date: {
    type: String, // Example: "08-03-2025"
    required: true,
  },
});

module.exports = mongoose.model("Meal", mealSchema);
