const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

// Add a new employee
const addEmployee = async (req, res) => {
  try {
    const { name,salary } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Employee name is required" });
    }

    const employee = new Employee({ name,salary });
    await employee.save();
    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete an employee
// const deleteEmployee = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Employee.findByIdAndDelete(id);
//     res.status(200).json({ message: "Employee deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };
// Delete an employee and their attendance records
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all attendance records of the employee
    await Attendance.deleteMany({ employeeId: id });

    // Delete the employee
    await Employee.findByIdAndDelete(id);

    res.status(200).json({ message: "Employee and their attendance records deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addEmployee, getEmployees, deleteEmployee };
