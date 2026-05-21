const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPublicMaterials,
  downloadMaterial,
  getAllMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  toggleMaterial
} = require('../controllers/studyMaterialController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/study-materials/');
  },
  filename: function (req, file, cb) {
    // Keep original name but add timestamp to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept pdf, doc, docx, txt
  if (
    file.mimetype === 'application/pdf' || 
    file.mimetype === 'application/msword' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'text/plain'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX and TXT are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// Public routes
router.get('/', getPublicMaterials);
router.get('/:id/download', downloadMaterial);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllMaterials);
router.post('/admin', protect, adminOnly, upload.single('file'), createMaterial);
router.put('/admin/:id', protect, adminOnly, upload.single('file'), updateMaterial);
router.delete('/admin/:id', protect, adminOnly, deleteMaterial);
router.patch('/admin/:id/toggle', protect, adminOnly, toggleMaterial);

module.exports = router;
