const express = require('express');
const router = express.Router();
const { markLessonComplete, getMyProgress, getTopicProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/complete', protect, markLessonComplete);
router.get('/my', protect, getMyProgress);
router.get('/topic/:topicId', protect, getTopicProgress);

module.exports = router;
