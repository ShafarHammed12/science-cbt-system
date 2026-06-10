const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getQuestion, updateQuestion, deleteQuestion, getCBTQuestions } = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getQuestions);
router.get('/:id', protect, getQuestion);
router.get('/cbt/:topicId', protect, getCBTQuestions);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
