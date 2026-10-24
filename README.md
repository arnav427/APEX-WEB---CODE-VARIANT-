<div align="center">

# 🔎 Findora
### Intelligent Digital Lost & Found

**A smarter way to report, discover, verify, and return lost belongings.**

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Choose%20before%20publishing-lightgrey)](#license)

</div>

---

## 📌 Overview

**Findora** is a digital lost-and-found platform designed to make it easier for people to reunite with belongings lost in campuses, offices, institutions, and shared communities.

Traditional lost-and-found systems often rely on long lists of item descriptions. Findora brings reporting, discovery, potential matching, ownership claims, verification, and handover into one workflow.

The project combines a modern React interface with an Express API, AI-assisted discovery, location-aware browsing, verification workflows, and an interactive drag-and-drop workspace.

> **Project status:** This repository contains an active application codebase with demo-oriented data and workflows. Features described as implemented below are based on the included source. Items in the roadmap are proposed enhancements and should not be assumed to be implemented yet. Review the security and deployment notes before using real personal data or deploying publicly.

## 🎯 Problem Statement

When someone loses an item, they may not know whether it has been found, where to search, or how to prove ownership safely. A finder may have no easy way to connect with the owner, while staff may need to coordinate claims and handovers manually.

Findora aims to reduce this friction by:

- Making lost and found reports easy to create and search.
- Suggesting potentially related reports.
- Explaining relevant matching signals.
- Supporting a structured ownership-claim process.
- Helping authorized users coordinate secure handovers.
- Giving staff a clearer view of outstanding reports and claims.

## ✨ Features

### 1. Lost & Found Reporting

- Separate lost-item and found-item reporting flows.
- Structured item information, including category, title, description, color, brand/model, and distinguishing characteristics.
- Approximate location, campus/building information, and incident date/time window.
- Support for item images and location privacy fields in the data model.
- Report status tracking: `unresolved`, `matched`, and `returned`.
- Report archive and restore workflows.

### 2. AI-Assisted Discovery & Matching

- Smart-search API for natural-language item discovery.
- AI-assisted image analysis endpoint.
- AI-assisted comparison of potential matching reports.
- Match signals represented in the application data model, including category, appearance, location, and timeline.
- Match status workflow: suggested, under review, confirmed, or dismissed.
- Match review and status-update endpoints.

AI output is intended to help prioritize possible candidates; a suggested match is **not proof of ownership**. Actual availability and quality depend on the configured Gemini service and the current implementation.

### 3. Interactive Canvas — Canvas Protocol

Findora includes an interactive workflow workspace based on draggable data cards and designated action zones.

The typed Canvas model includes workflows for:

- Reporting a lost item.
- Reporting a found item.
- Finding potential matches.
- Claiming ownership.
- Confirming a match.
- Completing a return.
- Archiving a report.

The Canvas also uses card types for reports, matches, claims, returns, verification, and notifications. The workspace includes workflow guidance and sandbox/tutorial concepts.

The Canvas is designed to make multi-step operations more visual while retaining the underlying application workflows. Verify each action in the running application before relying on it in production.

### 4. Campus Map

- Google Maps integration through `@vis.gl/react-google-maps`.
- Map-oriented item discovery.
- Location fields for campus zone, building, floor/area, and approximate location.
- Support for location-aware reporting and map interactions.
- Configurable map API key.

Map features require a valid Google Maps Platform key and appropriate API configuration.

### 5. Claims & Handover

- Ownership claim creation.
- Claim review workflow.
- Claim and item status tracking.
- Custody desk data.
- QR-code support through `qrcode.react`.
- Handover token regeneration and validation endpoints.
- Audit-oriented workflow data.

Use a real deployment only after reviewing the authorization, token-expiry, and handover rules in the current server implementation.

### 6. Verification & Trust

- Email verification endpoints.
- Phone OTP verification endpoints.
- Identity-verification request submission and review.
- User verification status and tier fields.
- Trust and successful-return counters in the user data model.
- Administrative review of verification requests.

External email/SMS delivery depends on provider configuration. When providers are not configured, the current project documentation describes a built-in verification inbox/development behavior; this must be reviewed before production use.

### 7. Secure Chat, Notifications & Abuse Reporting

- Conversation and message data models.
- Authenticated message submission endpoint.
- Report-abuse endpoint for conversations.
- Notification records.
- Administrative report flagging.
- Dispute creation and resolution endpoints.
- Audit-log records for relevant administrative activity.

Review the current authorization and privacy controls before using chat or dispute workflows with real users.

### 8. Admin & Custody Operations

- Administrative report moderation/flagging.
- Verification request review.
- Dispute resolution endpoint.
- Custody desk and handover workflows.
- Audit log data.
- Role-aware interface paths for standard users, custody staff, and administrators.

**Important:** UI role selection is not a security boundary. Production authorization must be enforced on the server for every protected operation.

### 9. Dashboard & User Experience

- Dashboard summary statistics derived from application state.
- Recent reports and suggested matches.
- Claim and verification summaries.
- Item detail interactions.
- 3D item-viewer component built with Three.js.
- Light/dark theme preference.
- English/Hindi language selection.
- Responsive UI components and iconography.

The exact behavior of each feature should be verified against the current running build and configured services.

---

## 🧭 How Findora Works

The intended end-to-end journey is:

```text
┌─────────────────────┐
│  Report Lost/Found  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Explore & Search    │
│ Reports             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ AI-Assisted Match   │
│ Suggestions         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Ownership Claim     │
│ & Verification      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Authorized QR/OTP   │
│ Handover            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Confirm Return      │
└─────────────────────┘
```

AI helps surface candidates; users and authorized staff remain responsible for ownership decisions and handovers.

## 🏗️ Architecture & Technology

### Frontend

- **React 19** — component-based UI.
- **TypeScript** — typed models and safer development.
- **Vite** — development server and production bundling.
- **Tailwind CSS 4** — styling.
- **Lucide React** — interface icons.
- **Motion** — interface animation.
- **Three.js** — 3D item-viewer functionality.
- **Google Maps React integration** — map UI.
- **qrcode.react** — QR-code rendering.

### Backend

- **Node.js**
- **Express 4**
- **TypeScript execution through `tsx`**
- **Google GenAI SDK** for Gemini-backed AI features.
- **dotenv** for environment configuration.
- **Node.js filesystem persistence** in the current implementation.

### Current persistence model

The server source initializes a JSON data store at:

```text
data/findora-db.json
```

The store contains application records such as users, password hashes, sessions, reports, matching records, claims, custody desks, conversations, messages, notifications, verification requests, disputes, and audit logs.

This file-based persistence is useful for development and evaluation, but it is **not a substitute for a production database strategy** for a multi-user public deployment. Review concurrency, durability, backups, and hosting filesystem persistence before going live.

### High-level request flow

```text
Browser (React)
      │
      │ HTTP requests to /api/*
      ▼
Express API (server.ts)
      │
      ├── Authentication & authorization
      ├── Reports, matches and claims
      ├── Verification and handover
      ├── Chat, notifications and disputes
      ├── JSON persistence (current implementation)
      └── Gemini AI services (when configured)
```

---

## 📁 Project Structure

```text
findora/
├── public/
│   └── assets/
│       └── aistudio/               # Project assets and reference material
├── src/
│   ├── components/
│   │   ├── InteractiveCanvasWorkspace.tsx
│   │   ├── ReportWizardModal.tsx
│   │   ├── MatchingDashboard.tsx
│   │   ├── CampusMapView.tsx
│   │   ├── ClaimsAndHandoverView.tsx
│   │   ├── VerificationCenterView.tsx
│   │   ├── AdminAndChatViews.tsx
│   │   └── Item3DViewerModal.tsx
│   ├── App.tsx                     # Main app composition and state
│   ├── types.ts                    # Shared TypeScript data models
│   ├── i18n.ts                     # English/Hindi strings
│   ├── index.css                   # Global styling
│   └── main.tsx                    # Frontend entry point
├── server.ts                       # Express API and persistence
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

Some folders, files, and generated assets may be specific to the AI Studio workspace. Keep only the assets required for the GitHub repository and avoid committing secrets or private data.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js compatible with the versions required by the installed Vite and TypeScript dependencies.
- npm (or Bun, if you choose to use the included `bun.lock`).
- A Gemini API key for AI features.
- A Google Maps Platform API key for map functionality.

### 1. Clone the repository

Replace the placeholder with your GitHub repository URL:

```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPOSITORY>.git
cd <YOUR-REPOSITORY>
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or, if you prefer Bun and have it installed:

```bash
bun install
```

Use one package manager consistently and commit only the corresponding lockfile you intend to maintain.

### 3. Configure environment variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Set the values described below. Never commit `.env` or real API keys.

### 4. Start the application

```bash
npm run dev
```

The current Express server sets its port to `3000` in `server.ts`. Open:

```text
http://localhost:3000
```

### 5. Create a production build

```bash
npm run build
```

### 6. Run the TypeScript check

The project defines:

```bash
npm run lint
```

In this repository, the `lint` script runs `tsc --noEmit`; it is a type-check command, not a full ESLint run.

For a production deployment, also test the server startup and the deployed API routes. A successful Vite build alone does not verify every backend workflow.

---

## 🔐 Environment Variables

The repository includes an `.env.example` with these variables:

| Variable | Required? | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Optional for basic operation; needed for Gemini-backed features | Server-side Gemini AI integration for semantic search, image analysis, and match comparison |
| `VITE_GOOGLE_MAPS_API_KEY` | Needed for Google Maps features | Browser-side Google Maps key; restrict it by allowed HTTP referrers and required APIs |
| `APP_URL` | Recommended | Base URL for the deployed application |
| `TWILIO_ACCOUNT_SID` | Optional | Twilio account identifier for SMS delivery, if implemented/configured |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio credential; keep it server-side and secret |
| `TWILIO_PHONE_NUMBER` | Optional | Configured Twilio sending number |
| `SMTP_HOST` | Optional | SMTP server host for email delivery |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP password; never expose it to the frontend |

Example `.env` format:

```dotenv
GEMINI_API_KEY="replace-with-your-server-side-gemini-key"
VITE_GOOGLE_MAPS_API_KEY="replace-with-your-restricted-google-maps-key"
APP_URL="http://localhost:3000"

# Optional external delivery providers
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
SMTP_HOST=""
SMTP_USER=""
SMTP_PASS=""
```

**Security notes:**

- Do not put `GEMINI_API_KEY`, SMTP credentials, or Twilio secrets in variables prefixed with `VITE_`.
- A `VITE_` variable is exposed to browser-side code. Restrict the Google Maps key by HTTP referrer and API.
- `.env.example` should contain placeholders only.
- Rotate any credential that has accidentally been committed or shared.
- Verify which optional provider variables are actively used by the current server before relying on them.

---

## 🔌 API Overview

The current `server.ts` includes routes in the following areas. Check the source for exact request and response schemas.

| Area | Example endpoints | Purpose |
|---|---|---|
| Authentication | `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me` | Sign-in, registration, sign-out and current user |
| Bootstrap | `GET /api/bootstrap` | Load the user's authorized application data |
| Profile | `POST /api/profile/update` | Update profile information |
| Reports | `POST /api/reports` | Create a lost/found report |
| Matches | `POST /api/matches/:id/status`, `POST /api/matches/analyze/:reportId` | Update match state and analyze candidates |
| Archive | `POST /api/reports/:id/archive`, `POST /api/reports/:id/restore` | Archive or restore reports |
| Claims | `POST /api/claims`, `POST /api/claims/:id/review` | Create and review ownership claims |
| Handover | `POST /api/handover/:claimId/regenerate`, `POST /api/handover/validate` | Regenerate and validate handover tokens |
| Verification | `/api/verification/*` | Email, phone and identity verification workflows |
| Chat | `POST /api/chat/:conversationId/messages`, `POST /api/chat/:conversationId/report-abuse` | Send messages and report abuse |
| Administration | `/api/admin/*` | Report flagging, verification review and dispute resolution |
| Disputes | `POST /api/disputes`, `POST /api/admin/disputes/:id/resolve` | Submit and resolve disputes |
| AI | `POST /api/ai/smart-search`, `POST /api/ai/compare-match`, `POST /api/ai/analyze-image` | AI-assisted search, comparison and image analysis |

These routes are an overview from the included server source, not a guarantee that every route is production-ready. Confirm authorization, validation, and response behavior before exposing the API publicly.

---

## 🧠 Engineering Approach

Findora is designed around a complete, traceable workflow rather than an unstructured list of found objects.

### 1. Structured reporting

Collect consistent fields for item type, appearance, distinguishing details, approximate location, and incident time. Structured reports make filtering and matching more useful.

### 2. Candidate discovery

Combine conventional filtering with AI-assisted analysis where configured. Candidate ranking should consider multiple signals and remain explainable. AI suggestions do not establish ownership.

### 3. Human-confirmed ownership

Keep the claimant, finder, and authorized staff involved in confirming a match. Private clues and verification evidence should not be exposed in public listings.

### 4. Auditable handover

Use a controlled claim and handover process. Sensitive actions should be authorized, validated, and recorded. A QR code or OTP is a workflow mechanism, not a replacement for authorization.

### 5. Incremental development

Extend existing components and API contracts rather than rewriting the application unnecessarily. Add tests for status transitions, permissions, and failure cases before expanding the feature set.

---

## 🗺️ Roadmap

The following are **potential future enhancements**, not a claim that they are already implemented:

- [ ] Dedicated image-embedding search and visual similarity ranking.
- [ ] Voice-to-report input with confirmation before submission.
- [ ] More explainable and calibrated match ranking.
- [ ] Saved searches and watchlist notifications.
- [ ] Duplicate-report warnings before submission.
- [ ] Campus heatmaps based on appropriately aggregated data.
- [ ] Institution workspaces with server-enforced tenant isolation.
- [ ] Production database and versioned schema migrations.
- [ ] More comprehensive integration and end-to-end tests.
- [ ] Offline-friendly report drafts.
- [ ] Expanded multilingual search.
- [ ] Production-ready deployment and operational monitoring.
- [ ] Improved onboarding and accessible Canvas tutorials.
- [ ] Additional anti-abuse controls and privacy review.

Prioritize reliability and security of the report-to-return workflow before adding more advanced features.

---

## 🛡️ Security, Privacy & Production Readiness

This codebase includes demo-oriented data and role-switching behavior, as well as JSON-file persistence. These are important considerations before public deployment.

Before using real user data:

1. Review the demo-token and role-switching logic. A client-controlled role selector must never grant real privileged access.
2. Verify authentication and authorization on every protected server endpoint.
3. Review password hashing, session lifetime, token handling, and password-reset flows.
4. Confirm that private ownership clues, verification evidence, and contact information are not returned by public endpoints.
5. Restrict and validate uploaded files.
6. Add rate limits to login, verification, messaging, and claim attempts.
7. Confirm that OTPs and handover tokens expire, are single-use where appropriate, and cannot be brute-forced.
8. Use persistent production-grade storage with backups and a migration strategy.
9. Ensure deployment storage survives restarts if file persistence is retained temporarily.
10. Configure HTTPS, secure headers, logging, monitoring, and safe error messages.
11. Define data-retention and deletion policies.
12. Test cross-user and cross-role access explicitly.

Do not treat this README as a security audit or a claim of production readiness. Conduct a code and deployment review before handling sensitive personal information.

---

## 🧪 Testing Checklist

Before a release, verify the following in the actual running application:

- [ ] Registration and login work.
- [ ] Unauthorized users cannot access protected routes.
- [ ] Lost and found reports can be created and loaded.
- [ ] Search and filters return the correct records.
- [ ] AI features fail gracefully when no Gemini key is configured.
- [ ] Match suggestions and status transitions behave correctly.
- [ ] Claims can be submitted and reviewed by authorized roles.
- [ ] QR/OTP handover validation rejects invalid or expired tokens.
- [ ] Verification workflows protect private evidence.
- [ ] Chat and abuse reporting respect access rules.
- [ ] Archive and restore preserve report data.
- [ ] The Canvas Protocol workflows remain functional.
- [ ] Map functionality works with a restricted Google Maps key.
- [ ] English/Hindi and light/dark preferences work.
- [ ] The application handles an empty or malformed data store safely.
- [ ] Build, type-check, and backend tests pass.
- [ ] Mobile layouts are usable without unintended horizontal scrolling.

---

## 🤝 Contributing

Contributions and issue reports are welcome.

A suggested contribution workflow:

1. Fork the repository.
2. Create a focused branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make a small, scoped change.
4. Add or update tests.
5. Run:
   ```bash
   npm run lint
   npm run build
   ```
6. Check for secrets and private data:
   ```bash
   git diff --check
   ```
7. Submit a pull request describing the change, its tests, and any configuration requirements.

Avoid committing `.env` files, real user records, tokens, private images, or generated runtime database files.

## 🏆 Hackathon Context

Findora is intended to address the digital lost-and-found challenge by connecting item reporting, discovery, potential matching, ownership verification, and return workflows in a single application. The Interactive Canvas provides a visual, drag-and-drop approach to navigating those operations.

When preparing a submission or live demo, clearly distinguish existing working features from planned improvements and use only authorized demonstration accounts and data.

## 📄 License

No license has been selected in this project yet. Before publishing the repository, choose an appropriate open-source or proprietary license and add the corresponding `LICENSE` file. Do not claim a license until it has been added.

---

<div align="center">

**Findora — Helping lost belongings find their way home.**

Built with React, TypeScript, Express, Gemini AI, and a focus on safer returns.

</div>
