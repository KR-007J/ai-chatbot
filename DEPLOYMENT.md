# 🚀 Deployment Guide - Render Platform

This guide will walk you through deploying your Smart Study Assistant to Render.

## Prerequisites

- A GitHub account
- A Render account (sign up at https://render.com)
- Your project pushed to GitHub
- Google OAuth credentials
- Gemini API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

First, initialize git and push to GitHub:

```bash
cd smart-study-assistant
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-study-assistant.git
git push -u origin main
```

### 2. Create a Render Web Service

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `smart-study-assistant` repository

### 3. Configure Build Settings

In the Render dashboard:

**Basic Settings:**
- Name: `smart-study-assistant` (or your preferred name)
- Region: Choose closest to your users
- Branch: `main`
- Root Directory: Leave empty

**Build & Deploy:**
- Build Command: `npm install`
- Start Command: `npm start`

### 4. Set Environment Variables

Click "Advanced" and add these environment variables:

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
CALLBACK_URL=https://YOUR_APP_NAME.onrender.com/auth/google/callback
SESSION_SECRET=generate_a_long_random_string_here
NODE_ENV=production
PORT=3000
```

**Important Notes:**
- Replace `YOUR_APP_NAME` with your actual Render app name
- Generate a secure random string for SESSION_SECRET
- Keep your Google credentials secure

### 5. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Add to "Authorized redirect URIs":
   - `https://YOUR_APP_NAME.onrender.com/auth/google/callback`
6. Add to "Authorized JavaScript origins":
   - `https://YOUR_APP_NAME.onrender.com`
7. Click "Save"

### 6. Deploy

1. Click "Create Web Service"
2. Wait for the build to complete (first build takes 2-5 minutes)
3. Once deployed, your app will be live at:
   - `https://YOUR_APP_NAME.onrender.com`

### 7. Verify Deployment

1. Visit your app URL
2. Test file upload
3. Try Google sign-in
4. Upload a test document
5. Generate summary and questions

## Free Tier Limitations

Render's free tier includes:
- 750 hours/month of runtime
- Service sleeps after 15 minutes of inactivity
- Cold starts take 30-60 seconds
- 512 MB RAM
- 0.1 CPU

**Note**: Free services spin down after inactivity. First request may be slow.

## Upgrading to Paid Plan

For production use, consider upgrading:
- No cold starts
- More resources
- Custom domains
- Better performance

## Troubleshooting

### Build Fails

**Error: Cannot find module**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Solution:**
```bash
npm install --save <missing-package>
git add package.json
git commit -m "Add missing dependency"
git push
```

### App Crashes After Deploy

**Check Logs:**
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for error messages

**Common Issues:**
- Missing environment variables
- Incorrect PORT configuration
- File path issues (use absolute paths)

### Google OAuth Not Working

**Error: redirect_uri_mismatch**
1. Verify callback URL in Render matches Google Console exactly
2. Ensure no trailing slashes
3. Must use HTTPS (HTTP not allowed in production)

**Fix:**
```
Google Console: https://your-app.onrender.com/auth/google/callback
Render CALLBACK_URL: https://your-app.onrender.com/auth/google/callback
```

### File Uploads Not Working

**Issue**: Render's file system is ephemeral

**Solution**: Files are automatically cleaned up. The app already handles this, but for persistence:
- Use cloud storage (AWS S3, Google Cloud Storage)
- Or process and delete immediately (current approach)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| GOOGLE_CLIENT_ID | Yes | From Google Cloud Console |
| GOOGLE_CLIENT_SECRET | Yes | From Google Cloud Console |
| CALLBACK_URL | Yes | Your Render URL + /auth/google/callback |
| SESSION_SECRET | Yes | Random secure string |
| NODE_ENV | Yes | Set to 'production' |
| PORT | No | Default: 3000 (Render sets automatically) |

## Performance Optimization

### Enable Caching

Add to `server.js`:
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### Compress Responses

Install compression:
```bash
npm install compression
```

Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### Monitor Performance

Use Render's built-in metrics:
- CPU usage
- Memory usage
- Request count
- Response time

## Keeping Your Service Active

Free tier apps sleep after 15 minutes. To keep active:

### Option 1: External Monitoring
- Use UptimeRobot (free)
- Ping your app every 5 minutes

### Option 2: Self Ping
Add to `server.js`:
```javascript
// Keep alive ping (only on free tier)
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    fetch('https://your-app.onrender.com')
      .catch(err => console.log('Keep-alive ping failed'));
  }, 14 * 60 * 1000); // Every 14 minutes
}
```

## Custom Domain (Paid Plans)

1. Purchase domain from registrar
2. In Render dashboard: Settings → Custom Domains
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate auto-generated

## Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Render automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys new version
```

## Rollback

If deployment fails:
1. Go to Render dashboard
2. Click "Events" tab
3. Find previous successful deploy
4. Click "Redeploy"

## Backup Strategy

### Database (If Added Later)
- Use Render PostgreSQL
- Enable automated backups

### Code
- GitHub is your backup
- Tag releases: `git tag v1.0.0`

## Security Checklist

- ✅ HTTPS enabled (automatic on Render)
- ✅ Environment variables secure
- ✅ No secrets in code
- ✅ CORS configured
- ✅ Rate limiting (add if needed)
- ✅ Input validation
- ✅ Session security

## Cost Estimation

**Free Tier:**
- $0/month
- Limited resources
- Cold starts

**Starter Plan:**
- $7/month
- No cold starts
- Better performance
- 512 MB RAM

**Standard Plan:**
- $25/month
- 2 GB RAM
- Better CPU
- Recommended for production

## Monitoring & Logs

### View Logs
```bash
# From Render dashboard
Dashboard → Your Service → Logs

# Real-time logs appear as app runs
```

### Error Tracking
Consider adding:
- Sentry (error tracking)
- LogRocket (session replay)
- New Relic (performance monitoring)

## Support

**Render Support:**
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

**App Issues:**
- Check logs first
- Review environment variables
- Test locally with production settings

## Next Steps

After deployment:
1. ✅ Test all features
2. ✅ Share with users
3. ✅ Monitor performance
4. ✅ Gather feedback
5. ✅ Plan improvements

## Updating Your App

```bash
# Make changes locally
# Test thoroughly

# Commit and push
git add .
git commit -m "Add new feature"
git push

# Render deploys automatically
# Check deployment status in dashboard
```

---

**Congratulations!** Your Smart Study Assistant is now live! 🎉

Remember to:
- Keep dependencies updated
- Monitor usage and performance
- Backup important data
- Scale when needed

For questions or issues, check the main README.md or open an issue on GitHub.
