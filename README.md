# ManakAI — Institutional Quality & Compliance Monitoring System

> **BIS Project Compliance-AI Track** | VIT Chennai × Bureau of Indian Standards

ManakAI is a multimodal AI-powered compliance monitoring platform designed for Indian educational institutions. It provides real-time infrastructure scanning, curriculum auditing, and regulatory gap detection against BIS standards including IS 15700, ISO 42001, and the India AI Sutra 2026 framework.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, Shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |

## Features

### 🎛️ Command Center Dashboard (`/dashboard`)
- Institutional Quality Score — animated radial gauge (0–100)
- Compliance Heatmap — building-wise status grid (Compliant / Warning / Critical)
- Live Audit Feed — real-time event log with 30-second auto-refresh
- Trend Cards — Infrastructure, Academic, and Governance metrics with deltas

### 🔍 Vision-Audit Scanner (`/vision-audit`)
- Drag-and-drop image upload zone
- Gold laser scan animation (5-second sweep)
- Interactive AR tags overlaid on scanned images (ISI Certified / Quality Gap)
- Split-view gap detection panel with BIS clause citations and "Remediate" actions

### 📄 Document Analysis Lab (`/document-analysis`)
- Dual-pane analyzer — document preview (left), AI Auditor report (right)
- Skill gap detection against India AI Sutra 2026 and ISO 42001
- Quality compliance checks and "Probable Upgrade" recommendations

### 📚 Standards Wiki (`/wiki`)
- Searchable knowledge base of BIS/ISO standards
- Detailed mandatory requirements for each standard
- "Ask the Auditor" — interactive RAG-style chat interface

### 📋 Audit Logs & Reports (`/logs`)
- Chronological activity timeline with module filters
- Score badges for scored audit entries
- **"Generate BIS-Ready Audit Report"** — gold CTA with progress bar and PDF preview

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ installed
- npm (comes with Node.js)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd Manak

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app redirects to `/dashboard` automatically.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark theme shell + sidebar)
│   ├── page.tsx                # Redirects to /dashboard
│   ├── dashboard/page.tsx      # Overview Dashboard
│   ├── vision-audit/page.tsx   # Vision-Audit Scanner
│   ├── document-analysis/page.tsx  # Document Analysis Lab
│   ├── wiki/page.tsx           # Standards Wiki
│   └── logs/page.tsx           # Audit Logs & Reports
├── components/
│   ├── Sidebar.tsx             # Persistent navigation sidebar
│   └── ui/                     # Shadcn/ui components
├── hooks/
│   └── useManakAI.ts           # Central data hook (live-updating mock data)
└── lib/
    ├── manakEngine.ts          # Mock BIS CARE intelligence engine
    └── utils.ts                # Utility functions
```

## Standards Referenced

| Standard | Domain |
|---|---|
| IS 15700:2018 | Quality Management for Educational Orgs |
| ISO 42001:2023 | AI Management System (AIMS) |
| India AI Sutra 2026 | National AI Ethics & Deployment Guidelines |
| IS 14489:2018 | Occupational Health & Safety in Labs |
| IS 732:2019 | Electrical Wiring Installations |
| IS 3103:1975 | Industrial Ventilation |

## Team

**VIT Chennai** — BIS Project Compliance-AI Track

---

*Built with ❤️ for institutional quality excellence.*
