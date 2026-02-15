# ⚡ Quick Start Guide - VS Code → GitHub → Render

The fastest way to get your Smart Study Assistant from code to cloud!

## 📦 What You Need

- ✅ VS Code installed
- ✅ Git installed  
- ✅ Node.js installed (v16+)
- ✅ GitHub account
- ✅ Render account (free)
- ✅ Google OAuth credentials
- ✅ Gemini API key

## 🚀 5-Minute Setup

### Step 1: Extract & Open in VS Code (1 min)

```bash
# Extract the zip file
unzip smart-study-assistant.zip

# Open in VS Code
cd smart-study-assistant
code .
```

### Step 2: Install Dependencies (2 min)

Open VS Code terminal (`` Ctrl+` `` or `` Cmd+` ``):

```bash
npm install
```

Wait for installation to complete (~2 minutes).

### Step 3: Configure Environment (1 min)

1. Rename `.env.example` to `.env`
2. Fill in these values:

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=any_random_long_string_here
PORT=3000
```

### Step 4: Test Locally (1 min)

```bash
npm start
```

Open http://localhost:3000 - it works! 🎉

---

## 📤 Push to GitHub (3 minutes)

### Step 1: Initialize Git

In VS Code terminal:

```bash
git init
git add .
git commit -m "Initial commit: Smart Study Assistant"
```

### Step 2: Create GitHub Repo

1. Go to https://github.com/new
2. Name: `smart-study-assistant`
3. Make it **Public** or **Private**
4. **Don't** initialize with README
5. Click "Create repository"

### Step 3: Push Code

Copy the commands from GitHub (or use these):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-study-assistant.git
git push -u origin main
```

✅ Code is now on GitHub!

---

## ☁️ Deploy to Render (5 minutes)

### Step 1: Create Web Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** → **GitHub**
4. Select `smart-study-assistant` repo
5. Click **"Connect"**

### Step 2: Configure Service

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | smart-study-assistant |
| **Region** | Choose closest to you |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 5 variables:

```
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret  
CALLBACK_URL = https://YOUR-APP-NAME.onrender.com/auth/google/callback
SESSION_SECRET = same_random_string_from_local
NODE_ENV = production
```

**Important**: Replace `YOUR-APP-NAME` with the name you chose in Step 2!

### Step 4: Deploy!

1. Click **"Create Web Service"**
2. Wait 2-3 minutes for build
3. You'll see: **"Your service is live at: https://YOUR-APP-NAME.onrender.com"**

### Step 5: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Click your OAuth client ID
4. Add to **"Authorized redirect URIs"**:
   ```
   https://YOUR-APP-NAME.onrender.com/auth/google/callback
   ```
5. Add to **"Authorized JavaScript origins"**:
   ```
   https://YOUR-APP-NAME.onrender.com
   ```
6. Click **"Save"**

---

## ✨ You're Live!

Visit: `https://YOUR-APP-NAME.onrender.com`

Your app is now accessible worldwide! 🌍

---

## 📱 Using Your App

### First Time Setup

1. Visit your Render URL
2. Click **Settings** icon (⚙️)
3. Paste your **Gemini API key**
4. Click **"Save API Key"**

### Upload & Study

1. **Optional**: Sign in with Google
2. Upload a PDF, image, or text file
3. Wait for processing
4. Explore all features:
   - ✅ AI Summary
   - ✅ Question Generator
   - ✅ Flashcards
   - ✅ Viva Practice
   - ✅ Study Timetable
   - ✅ Mind Map

---

## 🔄 Making Updates

### Local Changes

1. Edit files in VS Code
2. Test locally: `npm start`
3. Commit changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

### Automatic Deployment

Render automatically:
1. Detects your push to GitHub
2. Rebuilds your app
3. Deploys new version

**No manual steps needed!** 🚀

---

## 🎓 Getting API Keys

### Gemini API Key (Free)

1. Visit https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key (starts with `AIza...`)
4. Paste in app settings

**Free Tier**: 60 requests/min, 1,500/day

