# Pratham - AI-Powered Triage System

A production-ready AI triage system for emergency departments with explainable AI, risk assessment, and multilingual support.

## Features

🧠 **Explainable AI** - Transparent decision-making with reasoning, "why not higher/lower" explanations, and bias transparency
📊 **Predictive Risk Assessment** - Forecasts deterioration with timeframe and preparation notes
🚑 **Dual Mode Operation** - Hospital (complete assessment) and Ambulance (fast-track) modes
🌍 **Multilingual Support** - English, Hindi (हिंदी), Telugu (తెలుగు)
📋 **Professional Audit Trail** - Complete logging with CSV export capability
⚡ **Real-time Backend** - Node.js/Express + Supabase production stack

## Architecture

### Backend (`/backend`)
- **Framework**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI Engine**: Sophisticated scoring algorithm (0-100 points)
  - Vital Signs: 0-40 points
  - Symptoms: 0-40 points
  - RED: ≥60, YELLOW: 30-59, GREEN: <30
- **Services**:
  - `triageEngine.ts` - Core scoring algorithm
  - `explainability.ts` - AI transparency & reasoning
  - `riskAssessment.ts` - Deterioration prediction
  - `auditLogger.ts` - Audit trail with Winston
  - `csvExporter.ts` - Data export functionality

### Frontend (`/care-flow`)
- **Framework**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **State**: React Hooks
- **Routing**: React Router v6
- **API**: Axios with priority mapping
- **i18n**: react-i18next with 3 locales

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in .env**
   ```env
   SUPABASE_URL=https://kesufvhvkbnabpoassis.supabase.co
   SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:8080
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd care-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in .env**
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_SUPABASE_URL=https://kesufvhvkbnabpoassis.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:8080`

## API Endpoints

### Triage
- `POST /api/triage` - Submit new triage case
- `GET /api/triage/:id` - Get specific triage record
- `POST /api/triage/:id/override` - Override priority with reason

### Dashboard
- `GET /api/dashboard/summary` - Get today's statistics and recent entries

### Export & Audit
- `GET /api/export/csv` - Export records to CSV
- `GET /api/audit-logs` - Retrieve audit logs

### Health
- `GET /health` - Health check endpoint

## Database Schema

### triage_records
- Patient info: name, age, gender
- Vitals: BP, pulse, temp, SpO₂, respiratory rate
- Symptoms: chest pain, breathlessness, bleeding, etc.
- AI Results: priority, confidence, scores, reasoning
- Explainability: why_not_red, why_not_green, bias_note
- Risk Assessment: deterioration_risk, timeframe, indicators, preparation
- Mode: HOSPITAL | AMBULANCE (with ETA)
- Override: is_overridden, override_reason

### audit_logs
- action: TRIAGE_CREATED | PRIORITY_OVERRIDDEN | RECORD_EXPORTED
- triage_id, details, operator_name, created_at

## Scoring Algorithm

### Vital Signs (0-40 points)
- **SpO₂**: <85 (+15), <90 (+10), <94 (+5)
- **Pulse**: >140 or <40 (+12), >120 or <50 (+7), >100 or <60 (+3)
- **BP Systolic**: >200 or <70 (+12), >180 or <90 (+7), >140 or <100 (+3)
- **Respiratory Rate**: >30 or <8 (+10), >24 or <10 (+5)
- **Temperature**: >40 (+8), >39 (+4), <35 (+6)

### Symptoms (0-40 points)
- **RED FLAGS** (auto-escalate): Unconscious (+40), Seizure (+38), Chest Pain (+35)
- **HIGH SEVERITY**: Breathlessness (+20), Trauma (+18)
- **MODERATE**: Bleeding (+10), Fever (+8), Abdominal Pain (+7)

### Priority Thresholds
- **RED (CRITICAL)**: Score ≥60 OR any RED flag symptom
- **YELLOW (MODERATE)**: Score 30-59
- **GREEN (STABLE)**: Score <30

## Testing Flow

1. **Start both servers** (backend on :3000, frontend on :8080)
2. **Select mode**: Hospital or Ambulance (with ETA)
3. **Enter patient data**: Name, age, gender
4. **Input vitals**: BP, pulse, temp, SpO₂, respiratory rate
5. **Select symptoms**: Check applicable symptoms
6. **Run Triage**: Get AI result with explainability
7. **View Dashboard**: See statistics, export CSV
8. **Test languages**: Switch between EN/HI/TE

## Production Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd care-flow
npm run build
```

Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

## Environment Variables

Ensure all required environment variables are set in production:
- Backend: SUPABASE_URL, SUPABASE_ANON_KEY, PORT, CORS_ORIGIN
- Frontend: VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Unique Selling Points (For Hackathon Judges)

1. **Explainable AI Transparency** - Not a black box; shows reasoning and alternatives
2. **Predictive Risk Assessment** - Forecasts deterioration with actionable preparation notes
3. **Dual Mode Operation** - Handles both in-hospital and pre-hospital scenarios
4. **Multilingual Accessibility** - Serves diverse populations in government hospitals
5. **Professional Audit Trail** - Complete accountability with export capability
6. **Production-Ready Architecture** - Real database, TypeScript, scalable design

## Tech Stack

**Backend**: Node.js, Express, TypeScript, Supabase, Winston, Zod
**Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Axios, i18next
**Database**: PostgreSQL (via Supabase)
**Charts**: Recharts
**Icons**: Lucide React

## License

MIT

## Contributors

Vital Edge Team - Hackathon Project 2026
