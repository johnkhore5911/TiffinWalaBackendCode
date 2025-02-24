const express = require("express");
const router = express.Router();
const { initiatePayment } = require("../controllers/paymentontroller");

// Route for initiating payment (Change to POST)
router.post("/initiatePayment", initiatePayment);

module.exports = router;
