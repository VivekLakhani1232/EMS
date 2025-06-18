const express = require('express');
const multer = require('multer');
const router = express.Router();
const employeeController = require('../controllers/employes');
const upload = require('../middleware/upload')

router.post('/createEmploye', upload.array('documents'), employeeController.createEmployee);
router.get('/getAllEmploye', employeeController.getAllEmployees);
router.put('/updateEmploye', employeeController.updateEmployee);
router.delete('/deleteEmployee', employeeController.deleteEmployee);
router.get('/getDepartment', employeeController.getDepartment)

module.exports = router;

