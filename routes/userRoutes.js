const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

// SignUp routes
router.get('/signUp', redirectIfAuthenticatedMiddleware, userController.routeSignUp);
router.post('/signUp', redirectIfAuthenticatedMiddleware, userController.userSignUp);

// Login/Logout routes
router.get('/login', redirectIfAuthenticatedMiddleware, userController.routeLogin);
router.post('/login', redirectIfAuthenticatedMiddleware, userController.userLogin);
router.get('/logout', userController.logout);

module.exports = router;