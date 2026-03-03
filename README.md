<div align="center">

<img src="https://img.shields.io/badge/ManakAI-BIS%20Compliance%20Platform-gold?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTJDNCA3IDE0IDE3IDIyIDE3VjdMMTIgMloiIGZpbGw9IiNGNUM1MjIiLz48L3N2Zz4=&logoColor=black" />

# ManakAI

### 🏛️ Institutional Quality & AI Compliance Monitoring System

**Built for the BIS × VIT Chennai Hackathon — AI Compliance Track**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-ff0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> ManakAI is a **multimodal AI-powered compliance monitoring platform** designed for Indian educational institutions. It provides real-time infrastructure scanning, curriculum auditing, and regulatory gap detection against BIS standards.

</div>

---

## 🌟 What It Does

ManakAI acts as a **24/7 AI compliance auditor** — it can look at a photo of your lab, read your curriculum documents, and instantly tell you exactly which BIS/ISO clauses you're violating and how to fix them. Think of it as a QA engineer that never sleeps and knows every Indian standard by heart.

```
Upload photo → AI scans infrastructure → Flags BIS violations → Generates remediation report
Upload syllabus → AI parses curriculum → Detects skill gaps → Maps to India AI Sutra 2026
Ask a question → AI searches standards knowledge base → Cites exact clauses → Answers instantly
```

---

## 🎥 Features at a Glance

<table>
<tr>
<td width="50%" valign="top">

### 🎛️ Command Center Dashboard
- Animated **Institutional Quality Score** radial gauge (0–100)
- **Compliance Heatmap** — building-wise status grid
- Live **Audit Feed** with 30-second auto-refresh
- Trend cards with real-time deltas for Infrastructure, Academic & Governance

</td>
<td width="50%" valign="top">

### 🔍 Vision-Audit Scanner
- **Drag-and-drop image upload** powered by Google Gemini Vision
- Gold **laser scan animation** (5-second sweep effect)
- **AR-style tags** overlaid on real image regions
- BIS clause citations with one-click **Remediate actions**

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📄 Document Analysis Lab
- **AI-powered syllabus/policy analysis** against IS 15700 & ISO 42001
- Dual-pane layout — document left, AI report right
- Detects **skill gaps vs. India AI Sutra 2026**
- "Probable Upgrade" recommendations with priority scoring

</td>
<td width="50%" valign="top">

### 📚 Standards Wiki + Ask the Auditor
- Searchable knowledge base of **6 BIS/ISO standards**
- Full mandatory-requirement breakdowns per clause
- **RAG-style chat interface** — ask anything, get cited answers
- Real-time AI responses powered by Gemini 1.5 Flash

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  ManakAI Frontend                    │
│   Next.js 14 · TypeScript · Tailwind · Framer Motion │
├────────────┬────────────┬────────────┬───────────────┤
│  Dashboard │Vision Audit│  Doc Lab   │  Standards Wiki│
│   /dash    │/vision-aud │ /doc-anal  │    /wiki       │
└────────────┴────────────┴────────────┴───────────────┘
                          │
              ┌───────────▼───────────┐
              │    Next.js API Routes  │
              │  /api/vision-audit     │
              │  /api/analyze-document │
              │  /api/chat             │
              │  /api/translate        │
              │  /api/audit-logs       │
              │  /api/dashboard-stats  │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │   Google Gemini API    │
              │  gemini-1.5-flash-8b   │
              │  (multimodal vision +  │
              │   structured outputs)  │
              └───────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Full-stack React + API routes |
| Language | **TypeScript** | Type safety across the board |
| AI Engine | **Google Gemini 1.5 Flash** | Vision, NLP, structured JSON outputs |
| Styling | **Tailwind CSS + Shadcn/ui** | Design system + components |
| Animation | **Framer Motion** | Scan effects, transitions, gauges |
| Icons | **Lucide React** | Consistent icon set |

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Duke-Of-Madras/ManakAI.git
cd ManakAI

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Add your GOOGLE_GENERATIVE_AI_API_KEY in .env.local

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it auto-redirects to `/dashboard`.

> **Note:** You'll need a [Google AI Studio](https://aistudio.google.com/) API key (free tier works fine).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (dark shell + sidebar)
│   ├── page.tsx                    # Redirects → /dashboard
│   ├── dashboard/page.tsx          # 📊 Overview Dashboard
│   ├── vision-audit/page.tsx       # 🔍 Vision-Audit Scanner
│   ├── document-analysis/page.tsx  # 📄 Document Analysis Lab
│   ├── wiki/page.tsx               # 📚 Standards Wiki + Chat
│   ├── logs/page.tsx               # 📋 Audit Logs & Reports
│   └── api/
│       ├── vision-audit/           # Gemini Vision → BIS gap analysis
│       ├── analyze-document/       # Syllabus → skill gap detection
│       ├── chat/                   # Standards RAG chat endpoint
│       ├── translate/              # Multi-language support
│       ├── audit-logs/             # Activity log persistence
│       └── dashboard-stats/        # Real-time metrics aggregation
├── components/
│   ├── Sidebar.tsx                 # Persistent navigation
│   └── ui/                         # Shadcn component library
├── hooks/
│   └── useManakAI.ts               # Global data hook
└── lib/
    ├── manakEngine.ts              # BIS CARE intelligence engine
    ├── scan-store.ts               # Vision scan state management
    └── utils.ts                    # Shared utilities
```

---

## 📜 Standards Referenced

| Standard | Domain | Scope |
|---|---|---|
| **IS 15700:2018** | Quality Management for Educational Orgs | Curriculum, faculty, infrastructure |
| **ISO 42001:2023** | AI Management System (AIMS) | AI governance, risk management |
| **India AI Sutra 2026** | National AI Ethics & Deployment | Responsible AI in education |
| **IS 14489:2018** | Occupational Health & Safety in Labs | Lab safety protocols |
| **IS 732:2019** | Electrical Wiring Installations | Electrical compliance in buildings |
| **IS 3103:1975** | Industrial Ventilation | Ventilation standards for labs |

---

## 🚀 What Makes This Different

Most compliance tools are PDF checklists. **ManakAI is different:**

- 📸 **You can literally photograph your lab** and get an AI-generated BIS audit report in seconds
- 📋 **Upload your syllabus** — it cross-references every topic against IS 15700 and India AI Sutra 2026
- 💬 **Ask natural language questions** — "Does our lab pass IS 14489?" — and get cited answers
- 🌐 **Multi-language support** — outputs available in regional Indian languages via the translate API

---

## 👨‍💻 Team

**VIT Chennai** — BIS × VIT Hackathon, AI Compliance Track

---

<div align="center">

*Built with ❤️ for institutional quality excellence.*

⭐ **Star this repo if you find it useful!** ⭐

</div>
