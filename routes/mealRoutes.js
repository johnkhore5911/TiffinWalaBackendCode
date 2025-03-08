const express = require("express");
const { createMeal, deleteMeal,getAllMeal } = require("../controllers/mealController");
const { auth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/add-meal",auth,isAdmin, createMeal);
router.delete("/delete-meal/:id",auth,isAdmin, deleteMeal);
router.get("/get-meals",auth, getAllMeal);



module.exports = router;
