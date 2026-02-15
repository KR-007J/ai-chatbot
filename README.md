# 🎓 Smart Study Assistant - AI-Powered Learning Platform

An intelligent study companion powered by Google's Gemini AI that transforms your notes into interactive learning experiences.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

## ✨ Features

### 📚 Core Features
- **Smart File Upload**: Upload PDF, images, and text files with drag-and-drop
- **AI-Powered Summarization**: Get concise summaries of your study material
- **Question Generator**: Create practice questions at easy, medium, and hard difficulty levels
- **Interactive Flashcards**: Visual flashcards with flip animation for quick revision
- **Viva Practice Mode**: Simulated oral examination with model answers
- **Personalized Study Plans**: Generate custom study timetables based on your schedule
- **Mind Mapping**: Visual representation of concepts and their relationships

### 🎨 UI/UX Features
- **Vibrant Gradient UI**: Modern, eye-catching design with smooth gradients
- **Micro Animations**: Delightful animations throughout the interface
- **Nano Interactions**: Subtle hover effects and transitions
- **Animated Background**: Dynamic gradient orbs creating an immersive experience
- **Particle System**: Floating particles for depth and visual interest
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes for extended study sessions

### 🔐 Authentication
- **Google OAuth 2.0**: Secure sign-in with your Google account
- **Session Management**: Persistent login across sessions

### 🤖 AI Integration
- **Gemini AI**: Powered by Google's latest language model
- **Free Tier Friendly**: Uses the free Gemini API
- **Privacy First**: API keys stored locally, never on servers

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Console account (for OAuth)
- Gemini API key (free from Google AI Studio)

### Installation

1. **Clone or extract the project**
```bash
cd smart-study-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_random_secret_key
PORT=3000
```

4. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🔑 Getting API Keys

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. In the app, click the settings icon (⚙️) and paste your API key
5. Click "Save API Key"

**Note**: The Gemini API key is stored in your browser's localStorage and never sent to the server.

## 📁 Project Structure

```
smart-study-assistant/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Vibrant CSS with animations
│   └── app.js              # Frontend JavaScript logic
├── uploads/                # Temporary file uploads (auto-created)
├── server.js               # Express server with OAuth
├── package.json            # Dependencies
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Template for environment variables
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Server framework
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **Tesseract.js**: OCR for images
- **Passport.js**: Google OAuth authentication
- **Express Session**: Session management

### Frontend
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Advanced animations and gradients
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

### AI
- **Gemini Pro**: Google's generative AI model

## 🎮 How to Use

### 1. Sign In (Optional but Recommended)
- Click "Sign in with Google" in the navigation bar
- Authorize the application

### 2. Set Up API Key
- Click the settings icon (⚙️)
- Enter your Gemini API key
- Click "Save API Key"

### 3. Upload Your Notes
- Drag and drop your file or click to browse
- Supported formats: PDF, PNG, JPG, JPEG, TXT
- Wait for processing (OCR may take a moment for images)

### 4. Explore Features
- **Summary**: Automatically generated overview
- **Q&A Generator**: Create practice questions
- **Flashcards**: Interactive study cards
- **Viva Practice**: Mock oral examination
- **Study Plan**: Personalized timetable
- **Mind Map**: Visual concept mapping

## 🌐 Deployment

### Deploy to Render

1. **Prepare for deployment**
```bash
# Ensure all dependencies are in package.json
npm install --production
```

2. **Create a new Web Service on Render**
- Connect your GitHub repository
- Build Command: `npm install`
- Start Command: `npm start`

3. **Set Environment Variables in Render**
- Add all variables from `.env` file
- Update `CALLBACK_URL` to your Render URL
- Example: `https://your-app.onrender.com/auth/google/callback`

4. **Update Google OAuth**
- Add your Render URL to authorized redirect URIs
- Update authorized JavaScript origins

### Deploy to Other Platforms

The app can be deployed to:
- **Heroku**: Add Procfile with `web: node server.js`
- **Railway**: Automatic detection of Node.js
- **Vercel/Netlify**: Requires serverless function adaptation
- **DigitalOcean App Platform**: Direct deployment from GitHub

## 🔧 Configuration

### File Upload Limits
Edit `server.js`:
```javascript
limits: { fileSize: 10 * 1024 * 1024 } // 10MB (adjust as needed)
```

### Supported File Types
Edit `server.js`:
```javascript
const allowedTypes = /pdf|png|jpg|jpeg|txt/; // Add more types
```

### API Rate Limits
The free Gemini API has the following limits:
- 60 requests per minute
- 1,500 requests per day
- Handle rate limits gracefully in production

## 🎨 Customization

### Change Color Scheme
Edit CSS variables in `public/styles.css`:
```css
:root {
    --primary: #6366f1;        /* Main color */
    --secondary: #ec4899;      /* Accent color */
    --accent: #8b5cf6;         /* Additional accent */
    /* ... more variables */
}
```

### Modify Animations
Adjust animation speeds in `public/styles.css`:
```css
@keyframes float {
    /* Modify timing and transform values */
}
```

### Add New Features
1. Add HTML in `public/index.html`
2. Style in `public/styles.css`
3. Logic in `public/app.js`
4. Backend endpoint in `server.js` (if needed)

## 🐛 Troubleshooting

### Common Issues

**Q: "No file uploaded" error**
- Check file size (default limit: 10MB)
- Verify file format is supported
- Check server logs for details

**Q: "API key not set" error**
- Click settings icon and enter your Gemini API key
- Verify the key is valid at Google AI Studio

**Q: "Failed to extract text from PDF"**
- Ensure PDF is not password-protected
- Try converting PDF to images first
- Some PDFs may have non-standard encoding

**Q: OCR not working on images**
- Ensure image is clear and high-resolution
- Text should be in English (or adjust Tesseract language)
- Processing may take 10-30 seconds for large images

**Q: Google authentication not working**
- Verify OAuth credentials in `.env`
- Check authorized redirect URIs match exactly
- Ensure OAuth consent screen is configured

## 📝 Best Practices

### For Students
- Upload clear, well-organized notes
- Use the study plan feature to stay on track
- Practice with viva mode before exams
- Review flashcards daily for retention

### For Developers
- Keep API keys secure and never commit `.env`
- Implement rate limiting in production
- Add error logging for debugging
- Consider adding user database for persistence
- Implement file cleanup for old uploads
- Add analytics to track feature usage

## 🔒 Security Considerations

- API keys are stored in browser localStorage (client-side only)
- Uploaded files are temporarily stored and should be deleted after processing
- Session secrets should be strong random strings
- Use HTTPS in production
- Implement CORS properly for production
- Add rate limiting to prevent abuse
- Validate and sanitize all user inputs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for the powerful language model
- Tesseract.js for OCR capabilities
- Font Awesome for beautiful icons
- The open-source community for amazing libraries

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

## 🚀 Future Enhancements

- [ ] Add more AI models (OpenAI, Anthropic)
- [ ] Implement user database for saving notes
- [ ] Add collaboration features
- [ ] Export notes to various formats
- [ ] Spaced repetition algorithm for flashcards
- [ ] Voice input for notes
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Progress tracking and analytics
- [ ] Integration with note-taking apps

## 📊 Performance Tips

- Keep notes under 50,000 characters for best AI performance
- Use specific, well-formatted notes for better summaries
- Break large documents into smaller sections
- Clear browser cache if experiencing issues

---

Made with ❤️ for students by students

**Version**: 1.0.0  
**Last Updated**: February 2026
