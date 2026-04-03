# Pratham — Developer Documentation

**Last Updated:** 2026-04-03  
**Version:** 1.0.0  
**Type:** Full-Stack Application  
**Related:** [User Guide](../user/how-to-pratham.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [AI Triage Engine](#ai-triage-engine)
8. [Explainability Service](#explainability-service)
9. [Risk Assessment Service](#risk-assessment-service)
10. [Audit & Export](#audit--export)
11. [Frontend Architecture](#frontend-architecture)
12. [Internationalization](#internationalization)
13. [Environment Setup](#environment-setup)
14. [Running Locally](#running-locally)
15. [Testing Approach](#testing-approach)
16. [Deployment](#deployment)

---

## Overview

**Pratham** is a production-ready AI-powered triage system for emergency departments. It combines rule-based medical scoring with explainable AI, predictive risk assessment, dual operating modes, and multilingual support across English, Hindi, and Telugu.

The system is designed to assist healthcare workers in prioritizing patients quickly and transparently — not to replace clinical judgement.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser Client                      │
│            React 18 + TypeScript + Vite                  │
│         (care-flow/ — runs on localhost:8080)            │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP (Axios)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Express Backend                        │
│           Node.js + TypeScript + Winston                 │
│         (backend/ — runs on localhost:3000)              │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐  │
│  │TriageEngine  │  │Explainability │  │RiskAssess-  │  │
│  │(scoring)     │  │(reasoning)    │  │ment         │  │
│  └──────────────┘  └───────────────┘  └─────────────┘  │
│  ┌──────────────┐  ┌───────────────┐                    │
│  │AuditLogger   │  │CSVExporter    │                    │
│  └──────────────┘  └───────────────┘                    │
└─────────────────────────┬───────────────────────────────┘
                          │ Supabase JS Client
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL + RLS)                  │
│         triage_records | audit_logs                      │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | — | Component library |
| TanStack Query | 5.x | Server state management |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| react-i18next | 14.x | Internationalization |
| Recharts | 2.x | Dashboard charts |
| Lucide React | — | Icons |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express | 4.x | Web framework |
| TypeScript | 5.x | Type safety |
| Zod | 3.x | Schema validation |
| Winston | 3.x | Logging |
| @supabase/supabase-js | 2.x | Database client |
| json2csv | 6.x | CSV export |

### Infrastructure
| Service | Purpose |
|---|---|
| Supabase | PostgreSQL database + Row Level Security |

---

## Repository Structure

```
Vital-Edge/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # Supabase client initialisation
│   │   │   └── env.ts               # Zod-validated environment config
│   │   ├── services/
│   │   │   ├── triageEngine.ts      # Core scoring algorithm
│   │   │   ├── explainability.ts    # Reasoning & bias transparency
│   │   │   ├── riskAssessment.ts    # Deterioration prediction
│   │   │   ├── auditLogger.ts       # Winston + Supabase audit
│   │   │   └── csvExporter.ts       # CSV generation
│   │   ├── routes/
│   │   │   ├── triage.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── export.routes.ts
│   │   │   └── audit.routes.ts
│   │   ├── models/
│   │   │   └── types.ts             # Shared TypeScript interfaces
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── care-flow/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── TriageInput.tsx      # Patient data entry form
│   │   │   ├── TriageResult.tsx     # Results & override
│   │   │   ├── Dashboard.tsx        # Analytics view
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── AppHeader.tsx
│   │   │   ├── ExplainabilityPanel.tsx
│   │   │   ├── RiskAssessmentCard.tsx
│   │   │   ├── AmbulanceModeToggle.tsx
│   │   │   ├── VitalInput.tsx
│   │   │   ├── SymptomButton.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── ui/                  # shadcn components
│   │   ├── lib/
│   │   │   ├── api-client.ts        # Axios + priority interceptors
│   │   │   ├── priority-mapper.ts   # RED↔CRITICAL mapping
│   │   │   ├── triage-utils.ts
│   │   │   └── types.ts
│   │   ├── i18n/
│   │   │   ├── config.ts
│   │   │   └── locales/
│   │   │       ├── en.json
│   │   │       ├── hi.json
│   │   │       └── te.json
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
│
├── docs/
│   ├── dev/pratham-implementation.md   # This file
│   └── user/how-to-pratham.md
├── README.md
├── IMPLEMENTATION_SUMMARY.md
└── QUICK_START.md
```

---

## Database Schema

### `triage_records`

```sql
CREATE TABLE triage_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Patient
  patient_name      TEXT,
  patient_age       INTEGER,
  patient_gender    TEXT,

  -- Vitals
  bp_systolic       INTEGER,
  bp_diastolic      INTEGER,
  pulse             INTEGER,
  temperature       NUMERIC(4,1),
  spo2              INTEGER,
  respiratory_rate  INTEGER,

  -- Symptoms (boolean flags)
  chest_pain        BOOLEAN DEFAULT FALSE,
  breathlessness    BOOLEAN DEFAULT FALSE,
  bleeding          BOOLEAN DEFAULT FALSE,
  unconscious       BOOLEAN DEFAULT FALSE,
  seizure           BOOLEAN DEFAULT FALSE,
  fever             BOOLEAN DEFAULT FALSE,
  abdomen_pain      BOOLEAN DEFAULT FALSE,
  trauma            BOOLEAN DEFAULT FALSE,
  other_symptoms    TEXT,

  -- AI Scoring
  priority          TEXT NOT NULL,          -- 'RED' | 'YELLOW' | 'GREEN'
  confidence_score  INTEGER,                -- 70–98
  total_score       INTEGER,
  vital_score       INTEGER,
  symptom_score     INTEGER,
  score_breakdown   JSONB,                  -- [{category, points, reason}]

  -- Explainability
  reasoning         JSONB,                  -- string[]
  why_not_red       TEXT,
  why_not_green     TEXT,
  bias_note         TEXT,

  -- Risk
  deterioration_risk TEXT,                  -- 'HIGH' | 'MEDIUM' | 'LOW'
  risk_timeframe     TEXT,
  risk_indicators    JSONB,                 -- string[]
  preparation_notes  JSONB,                 -- string[]

  -- Mode
  mode              TEXT DEFAULT 'HOSPITAL', -- 'HOSPITAL' | 'AMBULANCE'
  eta_minutes       INTEGER,
  alert_sent_at     TIMESTAMPTZ,

  -- Override
  is_overridden     BOOLEAN DEFAULT FALSE,
  override_reason   TEXT,

  -- Metadata
  operator_name     TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### `audit_logs`

```sql
CREATE TABLE audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action        TEXT NOT NULL,   -- 'TRIAGE_CREATED' | 'PRIORITY_OVERRIDDEN' | 'RECORD_EXPORTED'
  triage_id     UUID REFERENCES triage_records(id),
  details       JSONB,
  operator_name TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Reference

Base URL: `http://localhost:3000`

---

### `POST /api/triage`

Submit a new patient triage case. Runs scoring, explainability, and risk assessment in a single call.

**Request Body:**
```json
{
  "patientInfo": {
    "name": "Ravi Kumar",
    "age": 58,
    "gender": "male"
  },
  "vitals": {
    "bpSystolic": 185,
    "bpDiastolic": 110,
    "pulse": 112,
    "temperature": 37.2,
    "spo2": 91,
    "respiratoryRate": 22
  },
  "symptoms": {
    "chestPain": true,
    "breathlessness": true,
    "bleeding": false,
    "unconscious": false,
    "seizure": false,
    "fever": false,
    "abdomenPain": false,
    "trauma": false,
    "otherSymptoms": ""
  },
  "mode": "HOSPITAL",
  "etaMinutes": null,
  "operatorName": "Nurse Priya"
}
```

**Response `200`:**
```json
{
  "id": "uuid",
  "priority": "RED",
  "confidenceScore": 92,
  "totalScore": 67,
  "vitalScore": 29,
  "symptomScore": 38,
  "scoreBreakdown": [
    { "category": "SpO₂", "points": 5, "reason": "SpO₂ 91% — mild hypoxia" },
    { "category": "Chest Pain", "points": 35, "reason": "RED FLAG: Chest pain triggers immediate escalation" }
  ],
  "explainability": {
    "reasoning": ["Chest pain is a RED FLAG symptom..."],
    "whyNotRed": null,
    "whyNotGreen": "Patient presents with RED FLAG chest pain and elevated BP...",
    "biasNote": "This assessment is based solely on clinical indicators..."
  },
  "riskAssessment": {
    "deteriorationRisk": "HIGH",
    "riskTimeframe": "5–30 minutes",
    "riskIndicators": ["Cardiac instability", "Hypoxia progression"],
    "preparationNotes": ["Activate cardiac team", "Prepare ECG monitor", "IV access x2"]
  },
  "mode": "HOSPITAL",
  "createdAt": "2026-04-03T10:22:00Z"
}
```

---

### `GET /api/triage/:id`

Retrieve a previously saved triage record by UUID.

**Response `200`:** Full triage record object (same shape as POST response).

---

### `POST /api/triage/:id/override`

Override the AI-assigned priority with a clinician's manual decision.

**Request Body:**
```json
{
  "newPriority": "YELLOW",
  "reason": "Patient self-reported chest pain; ECG normal on arrival",
  "operatorName": "Dr. Sharma"
}
```

**Response `200`:** Updated triage record with `isOverridden: true`.

---

### `GET /api/dashboard/summary`

Returns aggregated statistics for the current day.

**Response `200`:**
```json
{
  "totalToday": 42,
  "redCount": 8,
  "yellowCount": 19,
  "greenCount": 15,
  "avgConfidence": 86,
  "highRiskCount": 11,
  "ambulanceModeCount": 6,
  "recentEntries": [ /* last 10 records */ ]
}
```

---

### `GET /api/export/csv`

Download all triage records as a CSV file.

**Query Params:**
| Param | Type | Description |
|---|---|---|
| `from` | ISO date | Start date filter |
| `to` | ISO date | End date filter |
| `operator` | string | Filter by operator name |

**Response:** `text/csv` file download.

---

### `GET /api/audit-logs`

Query the audit trail.

**Query Params:** `action`, `triageId`, `from`, `to`

**Response `200`:** Array of audit log entries.

---

### `GET /health`

Health check endpoint.

**Response `200`:**
```json
{ "status": "healthy", "timestamp": "...", "service": "Pratham Backend", "version": "1.0.0" }
```

---

## AI Triage Engine

**File:** `backend/src/services/triageEngine.ts`

The engine uses a deterministic rule-based scoring model — not a neural network — to ensure full transparency and auditability.

### Scoring Breakdown

**Vital Signs (0–40 points)**

| Vital | Threshold | Points |
|---|---|---|
| SpO₂ | < 85% | +15 |
| SpO₂ | < 90% | +10 |
| SpO₂ | < 94% | +5 |
| Pulse | > 140 or < 40 bpm | +12 |
| Pulse | > 120 or < 50 bpm | +7 |
| Pulse | > 100 or < 60 bpm | +3 |
| BP Systolic | > 200 or < 70 mmHg | +12 |
| BP Systolic | > 180 or < 90 mmHg | +7 |
| BP Systolic | > 140 or < 100 mmHg | +3 |
| Respiratory Rate | > 30 or < 8 /min | +10 |
| Respiratory Rate | > 24 or < 10 /min | +5 |
| Temperature | > 40°C | +8 |
| Temperature | > 39°C | +4 |
| Temperature | < 35°C | +6 |

**Symptoms (0–40 points)**

| Symptom | Points | Notes |
|---|---|---|
| Unconscious | +40 | RED FLAG — auto-escalates |
| Seizure | +38 | RED FLAG — auto-escalates |
| Chest Pain | +35 | RED FLAG — auto-escalates |
| Breathlessness | +20 | High severity |
| Trauma | +18 | High severity |
| Bleeding | +10 | Moderate |
| Fever | +8 | Moderate |
| Abdominal Pain | +7 | Moderate |

### Priority Classification

```
Total Score ≥ 60  OR  any RED FLAG symptom  →  RED   (CRITICAL)
Total Score 30–59                            →  YELLOW (MODERATE)
Total Score < 30                             →  GREEN  (STABLE)
```

### Confidence Scoring

```
Base:              70%
Score strength:    up to +20% (proportional to how far score is from threshold)
Data completeness: up to +10% (both vitals and symptoms provided)
Range:             70–98%
```

---

## Explainability Service

**File:** `backend/src/services/explainability.ts`

Generates three outputs per triage result:

1. **`reasoning`** — Array of plain-English sentences explaining each score contributor.
2. **`whyNotRed`** — For YELLOW/GREEN: explains what would need to change for CRITICAL classification.
3. **`whyNotGreen`** — For RED/YELLOW: explains why STABLE was not assigned.
4. **`biasNote`** — Static statement confirming no demographic factors (age, gender, ethnicity) were used. Included on every result for regulatory transparency.

---

## Risk Assessment Service

**File:** `backend/src/services/riskAssessment.ts`

Predicts patient deterioration based on scoring patterns and symptom flags.

### Risk Levels & Timeframes

| Risk | Timeframe | Trigger Conditions |
|---|---|---|
| HIGH | 5–30 minutes | Score ≥ 60, RED flags, SpO₂ < 90, pulse extremes |
| MEDIUM | 30 min–2 hours | Score 30–59, moderate vital abnormalities |
| LOW | > 2 hours | Score < 30, stable vitals |

### Risk Indicators (examples)
- Hypoxia progression
- Cardiac instability
- Hemodynamic instability
- Respiratory failure
- Hemorrhagic shock
- Neurological deterioration
- Septic shock
- Hypothermia complications

### Preparation Notes
Actionable checklists tailored to the risk profile:
- Equipment (oxygen, intubation kit, ECG monitor, defibrillator)
- Lab orders (ABG, cardiac enzymes, CBC)
- Team alerts (cardiology, trauma surgery, neurology)
- IV access recommendations

---

## Audit & Export

### Audit Logger — `backend/src/services/auditLogger.ts`

Logs every significant action to both **Winston** (console) and **Supabase** (`audit_logs` table).

**Event Types:**
- `TRIAGE_CREATED` — on successful triage submission
- `PRIORITY_OVERRIDDEN` — on manual override with reason
- `RECORD_EXPORTED` — on CSV download

### CSV Exporter — `backend/src/services/csvExporter.ts`

Exports the full `triage_records` dataset with all fields mapped to human-readable column headers. Supports optional date range and operator name filtering. Triggers a `RECORD_EXPORTED` audit event on every export.

---

## Frontend Architecture

### Routing

```
/           →  TriageInput.tsx    (patient data entry)
/result     →  TriageResult.tsx   (AI results + override)
/dashboard  →  Dashboard.tsx      (analytics)
*           →  NotFound.tsx
```

### Priority Mapping

The backend uses `RED / YELLOW / GREEN`. The frontend displays `CRITICAL / MODERATE / STABLE`. Conversion is handled by Axios interceptors in `care-flow/src/lib/api-client.ts` using `care-flow/src/lib/priority-mapper.ts`.

```typescript
// Backend → Frontend
RED    → CRITICAL
YELLOW → MODERATE
GREEN  → STABLE

// Frontend → Backend (for override requests)
CRITICAL → RED
MODERATE → YELLOW
STABLE   → GREEN
```

### Key Components

| Component | Responsibility |
|---|---|
| `AppHeader.tsx` | Navigation, offline indicator, language selector |
| `TriageInput.tsx` | Form for patient info, vitals, symptoms, mode selection |
| `TriageResult.tsx` | Displays priority, confidence, score breakdown, override UI |
| `ExplainabilityPanel.tsx` | Shows reasoning, why-not sections, bias statement |
| `RiskAssessmentCard.tsx` | Deterioration risk, timeframe, indicators, preparation checklist |
| `Dashboard.tsx` | Summary stats, Recharts bar chart, recent entries table, CSV export |
| `AmbulanceModeToggle.tsx` | Mode toggle + ETA input |

---

## Internationalization

**Files:** `care-flow/src/i18n/locales/en.json`, `hi.json`, `te.json`

- 96 translation keys per locale
- Language detection: `localStorage` → browser language → `en` fallback
- Covers all UI labels, priority names, medical terminology
- `appName` key drives the displayed app name across all views

**Adding a new language:**
1. Copy `en.json` → `<code>.json`
2. Translate all values
3. Register in `care-flow/src/i18n/config.ts`
4. Add option to `LanguageSelector.tsx`

---

## Environment Setup

### Backend — `backend/.env`

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### Frontend — `care-flow/.env`

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## Running Locally

```bash
# Backend
cd backend
npm install
npm run dev        # tsx watch — hot reload on port 3000

# Frontend (separate terminal)
cd care-flow
npm install
npm run dev        # Vite — hot reload on port 8080
```

Health check: `curl http://localhost:3000/health`

---

## Testing Approach

The system uses deterministic scoring, which lends itself to unit testing of the triage engine with known inputs and expected outputs.

**Recommended test cases for `triageEngine.ts`:**
- SpO₂ = 84 + chest pain → expect RED, score ≥ 60
- All vitals normal + fever only → expect GREEN, score < 30
- Pulse 130, BP 175 + breathlessness → expect YELLOW, score 30–59
- Unconscious flag → always expect RED regardless of vitals

**Recommended test cases for `explainability.ts`:**
- GREEN result → `whyNotGreen` should be null
- RED result → `whyNotRed` should be null
- `biasNote` should always be present

---

## Deployment

### Backend
```bash
cd backend
npm run build      # compiles TypeScript → dist/
npm start          # node dist/server.js
```
Deploy to any Node.js host (Railway, Render, Fly.io). Set all environment variables.

### Frontend
```bash
cd care-flow
npm run build      # Vite → dist/
```
Deploy `dist/` to Vercel, Netlify, or any static host. Set `VITE_API_URL` to the deployed backend URL.

### Database
Supabase is cloud-hosted — no additional deployment needed. Ensure Row Level Security policies are configured for production.

---

*For end-user instructions, see the [User Guide](../user/how-to-pratham.md).*
