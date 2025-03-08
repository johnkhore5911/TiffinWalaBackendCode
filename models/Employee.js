const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  salary: { type: Number },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
