const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

exports.generateQuestions = async (req, res) => {
  try {
    const { lessonId, count } = req.body;
    const numQuestions = Math.min(parseInt(count) || 5, 15);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured on the server' });
    }

    const lesson = await Lesson.findById(lessonId).populate('topic', 'title className');
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a Basic Science teacher for Junior Secondary School (${lesson.topic.className}) in Nigeria.

Based on the following lesson content, generate exactly ${numQuestions} multiple-choice questions.

Topic: ${lesson.topic.title}
Lesson: ${lesson.title}
Content: ${lesson.content}

Requirements:
- Questions must be directly based on the lesson content provided
- Each question must have exactly 4 options (A, B, C, D)
- Mix difficulty levels: include easy, medium, and hard questions
- Questions should test understanding, not just memorization
- Appropriate for Junior Secondary School students

Respond ONLY with a valid JSON array in this exact format (no markdown, no code blocks, just the JSON):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "difficulty": "easy"
  }
]

Where correctAnswer is the index (0-3) of the correct option, and difficulty is "easy", "medium", or "hard".`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    let parsed;
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in AI response');
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      return res.status(500).json({ message: 'Failed to parse AI response. Please try again.' });
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return res.status(500).json({ message: 'AI returned no questions. Please try again.' });
    }

    const savedQuestions = [];
    for (const q of parsed) {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 ||
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        continue;
      }
      const saved = await Question.create({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        topic: lesson.topic._id,
        difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
        createdBy: req.user._id
      });
      savedQuestions.push(saved);
    }

    res.status(201).json({
      message: `${savedQuestions.length} questions generated and saved!`,
      count: savedQuestions.length,
      questions: savedQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'AI generation failed: ' + error.message });
  }
};
