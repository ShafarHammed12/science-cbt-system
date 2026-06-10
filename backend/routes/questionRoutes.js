const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getQuestion, updateQuestion, deleteQuestion, getCBTQuestions, generateQuestions } = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getQuestions);
router.get('/cbt/:topicId', protect, getCBTQuestions);
router.get('/:id', protect, getQuestion);
router.post('/', protect, adminOnly, createQuestion);
router.post('/generate', protect, adminOnly, generateQuestions);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
