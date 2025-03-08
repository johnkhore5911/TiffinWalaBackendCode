const Meal = require("../models/Meal");

// Create a new meal
const createMeal = async (req, res) => {
  try {
    const { mealType, itemName, date } = req.body;

    // Check if required fields are provided
    if (!itemName || !date) {
      return res.status(400).json({ message: "Item name and date are required" });
    }

    const newMeal = new Meal({ mealType, itemName, date });
    await newMeal.save();

    res.status(201).json({ message: "Meal added successfully", meal: newMeal });
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteMeal = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedMeal = await Meal.findByIdAndDelete(id);
  
      if (!deletedMeal) {
        return res.status(404).json({ message: "Meal not found" });
      }
  
      res.json({ message: "Meal deleted successfully" });
    } catch (error) {
      console.error("Error deleting meal:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllMeal = async (req,res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ message: "Failed to fetch meals" });
  }
};
  
  module.exports = { getAllMeal,createMeal, deleteMeal };
  