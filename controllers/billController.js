const Bill = require("../models/Bill");

// @desc    Add a new bill entry
// @route   POST /api/bills
// @access  Private (since only the admin can add entries)
const addBill = async (req, res) => {
    try {
        const { itemName, price } = req.body;

        // Validate required fields
        if (!itemName || !price) {
            return res.status(400).json({ message: "Item name and price are required." });
        }

        // Create new bill entry
        const newBill = new Bill({
            itemName,
            price,
            // date: date || undefined, // Uses current date if not provided
        });

        // Save to database
        await newBill.save();

        res.status(201).json({ message: "Bill added successfully", bill: newBill });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Delete a bill entry by ID
// @route   DELETE /api/bills/:id
// @access  Private
const deleteBill = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received request to delete bill with ID:", req.params.id);
        // const { id } = req.body;

        // Find and delete the bill
        const deletedBill = await Bill.findByIdAndDelete(id);

        if (!deletedBill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.status(200).json({ message: "Bill deleted successfully", deletedBill });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get expenses for a given month
// @route   GET /api/bills/monthly/:month
// @access  Private
// const getMonthlyExpenses = async (req, res) => {
//     try {
//         const { month } = req.params;
//         const parsedMonth = parseInt(month);

//         if (!parsedMonth || parsedMonth < 1 || parsedMonth > 12) {
//             return res.status(400).json({ message: "Invalid month. Please provide a value between 1 and 12." });
//         }

//         const currentYear = new Date().getFullYear();

//         // Find all expenses for the given month
//         const bills = await Bill.find({
//             date: {
//                 $gte: new Date(currentYear, parsedMonth - 1, 1),
//                 $lt: new Date(currentYear, parsedMonth, 1)
//             }
//         });

//         // Calculate total expenses
//         const totalExpense = bills.reduce((sum, bill) => sum + bill.price, 0);

//         res.status(200).json({ 
//             month: parsedMonth,
//             expenses: bills,
//             totalExpense 
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };
const getMonthlyExpenses = async (req, res) => {
    try {
        const { month, year } = req.params; // Accept both month and year
        const parsedMonth = parseInt(month);
        const parsedYear = parseInt(year);

        // Validate month
        if (!parsedMonth || parsedMonth < 1 || parsedMonth > 12) {
            return res.status(400).json({ message: "Invalid month. Please provide a value between 1 and 12." });
        }

        // Validate year (optional: ensure it's a reasonable range)
        if (!parsedYear || parsedYear < 2000 || parsedYear > new Date().getFullYear()) {
            return res.status(400).json({ message: "Invalid year. Please provide a valid year." });
        }

        // Find all expenses for the given month & year
        const bills = await Bill.find({
            date: {
                $gte: new Date(parsedYear, parsedMonth - 1, 1),  // Start of the month
                $lt: new Date(parsedYear, parsedMonth, 1)       // Start of the next month
            }
        });

        // Calculate total expenses
        const totalExpense = bills.reduce((sum, bill) => sum + bill.price, 0);

        res.status(200).json({ 
            year: parsedYear,
            month: parsedMonth,
            expenses: bills,
            totalExpense 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc    Get total expenses till now
// @route   GET /api/bills/total
// @access  Private
const getTotalExpenses = async (req, res) => {
    try {
        const bills = await Bill.find();

        const totalExpense = bills.reduce((sum, bill) => sum + bill.price, 0);

        res.status(200).json({ totalExpense });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { addBill, deleteBill, getMonthlyExpenses, getTotalExpenses };
