const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, topic, difficulty } = req.body;
    const q = await Question.create({
      question, options, correctAnswer, topic, difficulty,
      createdBy: req.user._id
    });
    res.status(201).json(q);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    const questions = await Question.find(filter).populate('topic', 'title');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCBTQuestions = async (req, res) => {
  try {
    const { topicId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const questions = await Question.find({ topic: topicId })
      .select('question options difficulty')
      .limit(limit);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
