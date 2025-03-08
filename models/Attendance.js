const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: String, required: true } // Format: YYYY-MM-DD
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
