const express = require('express');
const router = express.Router();
const { getStudentReport, getClassReport, getDashboardStats } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/student/:studentId', protect, adminOnly, getStudentReport);
router.get('/my', protect, getStudentReport);
router.get('/class/:className', protect, adminOnly, getClassReport);

module.exports = router;
