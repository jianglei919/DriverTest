const express = require('express');
const router = express.Router();
const g2Controller = require('../controllers/g2Controller');
const authMiddleware = require('../middleware/authMiddleware');

// G2 routes
router.get('/', authMiddleware, g2Controller.routeG2);
router.post('/store', authMiddleware, g2Controller.g2Store);

module.exports = router;