### Google OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create new project: "Study Assistant"
3. Enable Google+ API
4. Create OAuth credentials:
   - Type: Web application
   - Authorized origins: Your Render URL
   - Redirect URI: Your Render URL + `/auth/google/callback`
5. Copy Client ID and Secret

---

## 🆘 Quick Troubleshooting

### Build Fails on Render

**Check**: 
- Build command is `npm install`
- All dependencies in package.json
- No syntax errors in code

**Fix**: Check Render logs for specific error

### Can't Sign In

**Check**:
- OAuth redirect URI matches exactly
- Authorized origins includes your URL
- Using HTTPS (not HTTP)

**Fix**: Update Google Console with correct URLs

### API Key Not Working

**Check**:
- Key is valid and active
- No quotation marks when pasting
- Settings panel saved successfully

**Fix**: Regenerate key in Google AI Studio

### App is Slow

**Why**: Free tier sleeps after 15 min inactivity

**Fix**: 
- Upgrade to paid plan ($7/month)
- Or accept 30-second cold start

---

## 💡 Pro Tips

### Development Workflow

```bash
# Create feature branch
git checkout -b feature-name

# Make changes, test locally
npm start

# Commit and push
git add .
git commit -m "Add feature"
git push origin feature-name

# Merge to main on GitHub
# Render auto-deploys!
```

### VS Code Extensions

Install these for better experience:
- **ESLint**: Code linting
- **Prettier**: Auto-formatting  
- **GitLens**: Git superpowers
- **Live Server**: Quick testing

### Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Terminal | `` Ctrl+` `` | `` Cmd+` `` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Find | `Ctrl+F` | `Cmd+F` |
| Save All | `Ctrl+K S` | `Cmd+K S` |

### Git Best Practices

- Commit often, push daily
- Write clear commit messages
- Use branches for features
- Never commit `.env` file
- Pull before pushing

---

## 📊 Free Tier Limits

### Render Free

✅ **Includes**:
- 750 hours/month (enough for 24/7)
- HTTPS & custom domain
- Automatic deploys
- Build minutes

❌ **Limitations**:
- Sleeps after 15 min inactivity
- 512 MB RAM
- Cold starts (30-60 sec)

### Gemini API Free

✅ **Includes**:
- 60 requests/minute
- 1,500 requests/day
- All features

❌ **Limitations**:
- Rate limits
- No commercial use
- May require phone verification

### GitHub Free

✅ **Includes**:
- Unlimited public repos
- Unlimited private repos
- Actions minutes
- GitHub Pages

---

## 🎯 Next Steps

### Share Your App

- Send link to classmates
- Share on social media
- Get feedback
- Add features based on usage

### Monetize (Optional)

- Add premium features
- Accept donations
- Offer custom versions
- Create API access

### Scale Up

When you outgrow free tier:
- **Render Starter**: $7/month
- **GitHub Pro**: $4/month  
- **Gemini Pay-as-you-go**: As needed

---

## 📚 Resources

### Documentation
- [Main README](README.md) - Complete overview
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup
- [Features](FEATURES.md) - All features explained
- [Deployment](DEPLOYMENT.md) - Advanced deployment

### External Docs
- [Render Docs](https://render.com/docs)
- [Gemini API](https://ai.google.dev/docs)
- [Express.js](https://expressjs.com/)
- [VS Code](https://code.visualstudio.com/docs)

### Support
- GitHub Issues for bugs
- Render Community forum
- Stack Overflow for code help

---

## ✅ Checklist

Before going live:

- [ ] Code works locally
- [ ] Pushed to GitHub
- [ ] Deployed on Render
- [ ] Google OAuth configured
- [ ] Environment variables set
- [ ] Can sign in
- [ ] Can upload files
- [ ] AI features working
- [ ] Tested all tabs

---

**Congratulations!** You've gone from code to cloud in under 15 minutes! 🎉

Your AI-powered study assistant is now live and helping students worldwide!

Need help? Check the documentation or open an issue on GitHub.

**Happy studying!** 📚✨

---

**Made with ❤️ for students**

Version: 1.0.0  
Last Updated: February 2026
