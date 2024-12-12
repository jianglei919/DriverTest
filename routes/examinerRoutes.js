const express = require('express');
const router = express.Router();
const examinerController = require('../controllers/examinerController');
const authMiddleware = require('../middleware/authMiddleware');

// Examiner dashboard
router.get('/', authMiddleware, examinerController.routeExaminer);

// Retrieve driver information
router.get('/driverInfo/retrieval', authMiddleware, examinerController.retrievalDriverInfo);

// Update driver information
router.post('/driverInfo/update/:id', authMiddleware, examinerController.updateDriverInfo);

module.exports = router;