const express = require('express');
const router = express.Router();
const gController = require('../controllers/gController');
const authMiddleware = require('../middleware/authMiddleware');

// G routes
router.get('/', authMiddleware, gController.routeG);
router.post('/store', authMiddleware, gController.gStore);

module.exports = router;