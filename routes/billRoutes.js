const express = require('express');
const router = express.Router();
const { addBill,deleteBill,getMonthlyExpenses,getTotalExpenses } = require('../controllers/billController');
const {auth,isAdmin} = require("../middlewares/auth")

router.post('/addBill',auth,isAdmin, addBill);
router.delete("/:id",auth,isAdmin, deleteBill);
router.get("/monthly/:month/:year",auth,isAdmin,getMonthlyExpenses);
router.get("/total",auth,isAdmin, getTotalExpenses);

module.exports = router;
