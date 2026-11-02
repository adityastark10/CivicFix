const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Citizen Registration Routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Citizen Login Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

module.exports = router;
