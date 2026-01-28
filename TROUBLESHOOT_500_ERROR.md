# 🐛 Troubleshooting: 500 Error on /api/hostels

## Status: ✅ FIXED

The issue was **missing authentication middleware** on the routes.

---

## What Happened

1. Frontend tried `POST /api/hostels` to add hostel
2. Backend couldn't find `req.user.id` (no middleware set it)
3. Controller crashed → 500 error

---

## The Fix Applied

✅ Added `protect` middleware to check authentication
✅ Added `allowRoles()` to check user role
✅ Fixed route order so `/my` comes before `/:id`

---

## Now You Must Do

### 1. Restart Backend

```bash
# In terminal where backend is running
# Press Ctrl+C to stop
# Then:
npm start
```

### 2. Make Sure Token is Set

**Register as Owner:**

1. Go to http://localhost:5173/register
2. Fill: Name, Email, Password
3. Select Role: **Owner** (important!)
4. Click Register
5. Go back to login
6. Login with your email & password
7. ✅ You get a token

**Token auto-saved to localStorage** by axios interceptor

### 3. Test Adding Hostel

1. Go to http://localhost:5173/owner/dashboard
2. Click "Add New Hostel"
3. Fill form:
   - Name: "Test Hostel"
   - Location: "Islamabad"
4. Click "Add Hostel"
5. ✅ Should see success message

---

## If Still Getting 500

### Check 1: Are You Logged In?

- Open DevTools → Application → localStorage
- Should see `token` key
- If not: Login again

### Check 2: Backend Running?

- Check terminal where backend is running
- Should see: `Server running on port 5000`
- If not: Start it with `npm start`

### Check 3: Check Server Logs

Look at backend terminal for error message:

- `"No token"` → You're not logged in
- `"Invalid token"` → Token is corrupted
- `"Access denied"` → Wrong role (need "owner")
- `MongoDB error` → Database connection issue

### Check 4: Check Network Tab

1. Open DevTools → Network tab
2. Try to add hostel
3. Click on the failed request
4. Look at Response tab
5. Copy error message and check

---

## Common Issues & Fixes

| Error              | Cause               | Fix                               |
| ------------------ | ------------------- | --------------------------------- |
| "No token"         | Not logged in       | Login as owner                    |
| "Invalid token"    | Old/expired token   | Clear localStorage & login again  |
| "Access denied"    | Wrong role          | Register with role="owner"        |
| Backend 500        | Server crashed      | Check server terminal, restart    |
| Connection refused | Backend not running | Run `npm start` in backend folder |

---

## 🧪 Quick Test

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

Then:

1. Open http://localhost:5173
2. Register as Owner
3. Login
4. Go to /owner/dashboard
5. Add hostel
6. ✅ Success?

---

## If Something Still Wrong

1. Close all terminals
2. Delete node_modules
3. Reinstall: `npm install`
4. Restart both backend & frontend
5. Try again

---

You should be good now! 🚀
