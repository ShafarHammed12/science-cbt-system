const express = require('express');
const router = express.Router();
const { createLesson, getLessons, getLesson, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getLessons);
router.get('/:id', protect, getLesson);
router.post('/', protect, adminOnly, createLesson);
router.put('/:id', protect, adminOnly, updateLesson);
router.delete('/:id', protect, adminOnly, deleteLesson);

module.exports = router;
