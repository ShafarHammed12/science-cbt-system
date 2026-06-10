const Result = require('../models/Result');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');

exports.getStudentReport = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const student = await User.findById(studentId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const results = await Result.find({ student: studentId })
      .populate('topic', 'title className');

    const totalTests = results.length;
    const avgScore = totalTests > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalTests)
      : 0;

    const completedLessons = await Progress.countDocuments({ student: studentId, completed: true });
    const totalLessons = await Lesson.countDocuments();

    res.json({
      student: { fullName: student.fullName, email: student.email, className: student.className },
      totalTests,
      averageScore: avgScore,
      completedLessons,
      totalLessons,
      lessonProgress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      recentResults: results.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassReport = async (req, res) => {
  try {
    const { className } = req.params;
    const students = await User.find({ role: 'student', className }).select('-password');

    const report = await Promise.all(students.map(async (student) => {
      const results = await Result.find({ student: student._id });
      const totalTests = results.length;
      const avgScore = totalTests > 0
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalTests)
        : 0;
      const completedLessons = await Progress.countDocuments({ student: student._id, completed: true });

      return {
        student: { _id: student._id, fullName: student.fullName, email: student.email },
        totalTests,
        averageScore: avgScore,
        completedLessons
      };
    }));

    res.json({ className, totalStudents: students.length, students: report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTopics = await Topic.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalTests = await Result.countDocuments();

    const recentResults = await Result.find()
      .populate('student', 'fullName className')
      .populate('topic', 'title')
      .sort({ completedAt: -1 })
      .limit(10);

    res.json({ totalStudents, totalTopics, totalLessons, totalTests, recentResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
