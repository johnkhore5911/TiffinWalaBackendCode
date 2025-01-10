
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcrypt");
const MealPlan = require("../models/MealPlan")

const mealPlan = async (req,res) => {
    const { name, description, credits, price, validity, planType } = req.body;

    try {
      // Validate incoming data
      if (!name || !description || !credits || !price || !validity || !planType) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Create a new meal plan instance
      const newMealPlan = new MealPlan({
        name,
        description,
        credits,
        price,
        validity,
        planType,
      });
  
      // Save to the database
      await newMealPlan.save();
  
      return res.status(201).json({
        message: "Meal Plan created successfully",
        mealPlan: newMealPlan,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
}


const getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find();

    if (!mealPlans || mealPlans.length === 0) {
      return res.status(404).json({ success: false, message: 'No meal plans found' });
    }

    res.status(200).json({ success: true, data: mealPlans });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching meal plans' });
  }
};


const deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params; // Extract the meal plan ID from request params
    console.log("id:",id);
    // Find and delete the meal plan
    const deletedMealPlan = await MealPlan.findByIdAndDelete(id);

    if (!deletedMealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal Plan not found',
      });
    }

    // If deletion is successful
    res.status(200).json({
      success: true,
      message: 'Meal Plan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting meal plan:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while deleting meal plan',
      error: error.message,
    });
  }
};




module.exports = { mealPlan,getAllMealPlans,deleteMealPlan};

