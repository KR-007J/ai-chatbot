const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|png|jpg|jpeg|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, PNG, JPG, JPEG, and TXT files are allowed'));
  }
});

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/?auth=success');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/');
  });
});

app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        name: req.user.displayName,
        email: req.user.emails[0].value,
        photo: req.user.photos[0].value
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Helper functions
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
}

async function extractTextFromImage(filePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: m => console.log(m)
    });
    return text;
  } catch (error) {
    throw new Error('Failed to extract text from image');
  }
}

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let extractedText = '';

    if (fileExtension === '.pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
      extractedText = await extractTextFromImage(filePath);
    } else if (fileExtension === '.txt') {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      text: extractedText,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Gemini AI integration endpoint - USING GEMINI 2.5 FLASH (BEST MODEL)
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Server API key not configured' });
    }

    // Best models from your available list, in order of preference
    const models = [
      'gemini-2.5-flash',           // 🏆 BEST - Latest, fastest, most balanced
      'gemini-2.5-pro',             // 🥈 Better quality, slower
      'gemini-2.0-flash',           // 🥉 Stable alternative
      'gemini-2.0-flash-001',       // Backup
      'gemini-flash-latest',        // Generic latest
    ];

    let lastError = null;

    for (const model of models) {
      try {
        console.log(`🤖 Trying model: ${model}`);
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
              }
            })
          }
        );

        const data = await response.json();
        
        if (data.error) {
          console.log(`❌ Model ${model} failed: ${data.error.message}`);
          lastError = data.error.message;
          continue;
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          console.log(`❌ Model ${model} returned invalid response`);
          lastError = 'Invalid response structure';
          continue;
        }

        // Success!
        console.log(`✅ Success with model: ${model}`);
        return res.json({
          success: true,
          response: data.candidates[0].content.parts[0].text,
          model: model
        });

      } catch (error) {
        console.log(`❌ Model ${model} error: ${error.message}`);
        lastError = error.message;
        continue;
      }
    }

    // All models failed
    throw new Error(`All models failed. Last error: ${lastError}`);

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ 
      error: error.message,
      hint: 'Please check your Gemini API key and quota at https://aistudio.google.com/apikey'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    model: 'gemini-2.5-flash'
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Smart Study Assistant running on port ${PORT}`);
  console.log(`📁 Public directory: ${path.join(__dirname, 'public')}`);
  console.log(`🤖 Using Gemini 2.5 Flash (Best Model)`);
});