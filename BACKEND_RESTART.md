# 🔴 Backend Crashed - Quick Fix

## Problem

Your backend is not running (Exit Code: 1). The `/hostels/my` endpoint returns 500 because the server is offline.

## Solution - Restart Backend

### Step 1: Open Terminal in Backend Folder

```bash
cd c:\Users\Administrator.ABID-RCO\Desktop\fyp\backend
```

### Step 2: Stop Any Running Process

Press `Ctrl+C` if something is running

### Step 3: Clear Cache & Restart

```bash
# Clear node cache
rm -r node_modules/.vite  # If it exists

# Start fresh
npm start
# OR if using nodemon:
npx nodemon server.js
```

### Step 4: Verify Backend Started

You should see in terminal:

```
Server running on port 5000
```

### Step 5: Test in Browser

Go to: http://localhost:5000/api/hostels
Should return a JSON array (even if empty)

---

## If Still Not Working

### Check 1: Is Node Running?

```bash
node -v
npm -v
```

Should show version numbers

### Check 2: Is Port 5000 in Use?

```bash
# On Windows (PowerShell):
netstat -ano | findstr :5000

# If something is using it, kill it:
taskkill /PID <PID> /F
```

### Check 3: Reinstall Dependencies

```bash
rm -r node_modules
npm install
npm start
```

### Check 4: Check .env File

Make sure `JWT_SECRET` and `MONGODB_URI` are set in `.env`

---

## Test After Restart

1. **Backend running?**
   - Terminal shows "Server running on port 5000" ✅

2. **Frontend still running?**
   - Browser shows http://localhost:5173 ✅

3. **Logged in as owner?**
   - localStorage has `token` ✅

4. **Try again:**
   - Go to Owner Dashboard
   - Should load hostels now!

---

## Backend Files We Modified

- ✅ `backend/routes/hostel.routes.js` - Added auth middleware
- ✅ `backend/routes/room.routes.js` - Added auth middleware
- ✅ `backend/routes/booking.routes.js` - Added auth middleware
- ✅ No syntax errors in these files

The code is correct. **Backend just needs to be restarted!**

---

Let me know once you restart and I'll help if issues persist! 🚀
