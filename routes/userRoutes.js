const express = require("express")
const router = express.Router()
const {
  getDashboardData,getUserMealPlan,
  optOutMeal,getOptOutReports,deleteOptOutById,
  closeTiffinModal,
  getDeliveryDetails,
  getUserData,updatePlan,getAllCustomers,getTiffinSystemCustomers,getDeliveryUsers,getDeliverUserData,updateDeliveryStatus,refundCredits,
  updateAddress,updateUserLocation
} = require("../controllers/userController")

const { auth,isAdmin,isDeliveryBoy, isCustomer } = require("../middlewares/auth")


router.get("/userData", auth,getUserData)
router.get("/userDataMealPlan", auth,getUserMealPlan)
router.post("/updateAddress", auth,updateAddress)
router.post("/updateUserLocation", auth,updateUserLocation)
router.get("/getDeliverUserData", auth,getDeliverUserData)
router.post("/updatePlan", auth,updatePlan)
router.get("/getAllCustomers",auth,isAdmin,getAllCustomers)
router.get("/getTiffinSystemCustomers",auth,isAdmin,getTiffinSystemCustomers)
router.get("/getDeliveryUsers",auth,isAdmin,getDeliveryUsers)
router.post("/updateDeliveryStatus",auth,isCustomer,updateDeliveryStatus)
router.post("/refundCredits",auth,isAdmin,refundCredits)
router.post("/closeTiffinModal",auth,isCustomer,closeTiffinModal)
router.post("/getDeliveryDetails",auth,isCustomer,getDeliveryDetails)

router.post("/optOutMeal",auth,isCustomer,optOutMeal)
router.get("/getOptOutReports",auth,isAdmin,getOptOutReports)
router.post("/deleteOptOutById",auth,isAdmin,deleteOptOutById)
router.get("/DashboardController",auth,isAdmin,getDashboardData)


module.exports = router