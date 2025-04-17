const express = require('express');
const cors = require('cors');
const teamRoutes = require('./routes/teamRoutes'); // ✅ ADD THIS
const app = express();

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('👋 Welcome to TaskForge API');
});

app.use('/api/auth', authRoutes); // ✅ ADD THIS
app.use('/api/teams', teamRoutes); // ✅ ADD THIS
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
module.exports = app;
