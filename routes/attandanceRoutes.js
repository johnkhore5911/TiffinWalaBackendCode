const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getMonthlyAttendance,
  getEmployeeAttendance,
} = require("../controllers/attandanceController");
const { auth, isAdmin } = require("../middlewares/auth");

// Attendance Routes
// router.post("/", auth, markAttendance);
// router.get("/monthly", auth, isAdmin, getMonthlyAttendance);
// router.get("/:employeeId", auth, getEmployeeAttendance);

// router.post("/XYZ", markAttendance);
router.post("/",auth,isAdmin, markAttendance);
router.get("/monthly", auth,isAdmin,getMonthlyAttendance);
router.get("/:employeeId",auth,isAdmin, getEmployeeAttendance);


module.exports = router;
