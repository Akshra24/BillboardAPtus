# Vercel Deployment Guide

Complete guide to deploy the Billboard application on Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Install locally for testing (version 18+ recommended)

## Project Structure

The project is structured for Vercel deployment:

```
billboard/
├── api/                    # Serverless API functions
│   └── index.js           # Main API handler
├── frontend/              # Static frontend files
│   ├── index.html         # Main UI
│   └── app.js             # Frontend logic
├── vercel.json            # Vercel configuration
├── .vercelignore          # Files to exclude from deployment
└── package.json           # Dependencies (in api/)
```

## Deployment Methods

### Method 1: Vercel CLI (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Navigate to Project**
```bash
cd billboard
```

**Step 3: Login to Vercel**
```bash
vercel login
```

**Step 4: Deploy**
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (for first deployment)
- What's your project's name? **billboard** (or your preferred name)
- In which directory is your code located? **./**

**Step 5: Production Deployment**
```bash
vercel --prod
```

Your site will be live at: `https://your-project-name.vercel.app`

### Method 2: GitHub Integration

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

**Step 2: Import Project on Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./billboard` (if repo root) or leave as is
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Click "Deploy"

**Step 3: Add Environment Variables** (if not in vercel.json)
Go to Project Settings → Environment Variables:
- `APTOS_NODE_URL`: `https://fullnode.devnet.aptoslabs.com`
- `MODULE_ADDRESS`: `0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871`

## Configuration

### vercel.json

The project includes a `vercel.json` configuration file that:
- Defines API routes under `/api/*`
- Serves static frontend files
- Sets environment variables
- Handles routing

### API Endpoints

When deployed, your API endpoints will be:
- `https://your-project.vercel.app/health` - Health check
- `https://your-project.vercel.app/api/initialize` - Initialize Billboard
- `https://your-project.vercel.app/api/set` - Update message
- `https://your-project.vercel.app/api/message/:address` - Read message

### Frontend Auto-Configuration

The frontend automatically detects the environment:
- **Local**: Uses `http://localhost:8080`
- **Vercel**: Uses `/api` relative paths

## Testing After Deployment

### 1. Test Health Endpoint
```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "node": "https://fullnode.devnet.aptoslabs.com",
  "module": "0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871",
  "platform": "Vercel"
}
```

### 2. Test Read Message
```bash
curl https://your-project.vercel.app/api/message/0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871
```

### 3. Test Frontend
Open `https://your-project.vercel.app` in your browser

## Environment Variables

### Default Values (in vercel.json)
- `APTOS_NODE_URL`: `https://fullnode.devnet.aptoslabs.com`
- `MODULE_ADDRESS`: `0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871`

### Adding Custom Environment Variables

**Via Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add new variables
3. Redeploy

**Via Vercel CLI:**
```bash
vercel env add APTOS_NODE_URL
vercel env add MODULE_ADDRESS
```

**For Production Only:**
```bash
vercel env add APTOS_NODE_URL production
```

## Custom Domain

### Adding a Custom Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `billboard.example.com`)
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

## Monitoring and Logs

### View Logs
```bash
vercel logs
```

### Real-time Logs
```bash
vercel logs --follow
```

### View in Dashboard
Go to Deployments → Select deployment → Logs

## Troubleshooting

### Issue: API returns 404

**Solution**: Check that `vercel.json` routes are correct and `/api/*` routes point to `api/index.js`

### Issue: Frontend can't find API

**Solution**: Verify frontend `app.js` is using correct API_BASE for production

### Issue: Environment variables not working

**Solution**: 
1. Redeploy after adding environment variables
2. Check variable names match exactly
3. Verify variables are set for correct environment (production, preview, development)

### Issue: Build fails

**Solution**:
```bash
# Check local build
cd billboard
vercel dev

# View detailed logs
vercel logs --follow
```

### Issue: "Module not found" errors

**Solution**: Ensure all dependencies are in `package.json`:
```bash
cd billboard
npm install
```

## Performance Optimization

### Enable Caching
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### Optimize Bundle Size
- Remove unused dependencies
- Use tree-shaking
- Minimize JavaScript in `app.js`

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys on:
- Push to `main` branch → Production
- Push to other branches → Preview
- Pull requests → Preview with comment

### Manual Deployments

```bash
vercel --prod
```

### Rollback

In Vercel Dashboard:
1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

## Cost Considerations

### Free Tier Limits
- 100GB bandwidth/month
- 100GB-hour compute/month
- Unlimited projects
- Serverless function timeout: 10 seconds (Hobby), 60 seconds (Pro)

### Pro Tier ($20/month)
- 1TB bandwidth/month
- 1000GB-hour compute/month
- 60-second function timeout
- Team collaboration

## Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use Vercel's environment variables
- Rotate keys regularly

### API Security
- Consider adding rate limiting
- Use HTTPS (automatic on Vercel)
- Validate all inputs
- Sanitize error messages

### Private Keys
⚠️ **Warning**: Current implementation accepts private keys in API calls. This is for demo only!
- Never use in production
- Implement wallet integration instead
- Use proper authentication

## Migration from Local Server

If you've been running locally and want to migrate:

1. **Update API endpoints in frontend** (already done - auto-detects)
2. **Deploy to Vercel**
3. **Update any bookmarks** to new URL
4. **Update documentation** with Vercel URL

## Next Steps

After successful deployment:

1. ✅ Share your live URL
2. ✅ Add custom domain (optional)
3. ✅ Set up monitoring
4. ✅ Configure CI/CD (automatic with GitHub)
5. ✅ Add analytics
6. ✅ Optimize performance

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions Guide](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/domains)
- [Deployment Configuration](https://vercel.com/docs/configuration)

## Support

- Vercel Discord: https://vercel.com/discord
- Vercel Support: support@vercel.com
- Project Issues: GitHub Issues

---

**Deployment Status**: ✅ Ready for Vercel

Follow the steps above to deploy your Billboard application!


