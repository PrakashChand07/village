const StudyMaterial = require('../models/StudyMaterial');
const path = require('path');
const fs = require('fs');

// ─── PUBLIC ──────────────────────────────────────────────

// @desc    Get all active study materials
// @route   GET /api/study-materials
// @access  Public
const getPublicMaterials = async (req, res) => {
  try {
    const { category, search, type, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All' && category !== 'All Categories') query.category = category;
    if (type && type !== 'All') query.type = type;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const materials = await StudyMaterial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await StudyMaterial.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: materials,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Download a study material file
// @route   GET /api/study-materials/:id/download
// @access  Public
const downloadMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material || !material.isActive) {
      return res.status(404).json({ success: false, message: 'Material not found or inactive' });
    }

    if (!material.fileUrl) {
      return res.status(404).json({ success: false, message: 'No file associated with this material' });
    }

    const filePath = path.join(__dirname, '../../', material.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    // Increment downloads
    material.downloads += 1;
    await material.save();

    // Set appropriate headers and send file
    res.download(filePath, material.title + path.extname(filePath));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get ALL materials (including inactive) for admin
// @route   GET /api/study-materials/admin/all
// @access  Private
const getAllMaterials = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category && category !== 'All' && category !== 'All Categories') query.category = category;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const materials = await StudyMaterial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await StudyMaterial.countDocuments(query);

    res.status(200).json({ success: true, total, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create new material
// @route   POST /api/study-materials/admin
// @access  Private
const createMaterial = async (req, res) => {
  try {
    const { title, subject, category, type, description, isActive, isImportantUpdate } = req.body;
    
    let fileUrl = '';
    let fileSize = '0 MB';

    if (req.file) {
      fileUrl = req.file.path.replace(/\\/g, '/'); // Normalize path for windows
      const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2);
      fileSize = `${sizeInMB} MB`;
    }

    const material = await StudyMaterial.create({
      title,
      subject,
      category,
      type,
      description,
      isActive: isActive === 'true' || isActive === true,
      isImportantUpdate: isImportantUpdate === 'true' || isImportantUpdate === true,
      fileUrl,
      fileSize,
      downloads: 0
    });

    res.status(201).json({ success: true, message: 'Material created successfully', data: material });
  } catch (error) {
    // Clean up uploaded file if creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update material
// @route   PUT /api/study-materials/admin/:id
// @access  Private
const updateMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    const { title, subject, category, type, description, isActive, isImportantUpdate } = req.body;

    let fileUrl = material.fileUrl;
    let fileSize = material.fileSize;

    if (req.file) {
      // New file uploaded, delete old one
      if (material.fileUrl) {
        const oldPath = path.join(__dirname, '../../', material.fileUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      fileUrl = req.file.path.replace(/\\/g, '/');
      const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2);
      fileSize = `${sizeInMB} MB`;
    }

    material.title = title || material.title;
    material.subject = subject || material.subject;
    material.category = category || material.category;
    material.type = type || material.type;
    material.description = description || material.description;
    
    if (isActive !== undefined) {
      material.isActive = isActive === 'true' || isActive === true;
    }

    if (isImportantUpdate !== undefined) {
      material.isImportantUpdate = isImportantUpdate === 'true' || isImportantUpdate === true;
    }
    
    material.fileUrl = fileUrl;
    material.fileSize = fileSize;

    await material.save();

    res.status(200).json({ success: true, message: 'Material updated successfully', data: material });
  } catch (error) {
    // Clean up uploaded file if update fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/study-materials/admin/:id
// @access  Private
const deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    // Delete associated file
    if (material.fileUrl) {
      const filePath = path.join(__dirname, '../../', material.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Toggle material active/inactive
// @route   PATCH /api/study-materials/admin/:id/toggle
// @access  Private
const toggleMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    
    material.isActive = !material.isActive;
    await material.save();
    
    res.status(200).json({ success: true, message: `Material ${material.isActive ? 'activated' : 'deactivated'}`, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getPublicMaterials,
  downloadMaterial,
  getAllMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  toggleMaterial
};
