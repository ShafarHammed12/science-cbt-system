const express = require('express');
const router = express.Router();
const { submitCBT, getMyResults, getResultById, getAllResults } = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitCBT);
router.get('/my', protect, getMyResults);
router.get('/all', protect, adminOnly, getAllResults);
router.get('/:id', protect, getResultById);

module.exports = router;
