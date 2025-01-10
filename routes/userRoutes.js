const express = require("express")
const router = express.Router()
const {
  getUserData,updatePlan,getAllCustomers,getTiffinSystemCustomers,getDeliveryUsers,getDeliverUserData,updateDeliveryStatus,refundCredits
} = require("../controllers/userController")

const { auth,isAdmin,isDeliveryBoy, isCustomer } = require("../middlewares/auth")


router.get("/userData", auth,getUserData)
router.get("/getDeliverUserData", auth,getDeliverUserData)
router.post("/updatePlan", auth,updatePlan)
router.get("/getAllCustomers",auth,isAdmin,getAllCustomers)
router.get("/getTiffinSystemCustomers",auth,isAdmin,getTiffinSystemCustomers)
router.get("/getDeliveryUsers",auth,isAdmin,getDeliveryUsers)
router.post("/updateDeliveryStatus",auth,isCustomer,updateDeliveryStatus)
router.post("/refundCredits",auth,isAdmin,refundCredits)


module.exports = router