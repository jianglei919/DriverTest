const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Appointment routes
router.get('/appointment', authMiddleware, adminController.routeAppointment);
router.get('/appointment/retrieval', authMiddleware, adminController.retrievalAppointment);
router.post('/appointment/add', authMiddleware, adminController.addAppointment);

// Candidate routes
router.get('/candidate', authMiddleware, adminController.getCandidates);
router.post('/createOrder', authMiddleware, adminController.createOrder);

module.exports = router;