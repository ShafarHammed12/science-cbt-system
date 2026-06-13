const express = require('express');
const router = express.Router();
const { createTopic, getTopics, getTopic, updateTopic, deleteTopic } = require('../controllers/topicController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getTopics);
router.get('/:id', protect, getTopic);
router.post('/', protect, adminOnly, createTopic);
router.put('/:id', protect, adminOnly, updateTopic);
router.delete('/:id', protect, adminOnly, deleteTopic);

module.exports = router;
