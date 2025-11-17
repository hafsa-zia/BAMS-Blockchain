const express = require("express");
const router = express.Router();
const deptCtrl = require("../controllers/departmentController");

router.post("/", deptCtrl.createDepartment);
router.get("/", deptCtrl.getDepartments);
router.get("/:id", deptCtrl.getDepartmentById);
router.post("/:id/update", deptCtrl.updateDepartment); // append update block
// Note: Deleting department is implemented by appending a "deleted" block.
router.post("/:id/delete", deptCtrl.deleteDepartment);

module.exports = router;
