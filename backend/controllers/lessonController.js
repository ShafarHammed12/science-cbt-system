const Lesson = require('../models/Lesson');

exports.createLesson = async (req, res) => {
  try {
    const { title, content, topic, videoUrl, order } = req.body;
    const lesson = await Lesson.create({
      title, content, topic, videoUrl, order,
      createdBy: req.user._id
    });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    const lessons = await Lesson.find(filter).populate('topic', 'title className').sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('topic', 'title className');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
