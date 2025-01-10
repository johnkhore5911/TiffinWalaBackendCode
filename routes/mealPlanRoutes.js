const express = require("express");
const {auth,isCustomer,isDeliveryBoy,isAdmin} = require("../middlewares/auth")
const { mealPlan,getAllMealPlans,deleteMealPlan } = require("../controllers/mealPlanController")
const router = express.Router();

router.post("/meal-plans",auth,isAdmin,mealPlan);
router.get("/meal-plans",auth,getAllMealPlans);
router.delete("/meal-plans/:id",auth,isAdmin,deleteMealPlan);



module.exports = router;