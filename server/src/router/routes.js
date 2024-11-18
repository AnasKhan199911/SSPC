const express = require('express');
const controller = require('../controllers/appController.js');

const router = express.Router();

/** POST Methods */
router.post('/register', controller.register);      // Register user
router.post('/authenticate', controller.authenticate);  // Authenticate user
router.post('/login', controller.login);            // Login user
router.post('/logout', controller.logout);          // Logout user
router.post('/send-otp', controller.sendOtp);        // Send OTP
router.post('/verify-otp', controller.verifyOtp);    // Verify OTP

module.exports = router;
