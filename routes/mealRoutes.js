const express = require("express");
const { createMeal, deleteMeal,getAllMeal } = require("../controllers/mealController");
const { auth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/add-meal", createMeal);
router.delete("/delete-meal/:id", deleteMeal);
router.get("/get-meals", getAllMeal);


module.exports = router;
