# 🎯 Complete Setup Guide - Smart Study Assistant

This comprehensive guide will help you set up the Smart Study Assistant from scratch.

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Installing Node.js](#installing-nodejs)
3. [Getting the Project](#getting-the-project)
4. [Installing Dependencies](#installing-dependencies)
5. [Setting Up Google OAuth](#setting-up-google-oauth)
6. [Getting Gemini API Key](#getting-gemini-api-key)
7. [Configuration](#configuration)
8. [Running the Application](#running-the-application)
9. [Using VS Code](#using-vs-code)
10. [Git & GitHub Setup](#git--github-setup)
11. [Common Issues](#common-issues)

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space
- **Internet**: Stable connection required

### Software Requirements
- Node.js v16 or higher
- npm (comes with Node.js)
- VS Code (recommended)
- Git (for version control)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Installing Node.js

### Windows

1. **Download Node.js**
   - Visit https://nodejs.org/
   - Download the LTS (Long Term Support) version
   - Choose the Windows Installer (.msi)

2. **Install**
   - Run the downloaded installer
   - Click "Next" through the installation wizard
   - Accept the license agreement
   - Use default installation location
   - Check "Automatically install necessary tools"
   - Click "Install"

3. **Verify Installation**
   ```bash
   # Open Command Prompt or PowerShell
   node --version
   # Should show: v16.x.x or higher
   
   npm --version
   # Should show: 8.x.x or higher
   ```

### macOS

1. **Using Homebrew (Recommended)**
   ```bash
   # Install Homebrew if not installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Node.js
   brew install node
   
   # Verify
   node --version
   npm --version
   ```

2. **Using Official Installer**
   - Visit https://nodejs.org/
   - Download macOS Installer (.pkg)
   - Run installer and follow prompts

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verify
node --version
npm --version

# If version is too old, use NodeSource:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Getting the Project

### Option 1: Extract from ZIP

1. Extract the `smart-study-assistant.zip` file
2. Open terminal/command prompt
3. Navigate to the extracted folder:
   ```bash
   cd path/to/smart-study-assistant
   ```

### Option 2: Clone from GitHub (if available)

```bash
git clone https://github.com/YOUR_USERNAME/smart-study-assistant.git
cd smart-study-assistant
```

---

## Installing Dependencies

### Step 1: Navigate to Project

```bash
cd smart-study-assistant
```

### Step 2: Install Packages

```bash
npm install
```

This will install:
- express (web server)
- multer (file uploads)
- pdf-parse (PDF processing)
- tesseract.js (OCR)
- passport (authentication)
- passport-google-oauth20 (Google OAuth)
- express-session (session management)
- dotenv (environment variables)
- cors (cross-origin requests)
- uuid (unique identifiers)

**Installation Time**: 2-5 minutes depending on internet speed

### Troubleshooting Installation

**Error: "npm not found"**
- Node.js not installed properly
- Restart terminal after installation
- Check PATH environment variable

**Error: "EACCES: permission denied"**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

**Error: "gyp ERR!"**
- Usually safe to ignore if other packages install
- Install build tools if persistent:
  - Windows: `npm install --global --production windows-build-tools`
  - macOS: `xcode-select --install`
  - Linux: `sudo apt-get install build-essential`

---

## Setting Up Google OAuth

Google OAuth allows users to sign in with their Google account.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Enter project name: "Smart Study Assistant"
5. Click "Create"

### Step 2: Enable Google+ API

1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it
4. Click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (for testing with any Google account)
3. Click "Create"
4. Fill in required fields:
   - **App name**: Smart Study Assistant
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click "Save and Continue"
6. On Scopes page, click "Add or Remove Scopes"
7. Select:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Click "Update" → "Save and Continue"
9. Add test users (your email and any testers)
10. Click "Save and Continue"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Enter name: "Study Assistant Web Client"
5. Under "Authorized JavaScript origins", add:
   ```
   http://localhost:3000
   ```
6. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3000/auth/google/callback
   ```
7. Click "Create"
8. **IMPORTANT**: Copy these values:
   - Client ID (looks like: 123456789-xxxxx.apps.googleusercontent.com)
   - Client Secret (looks like: GOCSPX-xxxxx)

---

## Getting Gemini API Key

The Gemini API powers all AI features.

### Step 1: Access Google AI Studio

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create API Key

1. Click "Create API Key"
2. Select your Google Cloud project (or create new)
3. Click "Create API Key in existing project"
4. **Copy your API key** (looks like: AIzaSyXXXXXXXXXXXXXXXXX)

### Step 3: Store API Key Securely

**IMPORTANT**: 
- Never share your API key
- Never commit it to Git
- Never post it online
- You'll enter this in the app settings (not in code)

---

## Configuration

### Step 1: Create Environment File

```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Edit .env File

Open `.env` in your text editor and fill in:

```env
# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
CALLBACK_URL=http://localhost:3000/auth/google/callback

# Session Secret (generate a random string)
SESSION_SECRET=your_super_secret_random_string_here_make_it_long

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Generating SESSION_SECRET

**Option 1: Online Generator**
- Visit https://randomkeygen.com/
- Copy a "Fort Knox Password"

**Option 2: Command Line**
```bash
# macOS/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

**Option 3: Manual**
- Type random characters (at least 32 characters)
- Mix letters, numbers, symbols
- Example: `Kj8s#mP9xL2vN4qW7eR5tY6uI3oP0aS1dF`

---

## Running the Application

### Step 1: Start the Server

```bash
npm start
```

You should see:
```
🚀 Smart Study Assistant running on http://localhost:3000
```

### Step 2: Open in Browser

Visit: http://localhost:3000

### Step 3: Configure Gemini API

1. Click the settings icon (⚙️) in the top right
2. Paste your Gemini API key
3. Click "Save API Key"
4. Close settings panel

### Step 4: Test the App

1. Click "Sign in with Google" (optional)
2. Try uploading a test file:
   - Create a text file with some notes
   - Or use a PDF
3. Wait for processing
4. Explore the features!

### Development Mode (Auto-reload)

For development with automatic restart on file changes:

```bash
npm run dev
```

This uses `nodemon` to watch for file changes.

---

## Using VS Code

### Step 1: Install VS Code

Download from https://code.visualstudio.com/

### Step 2: Open Project

```bash
# From terminal
code .

# Or from VS Code
File → Open Folder → Select smart-study-assistant
```

### Step 3: Recommended Extensions

Install these extensions:
1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Live Server** - Local server (optional)
4. **GitLens** - Git integration
5. **Path Intellisense** - Autocomplete paths

### Step 4: Integrated Terminal

- Open: View → Terminal (or `` Ctrl+` ``)
- Run commands directly in VS Code
- Multiple terminals supported

### Step 5: Running from VS Code

1. Open integrated terminal
2. Type `npm start`
3. Access at http://localhost:3000

---

## Git & GitHub Setup

### Step 1: Install Git

**Windows**: Download from https://git-scm.com/
**macOS**: `brew install git` or comes with Xcode
**Linux**: `sudo apt install git`

### Step 2: Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Repository

```bash
cd smart-study-assistant
git init
git add .
git commit -m "Initial commit"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `smart-study-assistant`
3. Choose Public or Private
4. Don't initialize with README (you already have files)
5. Click "Create repository"

### Step 5: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-study-assistant.git
git branch -M main
git push -u origin main
```

### Step 6: Future Updates

```bash
# After making changes
git add .
git commit -m "Description of changes"
git push
```

---

## Common Issues

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Issue: Cannot Find Module

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: API Key Not Working

**Symptoms**: 
- "API key not set" error
- Features don't work

**Solution**:
1. Verify key is correct
2. Check if key has restrictions
3. Try regenerating key in AI Studio
4. Clear browser cache/localStorage

### Issue: Google OAuth Fails

**Error**: `redirect_uri_mismatch`

**Solution**:
1. Check callback URL in `.env` matches Google Console exactly
2. Ensure no typos
3. Clear browser cache
4. Try http://127.0.0.1:3000 instead of localhost

### Issue: File Upload Fails

**Symptoms**:
- Upload doesn't start
- "No file uploaded" error

**Solution**:
1. Check file size (< 10MB)
2. Verify file format is supported
3. Check uploads folder exists and is writable
4. Review server logs

### Issue: OCR Not Working

**Symptoms**:
- Images don't extract text
- Takes too long

**Solution**:
1. Ensure image is clear and high resolution
2. Text should be printed (not handwritten)
3. Check internet connection (downloads Tesseract data first time)
4. Be patient - OCR can take 30-60 seconds

---

## Next Steps

### 1. Test All Features

- ✅ Upload different file types
- ✅ Generate summaries
- ✅ Create questions
- ✅ Try flashcards
- ✅ Use viva mode
- ✅ Generate study plan
- ✅ Create mind map

### 2. Customize

- Change colors in `styles.css`
- Modify prompts in `app.js`
- Add new features

### 3. Deploy (Optional)

Follow `DEPLOYMENT.md` for hosting on Render

### 4. Share

- Share with classmates
- Get feedback
- Improve based on usage

---

## Getting Help

### Documentation
- README.md - Overview and quick start
- DEPLOYMENT.md - Hosting guide
- This file - Detailed setup

### Online Resources
- Node.js docs: https://nodejs.org/docs
- Express docs: https://expressjs.com/
- Gemini API docs: https://ai.google.dev/docs

### Support Channels
- Check existing GitHub issues
- Create new issue with:
  - Error message
  - Steps to reproduce
  - Your environment (OS, Node version)

---

## Checklist

Before you start using the app:

- [ ] Node.js installed and verified
- [ ] Project dependencies installed
- [ ] Google OAuth configured
- [ ] Gemini API key obtained
- [ ] .env file created and configured
- [ ] Server starts without errors
- [ ] App accessible at http://localhost:3000
- [ ] Can sign in with Google
- [ ] Can save API key in settings
- [ ] Can upload a test file
- [ ] AI features working

---

**Congratulations!** You're all set up! 🎉

Start uploading your study materials and let AI help you learn better!

For any questions or issues, refer to the troubleshooting section or create an issue on GitHub.

Happy studying! 📚✨
