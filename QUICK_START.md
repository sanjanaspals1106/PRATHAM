# 🚀 Vital Edge - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account with anon key
- Two terminal windows

## Step-by-Step Setup (5 minutes)

### 1. Get Your Supabase Key
1. Go to your Supabase project
2. Settings → API
3. Copy the `anon` / `public` key

### 2. Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
SUPABASE_URL=https://kesufvhvkbnabpoassis.supabase.co
SUPABASE_ANON_KEY=PASTE_YOUR_KEY_HERE
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
EOF

# Start backend server
npm run dev
```

✅ You should see: "🚀 Vital Edge Backend running on port 3000"

### 3. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend (from project root)
cd care-flow

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://kesufvhvkbnabpoassis.supabase.co
VITE_SUPABASE_ANON_KEY=PASTE_YOUR_KEY_HERE
EOF

# Start frontend server
npm run dev
```

✅ You should see: "Local: http://localhost:8080"

### 4. Open Application

Open your browser to: **http://localhost:8080**

---

## 🧪 Quick Test Flow

### Test 1: Hospital Mode Triage
1. Fill patient info: Name: "John Doe", Age: 45, Gender: Male
2. Enter vitals: BP 180/95, Pulse 120, Temp 38.5, SpO₂ 88, RR 26
3. Select symptoms: Chest Pain, Breathlessness
4. Click "Run Triage"
5. **Expected**: RED/CRITICAL priority with detailed explainability

### Test 2: Ambulance Mode
1. Switch to "Ambulance Mode"
2. Enter ETA: 15 minutes
3. Fill quick vitals and symptoms
4. Click "Run Triage"
5. **Expected**: Fast result with ambulance indicator

### Test 3: Dashboard
1. Click "Dashboard" or navigate to /dashboard
2. **Expected**: See total count, priority distribution chart
3. Click "Export CSV"
4. **Expected**: CSV file downloads

### Test 4: Multilingual
1. Click language selector (globe icon)
2. Select "हिंदी" (Hindi)
3. **Expected**: UI switches to Hindi
4. Switch to "తెలుగు" (Telugu)
5. **Expected**: UI switches to Telugu

---

## ✅ Health Checks

### Backend Health
```bash
curl http://localhost:3000/health
```
Should return: `{"status":"healthy","timestamp":"...","service":"Vital Edge Backend","version":"1.0.0"}`

### Database Connection
If backend starts without errors, Supabase connection is working.

### Frontend API Connection
If you can submit a triage and see results, API connection is working.

---

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check: Is port 3000 available? (Kill other processes using it)
- ✅ Check: Is SUPABASE_ANON_KEY set correctly in .env?
- ✅ Run: `npm install` again

### Frontend won't start
- ✅ Check: Is port 8080 available?
- ✅ Check: Is VITE_API_URL set to http://localhost:3000?
- ✅ Run: `npm install` again

### CORS errors in browser
- ✅ Check: Backend CORS_ORIGIN is http://localhost:8080
- ✅ Check: Frontend is actually running on :8080 (not :5173)
- ✅ Restart backend after changing .env

### "Cannot connect to server" error
- ✅ Check: Backend is running (Terminal 1 should show logs)
- ✅ Check: VITE_API_URL in frontend .env is correct
- ✅ Try: Open http://localhost:3000/health in browser

### Data not saving
- ✅ Check: Supabase key is correct
- ✅ Check: Database tables exist (triage_records, audit_logs)
- ✅ Check: Backend console for error messages

---

## 📊 Demo Scenarios

### Scenario 1: Critical Case (RED)
- **Patient**: 60-year-old male
- **Vitals**: BP 200/110, Pulse 145, Temp 39.5, SpO₂ 84, RR 32
- **Symptoms**: Chest Pain, Breathlessness
- **Expected Priority**: CRITICAL (RED)
- **Expected Risk**: HIGH
- **Preparation Notes**: Resuscitation bay, oxygen support, ECG, cardiology alert

### Scenario 2: Moderate Case (YELLOW)
- **Patient**: 35-year-old female
- **Vitals**: BP 145/90, Pulse 105, Temp 38.0, SpO₂ 93, RR 22
- **Symptoms**: Fever, Abdominal Pain
- **Expected Priority**: MODERATE (YELLOW)
- **Expected Risk**: MEDIUM or LOW
- **Preparation Notes**: Treatment room, monitoring, imaging prep

### Scenario 3: Stable Case (GREEN)
- **Patient**: 25-year-old male
- **Vitals**: BP 120/80, Pulse 75, Temp 37.0, SpO₂ 98, RR 16
- **Symptoms**: (none or minor)
- **Expected Priority**: STABLE (GREEN)
- **Expected Risk**: LOW
- **Preparation Notes**: Standard examination room

### Scenario 4: Ambulance Pre-Alert
- **Mode**: Ambulance
- **ETA**: 10 minutes
- **Patient**: Trauma case
- **Vitals**: BP 85/50, Pulse 130, Temp 36.0, SpO₂ 90, RR 28
- **Symptoms**: Trauma, Bleeding
- **Expected**: Critical priority, high risk, trauma team alert

---

## 🎯 What to Show Judges

1. **Explainable AI** (30 seconds)
   - Submit a triage
   - Point to "AI Decision Transparency" section
   - Show reasoning, "why not" sections, ethics statement

2. **Risk Assessment** (20 seconds)
   - Point to risk badge (HIGH/MEDIUM/LOW)
   - Show timeframe and indicators
   - Highlight preparation checklist

3. **Dual Modes** (20 seconds)
   - Toggle between Hospital and Ambulance mode
   - Show ETA input
   - Explain use case difference

4. **Multilingual** (15 seconds)
   - Switch to Hindi
   - Switch to Telugu
   - Explain accessibility for Indian hospitals

5. **Dashboard** (25 seconds)
   - Show metrics (including High Risk, Ambulance counts)
   - Point to chart
   - Click Export CSV

6. **Technical Stack** (10 seconds)
   - Mention: "Production-ready with Node.js backend, React frontend, Supabase database"
   - Mention: "Type-safe with TypeScript, real-time API, scalable architecture"

**Total Demo Time**: ~2 minutes

---

## 📱 Mobile Testing

The UI is responsive. Test on mobile by:
1. Find your computer's IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Update CORS_ORIGIN in backend .env: `CORS_ORIGIN=http://YOUR_IP:8080`
3. Restart backend
4. On mobile browser: `http://YOUR_IP:8080`

---

## 🎉 You're Ready!

If you can:
- ✅ Submit a triage
- ✅ See explainability and risk assessment
- ✅ View dashboard
- ✅ Export CSV
- ✅ Switch languages

Then you're ready for the hackathon demo! 🏆

Good luck! 🚀
