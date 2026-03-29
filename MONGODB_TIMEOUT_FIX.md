# MongoDB Buffering Timeout Fix

## Problem

**Error:** `Operation users.findOne() buffering timed out after 10000ms`

This error occurs when Mongoose cannot connect to MongoDB within the timeout period. The driver waits for a connection from the connection pool, but none becomes available.

---

## Root Causes

1. ❌ **No timeout configuration** - Default Mongoose settings may not be optimal
2. ❌ **Connection pooling issues** - Insufficient pool size or misconfigured limits
3. ❌ **Network connectivity** - MongoDB server unreachable or network latency
4. ❌ **Database credentials** - Invalid connection string or authentication failure
5. ❌ **Missing `dbConnect()` calls** - Queries running before connection established

---

## Solutions Applied

### 1. ✅ Enhanced `dbConnect.js` Configuration

Updated the connection with proper timeout and pooling settings:

```javascript
const options = {
  connectTimeoutMS: 10000, // Time to connect (10s)
  socketTimeoutMS: 45000, // Time for operations (45s)
  serverSelectionTimeoutMS: 10000, // Server selection (10s)
  maxPoolSize: 10, // Max connections in pool
  minPoolSize: 5, // Min connections in pool
  retryWrites: true, // Retry failed writes
  retryReads: true, // Retry failed reads
  w: "majority", // Write acknowledgment
};
```

**Benefits:**

- Prevents buffering timeout with explicit timeouts
- Maintains connection pool for better performance
- Automatic retry for transient failures
- Better error diagnostics

---

## Verification Steps

### 1. Check Environment Variables

```bash
# Verify .env file has MONGO_URI
echo $MONGO_URI
```

**Expected:** `mongodb+srv://manoj:manoj@raksha.iwqijhu.mongodb.net/?appName=Raksha`

### 2. Test MongoDB Connection

```bash
# From project root, test connection
npm run dev
```

**Look for:** `✅ Connected to MongoDB!` in console

### 3. Check Network Connectivity

```bash
# Test MongoDB cluster accessibility
ping raksha.iwqijhu.mongodb.net

# Or test DNS resolution
nslookup raksha.iwqijhu.mongodb.net
```

### 4. Verify IP Whitelist

- Go to MongoDB Atlas Dashboard
- Check **Network Access** → **IP Whitelist**
- Ensure your IP is whitelisted (or add `0.0.0.0/0` for development)

---

## Common Issues & Solutions

| Issue                    | Symptom                       | Solution                                       |
| ------------------------ | ----------------------------- | ---------------------------------------------- |
| **IP Not Whitelisted**   | Connection refused            | Add IP in MongoDB Atlas → Network Access       |
| **Wrong Credentials**    | Authentication failed         | Verify username/password in connection string  |
| **Network Down**         | ENOTFOUND error               | Check internet connection and firewall         |
| **Too Many Connections** | Timeout after pool exhaustion | Increase `maxPoolSize` or fix connection leaks |
| **Slow Network**         | Timeout errors intermittently | Increase `connectTimeoutMS`                    |

---

## Prevention Best Practices

### 1. Always Call `dbConnect()` First

```javascript
export async function myFunction() {
  try {
    await dbConnect(); // ✅ Always call this first
    const user = await User.findOne({ email });
    // ...
  } catch (err) {
    console.error(err);
  }
}
```

### 2. Add Connection Status Checks

```javascript
import mongoose from "mongoose";

const isConnected = mongoose.connection.readyState === 1;
console.log(`Database: ${isConnected ? "✅ Connected" : "❌ Disconnected"}`);
```

### 3. Handle Connection Events

```javascript
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});
```

### 4. Add Retry Logic for Queries

```javascript
async function findUserWithRetry(email, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await dbConnect();
      return await User.findOne({ email });
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retry ${i + 1}/${retries}`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
```

---

## Monitoring & Debugging

### Enable Mongoose Debug Mode

Add to your code temporarily:

```javascript
mongoose.set("debug", true);
```

This logs all MongoDB operations to console.

### Check Connection Pool Status

```javascript
console.log("Connection state:", mongoose.connection.readyState);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
```

### Monitor Performance

```javascript
const start = Date.now();
const user = await User.findOne({ email });
console.log(`Query took ${Date.now() - start}ms`);
```

---

## Environment Variables Checklist

- ✅ `MONGO_URI` - Private (no `NEXT_PUBLIC_` prefix)
- ✅ `NEXTAUTH_SECRET` - Private
- ✅ `JWT_SECRET` - Private
- ✅ Firebase keys - Can be public (prefixed with `NEXT_PUBLIC_`)

**Security:** Never commit `.env` file to version control!

---

## Next Steps

1. ✅ Restart development server: `npm run dev`
2. ✅ Monitor console for connection messages
3. ✅ Test login functionality
4. ✅ Check MongoDB Atlas dashboard for connection activity
5. ✅ Review logs in MongoDB Atlas → Monitoring

---

## Additional Resources

- [Mongoose Connection Options](<https://mongoosejs.com/docs/api/connection.html#Connection.prototype.openUri()>)
- [MongoDB Connection Troubleshooting](https://docs.mongodb.com/manual/reference/connection-string/)
- [Connection Pooling Best Practices](https://docs.mongodb.com/manual/reference/connection-string/)

---

**Last Updated:** 29 March 2026
**Status:** ✅ Fixed - Configuration applied to `dbConnect.js`
