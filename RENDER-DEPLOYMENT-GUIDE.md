# 🚀 Render Deployment Guide for Node.js Backend

## 📋 Prerequisites

1. **Render Account** - You've already created one at https://dashboard.render.com/
2. **MongoDB Atlas Account** - We'll use MongoDB Atlas for the database
3. **GitHub Repository** - To deploy from

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### 1.2 Configure Database Access
1. **Database Access** → **Add New Database User**
   - Username: `family_finance_user`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: **Read and write to any database**

### 1.3 Configure Network Access
1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere**: `0.0.0.0/0`
3. Click **Confirm**

### 1.4 Get Connection String
1. **Clusters** → **Connect** → **Connect your application**
2. Copy the connection string (looks like):
   ```
   mongodb+srv://family_finance_user:<password>@cluster0.xxxxx.mongodb.net/family_finance
   ```
3. Replace `<password>` with your actual password

---

## 📁 Step 2: Prepare Your Code

### 2.1 Create GitHub Repository
1. Create a new repository on GitHub
2. Upload your `server/` folder contents to the repository

### 2.2 Repository Structure Should Be:
```
your-repo/
├── package.json
├── server.js
├── render.yaml
├── .env.example
├── models/
├── routes/
└── README.md
```

---

## 🚀 Step 3: Deploy to Render

### 3.1 Connect GitHub Repository
1. Go to https://dashboard.render.com/
2. Click **New** → **Web Service**
3. **Connect GitHub** and select your repository
4. **Branch**: `main` (or your default branch)

### 3.2 Configure Service Settings
```
Name: family-finance-api
Environment: Node
Region: Oregon (US West) - or closest to you
Branch: main
Build Command: npm install
Start Command: npm start
```

### 3.3 Set Environment Variables
Click **Advanced** and add these environment variables:

```
NODE_ENV = production
MONGODB_URI = mongodb+srv://family_finance_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/family_finance
JWT_SECRET = your_super_secret_jwt_key_here_make_it_long_and_random
FRONTEND_URL = https://finacasfamiliar.com
```

**Important**: 
- Replace `YOUR_PASSWORD` with your MongoDB password
- Generate a strong JWT_SECRET (at least 32 characters)

### 3.4 Deploy
1. Click **Create Web Service**
2. Render will automatically build and deploy your app
3. Wait for deployment to complete (usually 2-5 minutes)

---

## 🔧 Step 4: Update Frontend Configuration

### 4.1 Get Your Render URL
After deployment, you'll get a URL like:
```
https://family-finance-api-xxxx.onrender.com
```

### 4.2 Update Frontend API URLs
In your React app, update these files:

**src/contexts/AuthContext.tsx:**
```typescript
const API_BASE_URL = 'https://family-finance-api-xxxx.onrender.com';
```

**src/contexts/DataContext.tsx:**
```typescript
const API_BASE_URL = 'https://family-finance-api-xxxx.onrender.com';
```

### 4.3 Rebuild and Deploy Frontend
```bash
npm run build
# Upload dist/ contents to your hosting (HostGator, Netlify, etc.)
```

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Test API Health
Visit: `https://your-render-app.onrender.com/health`

Should return:
```json
{
  "status": "OK",
  "message": "Family Finance API is running",
  "timestamp": "2024-01-XX..."
}
```

### 5.2 Test Categories Endpoint
Visit: `https://your-render-app.onrender.com/api/categories`

Should return:
```json
{
  "message": "Categories retrieved successfully",
  "categories": [...]
}
```

### 5.3 Test Frontend
1. Visit your frontend URL
2. Try to register a new account
3. Login with the account
4. Add an expense
5. Verify data persists

---

## 🔒 Step 6: Security & Production Setup

### 6.1 Environment Variables Security
- ✅ Never commit `.env` files to GitHub
- ✅ Use strong, unique JWT secrets
- ✅ Use secure MongoDB passwords
- ✅ Enable MongoDB IP whitelisting in production

### 6.2 CORS Configuration
Your backend is configured to accept requests from:
- `https://finacasfamiliar.com` (your frontend)
- Update `FRONTEND_URL` if your domain changes

### 6.3 Rate Limiting
- ✅ 100 requests per 15 minutes per IP
- ✅ Prevents API abuse
- ✅ Automatically configured

---

## 📊 Step 7: Monitoring & Maintenance

### 7.1 Render Dashboard
- **Logs**: View real-time application logs
- **Metrics**: Monitor CPU, memory usage
- **Deployments**: Track deployment history

### 7.2 MongoDB Atlas Monitoring
- **Database**: Monitor database performance
- **Alerts**: Set up alerts for issues
- **Backups**: Automatic backups enabled

---

## 🆘 Troubleshooting

### Common Issues:

**1. Build Fails**
```
Error: Cannot find module 'express'
```
**Solution**: Ensure `package.json` is in the root directory

**2. Database Connection Fails**
```
Error: MongoNetworkError
```
**Solution**: 
- Check MongoDB connection string
- Verify database user credentials
- Ensure IP whitelist includes `0.0.0.0/0`

**3. CORS Errors**
```
Error: CORS policy blocked
```
**Solution**: Update `FRONTEND_URL` environment variable

**4. JWT Errors**
```
Error: Invalid token
```
**Solution**: Ensure `JWT_SECRET` is set and consistent

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] GitHub repository with backend code
- [ ] Render web service deployed successfully
- [ ] Environment variables configured
- [ ] API health check returns 200
- [ ] Frontend updated with new API URL
- [ ] Registration and login working
- [ ] Expenses can be created and retrieved
- [ ] Data persists in MongoDB

---

## 🔄 Future Updates

To update your backend:
1. Push changes to your GitHub repository
2. Render will automatically redeploy
3. No downtime during updates

**Your Node.js backend is now live on Render! 🚀**

**API URL**: `https://your-render-app.onrender.com`
**Database**: MongoDB Atlas
**Authentication**: JWT tokens
**Security**: Rate limiting, CORS, input validation

---

## 💰 Cost Breakdown

**Render Free Tier:**
- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ✅ GitHub integration

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared clusters
- ✅ Perfect for development/small apps

**Total Monthly Cost: $0** 🎉