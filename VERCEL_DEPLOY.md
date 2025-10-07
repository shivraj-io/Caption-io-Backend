 # Deploying Caption.io Backend to Vercel

This guide will help you deploy your Express.js backend to Vercel.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- MongoDB Atlas account (for cloud database)
- Git repository on GitHub/GitLab/Bitbucket
- All API keys ready (Gemini AI, ImageKit, etc.)

---

## 🚀 Quick Deploy Steps

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you don't have one)
3. Go to **Database Access** → Create a database user
4. Go to **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
5. Get your connection string:
   - Click **Connect** → **Connect your application**
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `caption-io`

### Step 2: Push Code to GitHub

```bash
cd "c:/Users/Asus/Documents/Sheriyans coding school/BACKEND/Caption-io/backend"
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 3: Deploy on Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Select your Git provider (GitHub)
   - Import the `Caption-io` repository

3. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend` (click "Edit" and select the backend folder)
   - **Build Command:** Leave empty or use `npm install`
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

4. **Environment Variables:**
   Click **"Environment Variables"** and add these:

   | Name | Value | Description |
   |------|-------|-------------|
   | `MONGODB_URL` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Generate random string | Min 32 characters, use https://randomkeygen.com |
   | `FRONTEND_URL` | `https://your-site.netlify.app` | Your deployed frontend URL |
   | `GEMINI_API_KEY` | Your Gemini API key | For AI caption generation |
   | `IMAGEKIT_PUBLIC_KEY` | Your ImageKit public key | For image uploads |
   | `IMAGEKIT_PRIVATE_KEY` | Your ImageKit private key | For image uploads |
   | `IMAGEKIT_URL_ENDPOINT` | Your ImageKit URL endpoint | For image uploads |
   | `NODE_ENV` | `production` | Environment mode |

   **How to get API keys:**
   - **Gemini AI:** https://makersuite.google.com/app/apikey
   - **ImageKit:** https://imagekit.io/dashboard (Sign up → Dashboard → Developer Options)

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - You'll get a URL like: `https://caption-io-backend.vercel.app`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to backend directory
cd "c:/Users/Asus/Documents/Sheriyans coding school/BACKEND/Caption-io/backend"

# Deploy (follow prompts)
vercel

# Or deploy directly to production
vercel --prod
```

**Set environment variables via CLI:**
```bash
vercel env add MONGODB_URL
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
vercel env add GEMINI_API_KEY
vercel env add IMAGEKIT_PUBLIC_KEY
vercel env add IMAGEKIT_PRIVATE_KEY
vercel env add IMAGEKIT_URL_ENDPOINT
vercel env add NODE_ENV
```

---

## 🔧 Configuration Files Explained

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

This tells Vercel:
- Use Node.js runtime
- Entry point is `server.js`
- Route all requests to `server.js`

---

## 🔗 Update Frontend with Backend URL

After deployment, update your frontend's environment variable:

1. Go to **Netlify Dashboard** → Your site → **Site settings** → **Environment variables**
2. Update `VITE_API_URL` to your Vercel backend URL:
   ```
   VITE_API_URL=https://caption-io-backend.vercel.app
   ```
3. Trigger a new deployment (or it will auto-deploy)

---

## ✅ Test Your Deployment

### 1. Health Check
Open in browser:
```
https://your-backend-url.vercel.app/
```

Should return:
```json
{
  "message": "API is running",
  "status": "healthy"
}
```

### 2. Debug Routes
```
https://your-backend-url.vercel.app/api/debug/routes
```

Should show all available routes.

### 3. Test API Endpoints

**Register User:**
```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Contact Form:**
```bash
curl -X POST https://your-backend-url.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hello"}'
```

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
- Check `package.json` has all dependencies
- Redeploy: `vercel --prod`

### Issue: MongoDB connection fails

**Solution:**
1. Verify `MONGODB_URL` is correct in Vercel environment variables
2. Check MongoDB Atlas **Network Access** allows `0.0.0.0/0`
3. Ensure database user has correct permissions
4. Check connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/caption-io?retryWrites=true&w=majority
   ```

### Issue: CORS errors from frontend

**Solution:**
1. Make sure `FRONTEND_URL` environment variable in Vercel matches your Netlify URL exactly
2. Check Vercel logs: `vercel logs`
3. Update CORS settings in `src/app.js` (already configured to accept your frontend URL)

### Issue: Function timeout

**Solution:**
- Vercel free tier has 10-second timeout for serverless functions
- If AI caption generation takes longer, consider upgrading to Pro plan
- Or use a different platform like Railway/Render for longer timeouts

### Issue: Environment variables not working

**Solution:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Make sure variables are added to **Production** environment
3. Redeploy after adding variables

### Check Logs
```bash
# View real-time logs
vercel logs --follow

# View logs for specific deployment
vercel logs [deployment-url]
```

---

## 📊 Vercel Free Tier Limits

- ✅ Serverless Functions: 100 GB-hours/month
- ✅ Bandwidth: 100 GB/month
- ✅ Invocations: 100k/month
- ✅ Build minutes: 6000 minutes/month
- ⚠️ Function timeout: 10 seconds (Pro: 60s)
- ✅ Automatic HTTPS
- ✅ Custom domains

This is sufficient for small to medium projects!

---

## 🔄 Continuous Deployment

Once connected, Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Shows deployment status in GitHub
- Provides deployment logs

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed successfully on Vercel
- [ ] MongoDB Atlas connection working
- [ ] Health check endpoint returns success
- [ ] All environment variables configured
- [ ] Frontend `VITE_API_URL` updated with Vercel URL
- [ ] Frontend redeployed with new backend URL
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test caption generation
- [ ] Test image upload
- [ ] Test contact form

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** (it's in `.gitignore`)
2. **Use strong JWT_SECRET** (min 32 characters)
3. **Rotate API keys** regularly
4. **Enable MongoDB Atlas IP whitelist** after testing
5. **Use environment variables** for all secrets
6. **Enable HTTPS only** (Vercel does this automatically)

---

## 📱 Useful Commands

```bash
# Check deployment status
vercel ls

# View project details
vercel inspect

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Redeploy
vercel --prod

# Remove deployment
vercel rm [deployment-url]
```

---

## 🌐 Custom Domain (Optional)

1. Go to **Vercel Dashboard** → Project → **Settings** → **Domains**
2. Add your custom domain (e.g., `api.captionio.com`)
3. Update DNS records as instructed
4. Update `VITE_API_URL` in frontend to use custom domain

---

## 🆘 Need More Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/frameworks/node)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## 🎉 Success!

If everything works:
1. Your backend should be live at: `https://your-project.vercel.app`
2. Your frontend should connect successfully
3. All features (auth, captions, uploads, contact) should work

**Next Steps:**
- Test all features thoroughly
- Monitor usage in Vercel dashboard
- Set up error tracking (optional: Sentry)
- Add custom domain (optional)

Happy deploying! 🚀
