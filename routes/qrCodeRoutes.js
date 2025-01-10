const express = require("express")
const router = express.Router()
const {
  scanQRCode,
  generateQRCode,
  getScannedCustomers
} = require("../controllers/qrCodeController")

const { auth,isAdmin } = require("../middlewares/auth")

// Route for user login
router.get("/scan-qr",auth,scanQRCode)
router.post('/generate',generateQRCode);
router.post("/getScannedCustomers",auth,isAdmin,getScannedCustomers);

module.exports = router