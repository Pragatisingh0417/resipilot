require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// ✅ ADD THIS LINE
app.use("/uploads", (req, res, next) => {
  res.setHeader("Content-Disposition", "inline"); // or "attachment"
  next();
}, express.static(path.join(__dirname, "..", "uploads")));


// Routes
app.use('/api/analytics', require('./routes/analytics')); // 👈 MOVE HERE FIRST

app.use('/api/auth', require('./routes/auth'));
app.use('/api/children', require('./routes/children'));
app.use('/api/foster-families', require('./routes/fosterFamilies'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/communications', require('./routes/communications'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/ai', require('./routes/ai'));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
console.log("Connecting to:", process.env.MONGODB_URI);
console.log("🚀 SERVER STARTED FROM INDEX.JS");
  })
  .catch(err => console.error('MongoDB connection error:', err));
