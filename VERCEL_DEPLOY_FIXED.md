# Vercel Deployment - Fix Applied

## Issue
The error "AptosAccount.fromHex is not a function" occurred because the code was using the old Aptos SDK syntax.

## Solution Applied
Changed from:
```javascript
const account = AptosAccount.fromHex(norm);
```

To:
```javascript
const account = new AptosAccount(Buffer.from(norm, 'hex'));
```

## Files Changed
- `billboard/api/index.js` - Fixed AptosAccount instantiation
- Imported `AptosAccount` at the top of the file

## To Redeploy

### Option 1: Automatic (if connected to GitHub)
Just push your changes:
```bash
git add .
git commit -m "Fix AptosAccount instantiation"
git push
```

Vercel will automatically redeploy!

### Option 2: Manual via CLI
```bash
cd billboard
vercel --prod
```

### Option 3: From Vercel Dashboard
1. Go to your project on vercel.com
2. Click "Redeploy" → "Redeploy"

## Verification
After redeploy, test:
```bash
curl https://billboard-app-ashen.vercel.app/health
```

## Status
✅ Fix applied and ready to deploy

