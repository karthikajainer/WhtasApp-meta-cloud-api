const express = require('express');
const { register, login, getUsers } = require('../controllers/authController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', authMiddleware, requireRole('admin'), getUsers);

module.exports = router;
