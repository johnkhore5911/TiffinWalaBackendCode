const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  deleteEmployee,
} = require("../controllers/employeeController");
const { auth, isAdmin } = require("../middlewares/auth");

// Employee Routes
// router.post("/", auth, isAdmin, addEmployee);
// router.get("/", auth, getEmployees);
// router.delete("/:id", auth, isAdmin, deleteEmployee);

router.post("/",auth,isAdmin, addEmployee);
router.get("/",auth,isAdmin, getEmployees);
router.delete("/:id",auth,isAdmin, deleteEmployee);


module.exports = router;
