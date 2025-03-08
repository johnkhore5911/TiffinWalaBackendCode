const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    console.log("Marking attandance!");
    const { employeeId, date } = req.body;
    console.log("employeeId",employeeId);
    console.log("date",date);
    if (!employeeId || !date) {
      return res.status(400).json({ error: "Employee ID and date are required" });
    }

    // Check if attendance is already marked
    const existingAttendance = await Attendance.findOne({ employeeId, date });
    if (existingAttendance) {
      return res.status(200).json({ message:"Attendance already marked for this date",error: "Attendance already marked for this date" });
    }

    const attendance = new Attendance({ employeeId, date });
    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get attendance summary for a month
const getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const endDate = `${year}-${month.padStart(2, "0")}-31`;

    const attendanceRecords = await Employee.aggregate([
      {
        $lookup: {
          from: "attendances",
          let: { employeeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$employeeId", "$$employeeId"] },
                date: { $gte: startDate, $lte: endDate },
              },
            },
            {
              $group: {
                _id: null,
                attendanceCount: { $sum: 1 },
              },
            },
          ],
          as: "attendanceData",
        },
      },
      {
        $project: {
          employeeId: "$_id",
          name: 1,
          attendanceCount: { $ifNull: [{ $arrayElemAt: ["$attendanceData.attendanceCount", 0] }, 0] },
        },
      },
    ]);

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Get detailed attendance for an employee
const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const endDate = `${year}-${month.padStart(2, "0")}-31`;

    const records = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    }).select("date -_id");

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      employeeId,
      name: employee.name,
      salary: employee.salary,
      daysPresent: records.map((r) => r.date),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { markAttendance,markAttendance, getMonthlyAttendance, getEmployeeAttendance };
