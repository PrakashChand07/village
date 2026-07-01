require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import existing routes
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/jobs.routes');
const resultRoutes = require('./routes/results.routes');
const scholarshipRoutes = require('./routes/scholarships.routes');
const schemeRoutes = require('./routes/schemes.routes');
const categoryRoutes = require('./routes/categoryRoutes');
const newsRoutes = require('./routes/news.routes');
const contactRoutes = require('./routes/contact.routes');
const studyMaterialRoutes = require('./routes/studyMaterial.routes');
const importantUpdatesRoutes = require('./routes/importantUpdates.routes');

// Import new test series routes
const userAuthRoutes = require('./routes/userAuth.routes');
const testSeriesRoutes = require('./routes/testSeries.routes');
const testRoutes = require('./routes/test.routes');
const questionRoutes = require('./routes/question.routes');
const attemptRoutes = require('./routes/attempt.routes');
const paymentRoutes = require('./routes/payment.routes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://viillagehelp.in',
    'https://www.viillagehelp.in',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '✅ Village Help API is running', timestamp: new Date() });
});

// Serve static uploads
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));

// ── Existing Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/important-updates', importantUpdatesRoutes);

// ── New Test Series Routes ───────────────────────────────────
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/test-series', testSeriesRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/payment', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
});
