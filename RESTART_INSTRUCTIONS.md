# 🔄 How to Restart Docusaurus Properly

## Issue: Port 3000 Already in Use

Your previous dev server is still running. Here's how to fix it:

---

## Option 1: Find and Stop the Process (Windows)

### Method A: Using Task Manager
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Click "Details" tab
3. Find `node.exe` processes
4. Right-click → End Task
5. Close all Node processes

### Method B: Using Command Line
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# You'll see something like:
# TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       12345

# Kill the process (replace 12345 with actual PID)
taskkill /PID 12345 /F
```

---

## Option 2: Use Different Port

```bash
cd frontend
npm start -- --port 3001
```

Then visit: http://localhost:3001

---

## Option 3: Clean Restart (Recommended)

```bash
# 1. Close your terminal completely
# 2. Open new terminal
# 3. Navigate to frontend
cd D:\Q-4-01\frontend

# 4. Clean everything
rm -rf .docusaurus node_modules/.cache

# 5. Start fresh
npm start
```

---

## After Restarting

You should see:
```
[SUCCESS] Docusaurus website is running at: http://localhost:3000/
```

Then:
1. Open http://localhost:3000
2. Should see homepage without errors
3. Check browser console for: "✓ Environment validated"

---

## Still Having Issues?

Run this complete cleanup:

```bash
cd frontend

# Clean everything
npm run clear
rm -rf .docusaurus node_modules/.cache

# Reinstall dependencies
npm install

# Start
npm start
```

---

**Once you see "✓ Environment validated" in the console, everything is working!** ✅
