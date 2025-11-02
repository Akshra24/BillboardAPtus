# Quick Start: Deploy to Vercel

## Fastest Method

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd billboard

# Login and deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your repository
5. Deploy!

## What Gets Deployed

- ✅ API serverless functions (`api/index.js`)
- ✅ Frontend static files (`frontend/`)
- ✅ Configuration (`vercel.json`)

## Environment Variables

Already configured in `vercel.json`:
- `APTOS_NODE_URL` - Aptos Devnet
- `MODULE_ADDRESS` - Deployed module address

## Your Site Will Be

`https://your-project-name.vercel.app`

## Test It

```bash
curl https://your-project-name.vercel.app/health
```

## Full Documentation

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.



