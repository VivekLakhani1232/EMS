const express = require('express');
const multer = require('multer');
const router = express.Router();
const employeeController = require('../controllers/employes');
const upload = require('../middleware/upload')

router.post('/employees', upload.array('documents'), employeeController.createEmployee);

module.exports = router;
