const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');

exports.markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, lesson: lessonId },
      { completed: true, completedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ student: req.user._id, completed: true })
      .populate({ path: 'lesson', select: 'title topic', populate: { path: 'topic', select: 'title className' } });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopicProgress = async (req, res) => {
  try {
    const { topicId } = req.params;
    const lessons = await Lesson.find({ topic: topicId });
    const completedLessons = await Progress.find({
      student: req.user._id,
      lesson: { $in: lessons.map(l => l._id) },
      completed: true
    });
    res.json({
      totalLessons: lessons.length,
      completedLessons: completedLessons.length,
      percentage: lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
