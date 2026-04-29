
const router = require('express').Router();
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop(); // get extension
cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, PDF allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const items = await Document.find().skip((page - 1) * limit).limit(limit).populate('uploadedBy').sort({ createdAt: -1 });
    const total = await Document.countDocuments();
    res.json({ data: items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Document.findById(req.params.id).populate('uploadedBy');
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});



router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ error: "Not found" });

    // delete file from uploads
    if (doc.fileUrl) {
      const filePath = path.join(__dirname, "..", doc.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.log("File delete error:", err);
      });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const file = req.file;

    const item = await Document.create({
      title: req.body.title,
      type: req.body.type,

      fileUrl: file ? `/uploads/${file.filename}` : null,
      fileName: file?.originalname,
      fileSize: file?.size,

      tags: req.body.tags ? JSON.parse(req.body.tags) : [],

      uploadedBy: req.user?.id || null,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
