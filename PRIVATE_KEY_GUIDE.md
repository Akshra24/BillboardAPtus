# Private Key Format Guide

## What to Enter in the Private Key Field

### Format Requirements

The private key field accepts a **hexadecimal (hex) string** with these requirements:

- **Format**: Hexadecimal string (0-9, a-f, or A-F)
- **Optional prefix**: Can start with `0x` or not (both work)
- **Length**: Must be 64-128 hexadecimal characters
  - Standard Aptos private key: **64 hex characters** (32 bytes)
  - Extended format: Up to 128 hex characters

### Valid Examples

✅ **Valid formats:**
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
0x1cc990b55d336b812a089464d063e9ebfe1691391b9cadfb3acb15257ffb12ee
```

❌ **Invalid formats:**
```
too_short_key          (less than 64 chars)
not-hex-characters     (contains invalid characters)
```

### How to Get a Private Key

#### Option 1: Generate a New Account (Recommended for Testing)

**Using Aptos CLI:**
```bash
aptos key generate --output-file key.json
```

This creates a file with:
- Private key (64 hex characters)
- Public key
- Account address

**Extract the private key:**
- Open `key.json`
- Find the `"private_key"` field
- Copy the value (64 hex characters)

#### Option 2: Use an Existing Account

If you already have an Aptos account:
- Export private key from your wallet (Petra, etc.)
- Private keys are usually displayed as 64 hex characters
- Copy the full private key

#### Option 3: Use Aptos Faucet Account (Devnet Only)

For testing on devnet, you can generate accounts using:
- Aptos CLI: `aptos account create`
- Aptos Faucet: https://faucet.aptoslabs.com/

---

## Step-by-Step: Using the Billboard App

### 1. Initialize Billboard (First Time)

**What you need:**
- A private key for an Aptos account
- An initial message

**Steps:**
1. Enter your **64-character hex private key** in the "Private key" field
   - Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`
   - You can include `0x` prefix or omit it

2. Enter your **initial message** in the message field
   - Example: "Hello, Aptos!"

3. Click "🚀 Initialize Billboard"

4. Wait for transaction confirmation
   - You'll see a transaction hash on success
   - The Billboard resource is now created on your account

### 2. Update Message (After Initialization)

**What you need:**
- The **same private key** used to initialize
- Your new message

**Steps:**
1. Enter your **private key** (same one from initialization)
2. Enter your **new message**
3. Click "✏️ Update Message"

### 3. Read Message (Anyone Can Do This)

**What you need:**
- An Aptos address (doesn't need private key)

**Steps:**
1. Enter the **address** of the account (e.g., `0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871`)
2. Click "📖 Read Message"
3. View the current message

---

## Private Key Format Details

### Standard Format
```
64 hexadecimal characters = 32 bytes
Example: 0x + 64 hex chars = 66 characters total (with 0x prefix)
```

### What the Code Does

The app normalizes your input:
1. Removes `0x` prefix if present
2. Validates it's hex-only (0-9, a-f, A-F)
3. Checks length (64-128 characters)
4. Creates AptosAccount from the hex string

### Example Private Key (DO NOT USE - FORMAT ONLY)
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
│
└─ 64 hex characters (32 bytes)
```

---

## 🔒 Security Warning

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Never share your private key** with anyone
2. **Never commit private keys** to version control
3. **Use test accounts** for development/testing
4. **This is a demo** - In production, use wallet signing instead
5. **Each private key gives full control** over that account

### Best Practices

- ✅ Use separate accounts for testing vs production
- ✅ Fund only what you need (especially on devnet/testnet)
- ✅ Never use production private keys in this demo
- ✅ Consider using Aptos CLI profiles instead

---

## Troubleshooting

### Error: "invalid privateKey format"

**Possible causes:**
- ❌ Key too short (< 64 hex chars)
- ❌ Contains invalid characters (not 0-9, a-f, A-F)
- ❌ Empty field

**Solution:**
- Ensure key is exactly 64 hex characters (after removing 0x)
- Check for spaces or special characters
- Verify it's a valid Aptos private key

### Error: "transaction failed"

**Possible causes:**
- ❌ Account doesn't have enough APT (gas fees)
- ❌ Network connection issues
- ❌ Invalid transaction

**Solution:**
- Fund your account with APT (use faucet for devnet)
- Check network connection
- Verify you're using the correct network (devnet/testnet/mainnet)

---

## Quick Reference

| Field | Format | Length | Example |
|-------|--------|--------|---------|
| Private Key | Hex string | 64 chars | `0x1234...abcd` |
| Message | Text | 1-4096 chars | "Hello, Aptos!" |
| Address | Hex string | 64 chars | `0x0b93...9871` |

---

## Need Help?

1. **Generate a test key**: Use Aptos CLI
2. **Fund your account**: https://faucet.aptoslabs.com/ (devnet)
3. **Check transaction**: https://explorer.aptoslabs.com/

---

**Remember**: This is a demo app. Never use production private keys!

