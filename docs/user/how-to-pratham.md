# Pratham — User Guide

**Last Updated:** 2026-04-03  
**Audience:** Nurses, paramedics, and emergency department staff  
**Related:** [Developer Documentation](../dev/pratham-implementation.md)

---

## Table of Contents

1. [What is Pratham?](#what-is-pratham)
2. [Getting Started](#getting-started)
3. [Running a Triage](#running-a-triage)
4. [Understanding Your Results](#understanding-your-results)
5. [Ambulance Mode](#ambulance-mode)
6. [Overriding a Priority](#overriding-a-priority)
7. [Dashboard & Reports](#dashboard--reports)
8. [Changing the Language](#changing-the-language)
9. [Using Offline](#using-offline)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)

---

## What is Pratham?

Pratham is an AI-powered triage system that helps emergency department staff quickly assess and prioritise patients based on their vital signs and symptoms.

It gives you:
- A **priority level** (Critical, Moderate, or Stable) with a confidence score
- A plain-English **explanation** of why that priority was assigned
- A **risk forecast** telling you how quickly the patient may deteriorate
- A **preparation checklist** so your team is ready before the patient arrives

> Pratham supports clinical decision-making. Final decisions always rest with the treating clinician.

---

## Getting Started

Open Pratham in your browser. You will land on the **Triage** screen automatically.

![Screenshot: home-screen](screenshots/pratham/home-screen.png)

The top bar shows:
- **Pratham** — the app name with a HeartPulse icon
- **Triage** and **Dashboard** navigation buttons
- Your current connection status (shows "Offline" if no internet)
- A language selector (top right)

---

## Running a Triage

### Step 1 — Enter Patient Information

Fill in the patient's:
- **Name** (optional but recommended for records)
- **Age**
- **Gender**

![Screenshot: patient-info](screenshots/pratham/patient-info.png)

### Step 2 — Enter Vital Signs

Enter the readings you have available. You do not need all fields — enter what you have measured:

| Field | What to enter |
|---|---|
| BP (Systolic / Diastolic) | e.g. 120 / 80 |
| Pulse | Beats per minute |
| Temperature | In °C |
| SpO₂ | Oxygen saturation % |
| Respiratory Rate | Breaths per minute |

![Screenshot: vitals-input](screenshots/pratham/vitals-input.png)

> **Tip:** The more vitals you enter, the higher the confidence score will be.

### Step 3 — Select Symptoms

Tap each symptom that applies to the patient. Red flag symptoms (Chest Pain, Seizure, Unconscious) will automatically push the priority to **Critical**.

![Screenshot: symptoms](screenshots/pratham/symptoms.png)

### Step 4 — Choose Mode

- **Hospital Mode** — for patients already in the department (full assessment)
- **Ambulance Mode** — for incoming patients (enter ETA in minutes)

![Screenshot: mode-toggle](screenshots/pratham/mode-toggle.png)

### Step 5 — Run Triage

Tap **Run Triage**. Results appear within seconds.

---

## Understanding Your Results

### Priority Level

| Label | Colour | Meaning |
|---|---|---|
| **Critical** | Red | Immediate life-threatening — act now |
| **Moderate** | Yellow | Urgent — monitor closely, treat soon |
| **Stable** | Green | Non-urgent — can wait safely |

A **confidence score** (70–98%) tells you how certain the AI is. Higher scores mean more supporting evidence.

![Screenshot: priority-result](screenshots/pratham/priority-result.png)

### Why This Priority?

The **AI Decision Transparency** section explains the reasoning in plain language — which vitals or symptoms drove the decision.

It also tells you:
- **Why not Critical?** (for Moderate/Stable results) — what would need to change
- **Why not Stable?** (for Critical/Moderate results) — what is concerning

![Screenshot: explainability](screenshots/pratham/explainability.png)

### Ethics & Fairness Statement

Every result includes a note confirming that **age, gender, and ethnicity played no role** in the scoring. Priority is based purely on clinical indicators.

### Risk Assessment

Below the priority you will see:

- **Deterioration Risk** — HIGH / MEDIUM / LOW
- **Expected Timeframe** — how soon the patient may worsen (e.g. "5–30 minutes")
- **Risk Indicators** — specific threats to watch (e.g. "Cardiac instability", "Hypoxia progression")
- **Hospital Preparation Checklist** — equipment and team alerts to activate

![Screenshot: risk-assessment](screenshots/pratham/risk-assessment.png)

---

## Ambulance Mode

Use this when a patient is still in transit.

1. Toggle **Ambulance Mode** on the triage screen
2. Enter the **ETA in minutes** (1–300)
3. Run Triage as normal

The system will log an ambulance alert in the record so the receiving team knows the patient is incoming.

![Screenshot: ambulance-mode](screenshots/pratham/ambulance-mode.png)

---

## Overriding a Priority

If your clinical assessment differs from the AI result, you can override it.

1. On the results screen, tap **Override Priority**
2. Select the correct priority level
3. Enter a **reason** for the change (required)
4. Tap **Save Override**

![Screenshot: override](screenshots/pratham/override.png)

The override is recorded in the audit trail alongside your reason. The original AI result is preserved for reference.

---

## Dashboard & Reports

Tap **Dashboard** in the top navigation to see today's activity.

### What you can see:
- Total patients triaged today
- Breakdown by priority (Critical / Moderate / Stable)
- Average confidence score
- Number of high-risk patients
- Number of ambulance-mode cases
- A bar chart of priority distribution
- A list of recent entries

![Screenshot: dashboard](screenshots/pratham/dashboard.png)

### Exporting Records

Tap **Export CSV** to download all triage records as a spreadsheet. You can open this in Excel or Google Sheets for reporting.

> Every export is logged in the audit trail automatically.

---

## Changing the Language

Pratham supports three languages:

| Language | Script |
|---|---|
| English | Latin |
| Hindi | हिंदी |
| Telugu | తెలుగు |

Tap the language selector in the top-right corner of the screen to switch. The entire interface updates immediately.

![Screenshot: language-selector](screenshots/pratham/language-selector.png)

---

## Using Offline

If your internet connection drops, the banner at the top right will show **Offline**.

- You can still **view** previously loaded data
- Submitting a new triage or saving records **requires** an internet connection
- Reconnect and refresh the page to resume full functionality

---

## Tips & Best Practices

- **Enter as many vitals as possible** — more data means higher confidence and better risk forecasting.
- **Use Ambulance Mode early** — entering the ETA gives your team time to prepare before the patient arrives.
- **Always add an override reason** — it creates a clear record for handover and audits.
- **Check the preparation checklist** — it tells you exactly what equipment and team members to activate.
- **Use the Dashboard at shift handover** — it gives an instant picture of the day's caseload and any outstanding high-risk patients.
- **Export CSV at the end of each shift** — for reporting and record-keeping.

---

## Troubleshooting

| Problem | What to do |
|---|---|
| "Run Triage" button is greyed out | Check that at least one vital sign or symptom has been entered |
| Results are not loading | Check your internet connection; look for the "Offline" badge |
| Confidence score is low (70%) | Enter more vital signs to give the system more data |
| The language changed unexpectedly | Tap the language selector and choose your preferred language |
| Export button does nothing | Check your browser's pop-up / download settings |
| Page shows an error after submission | Refresh the page and try again; if the problem persists, contact your system administrator |

---

*For technical setup and API documentation, see the [Developer Documentation](../dev/pratham-implementation.md).*
