# Quick Deployment Checklist - EventfulEMS

## ✅ What's Been Fixed

1. **Removed invalid vite build from API** - API is now properly configured (no build step needed)
2. **Updated build scripts** - `npm run build` now correctly builds the entire project
3. **render.yaml optimized** - Uses the correct build command
4. **Client builds successfully** - No linting errors, production build works
5. **Full deployment guide created** - See DEPLOYMENT.md for detailed instructions

## 🚀 Deploy to Render in 3 Steps

### Step 1: Prepare MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database (or use existing)
3. Create a database user
4. Copy your connection string: `mongodb+srv://username:password@cluster.mongodb.net/eventfulems?retryWrites=true&w=majority`

### Step 2: Connect to Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the branch (main/master)

### Step 3: Configure Environment Variables in Render
Set these variables:
```
NODE_ENV = production
MONGO_DB_NAME = eventfulems
MONGO_URL = [Your MongoDB connection string from Step 1]
CLIENT_ORIGIN = [Auto-fills after first deploy, e.g., https://yourapp.onrender.com]
```

**Build Command**: `npm run build`
**Start Command**: `npm start`

That's it! Render will:
- ✅ Install dependencies
- ✅ Build the client (creates dist folder)
- ✅ Start the API server
- ✅ Serve both frontend and backend from one domain

## 🧪 Test Before Deploying

```bash
# Build locally to verify everything works
npm run build

# This should:
# - Install dependencies ✅
# - Build client to client/dist/ ✅
# - Create no errors ✅
```

## 📋 Deployment Checklist

- [ ] MongoDB connection string ready (MONGO_URL)
- [ ] Render account created
- [ ] GitHub repository pushed with latest changes
- [ ] `npm run build` works locally without errors
- [ ] Environment variables configured in Render
- [ ] Build succeeds on Render (check logs)
- [ ] App loads in browser (https://yourapp.onrender.com)
- [ ] Can register/login
- [ ] Can create and view events

## 🔧 Troubleshooting

| Error | Fix |
|-------|-----|
| MONGO_URL is missing | Add MONGO_URL variable in Render |
| Build fails: "Cannot find module" | Verify `npm run build` works locally |
| App crashes after deploy | Check Render logs for MongoDB errors |
| Images not loading | Check API logs, ensure /uploads dir exists |

## 📚 Full Guide
See `DEPLOYMENT.md` for detailed instructions, troubleshooting, and performance tips.

---

**Your app is ready to deploy!** 🎉
