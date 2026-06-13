const Result = require('../models/Result');
const Question = require('../models/Question');

exports.submitCBT = async (req, res) => {
  try {
    const { topicId, answers, timeTaken } = req.body;

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const questionMap = {};
    questions.forEach(q => { questionMap[q._id.toString()] = q; });

    let correctAnswers = 0;
    const processedAnswers = answers.map(a => {
      const q = questionMap[a.questionId];
      const isCorrect = q && q.correctAnswer === a.selectedAnswer;
      if (isCorrect) correctAnswers++;
      return {
        question: a.questionId,
        selectedAnswer: a.selectedAnswer,
        isCorrect
      };
    });

    const totalQuestions = answers.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    const result = await Result.create({
      student: req.user._id,
      topic: topicId,
      totalQuestions,
      correctAnswers,
      score,
      answers: processedAnswers,
      timeTaken
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('topic', 'title className')
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('topic', 'title className')
      .populate('answers.question', 'question options correctAnswer');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.topic) filter.topic = req.query.topic;
    const results = await Result.find(filter)
      .populate('student', 'fullName email className')
      .populate('topic', 'title className')
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
