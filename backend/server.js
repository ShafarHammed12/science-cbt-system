const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');
const progressRoutes = require('./routes/progressRoutes');
const reportRoutes = require('./routes/reportRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
