# Implementation Plan: Physical AI & Humanoid Robotics Portal

**Branch**: `001-robotics-portal` | **Date**: 2025-12-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-robotics-portal/spec.md`

**Note**: This plan covers the complete architecture for a web-based educational portal with RAG chatbot, bilingual support, and progress tracking.

## Summary

Build a Docusaurus-based educational portal for Panaversity's Physical AI & Humanoid Robotics course featuring 13 weeks of structured content with LaTeX equations, Mermaid diagrams, adaptive learning paths (Beginner/Advanced), English/Urdu translation toggle, RAG chatbot with selection-based context, user authentication, and progress tracking. Frontend uses Docusaurus v3+ with TypeScript and Tailwind CSS. Backend uses FastAPI with Neon Postgres for user data and Qdrant for vector embeddings.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.11+ (backend)
**Primary Dependencies**: Docusaurus v3+, React 18+, Tailwind CSS, FastAPI, OpenAI SDK, Qdrant Client, Neon Postgres Client, Better-Auth
**Storage**: Neon Serverless Postgres (user data, progress, chat history), Qdrant Cloud (vector embeddings), Static MDX files (content)
**Testing**: Jest + React Testing Library (frontend), Pytest (backend), Playwright (E2E)
**Target Platform**: Web (Chrome/Firefox/Safari), responsive down to 375px mobile
**Project Type**: Web application (separate frontend and backend)
**Performance Goals**: <5s page load, <3s chatbot P95 latency, 100 concurrent users, 90% render success for LaTeX/Mermaid
**Constraints**: <200ms API response time, WCAG 2.1 AA accessibility, privacy-compliant analytics
**Scale/Scope**: 13 content pages, ~50-100 MDX files total (including sub-sections), expected 1000+ students/cohort

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

- ✅ **Technical Accuracy & Standards Compliance**: ROS 2 content targets Humble/Iron (per constitution), LaTeX for equations, code follows PEP 8
- ✅ **Visual Communication First**: Mermaid.js diagrams mandatory per week, architecture visualizations planned
- ✅ **Adaptive Learning Paths**: Content tagged [Beginner]/[Advanced], personalization component planned
- ✅ **Mandatory Self-Assessment**: Each week includes MCQs + coding challenges per constitution requirements
- ✅ **AI-Native Authorship Transparency**: Portal acknowledges AI-assisted content generation, RAG chatbot integrated
- ✅ **Bilingual Support (English/Urdu)**: Translation toggle implemented, technical terms preserved per constitution

### Content Standards Compliance

- ✅ **Chapter Structure**: Each week follows constitution's 6-part structure (Learning Objectives → Conceptual Overview → Hands-On Tutorial → Advanced Topics → Self-Assessment → Further Resources)
- ✅ **Code Example Requirements**: Examples executable in ROS 2 Humble/Iron, prerequisite instructions included
- ✅ **Mathematical Rigor**: LaTeX equations with step-by-step derivations, variable definitions

### Quality Gates

- ✅ All code examples will be tested in ROS 2 Humble environment (content authoring workflow)
- ✅ Mermaid diagrams rendering validated via Docusaurus preview
- ✅ Self-assessment MCQs reviewed (content review process)
- ✅ Urdu translations validated by native speaker (separate workflow)

**Gate Status**: ✅ **PASS** - No constitution violations detected

## Project Structure

### Documentation (this feature)

```text
specs/001-robotics-portal/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (architecture decisions)
├── data-model.md        # Phase 1 output (database schemas)
├── quickstart.md        # Phase 1 output (developer setup)
├── contracts/           # Phase 1 output (API contracts)
│   ├── api.openapi.yaml # FastAPI OpenAPI schema
│   └── frontend-backend.md # Interface documentation
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend)

# Frontend: Docusaurus portal
frontend/
├── docs/                    # 13 weeks of MDX content
│   ├── week-01/
│   │   ├── index.mdx       # Learning objectives, overview
│   │   ├── tutorial.mdx    # Hands-on exercises
│   │   ├── advanced.mdx    # Advanced topics
│   │   └── assessment.mdx  # Self-assessment MCQs
│   ├── week-02/
│   └── ...week-13/
├── src/
│   ├── components/
│   │   ├── PersonalizeButton.tsx    # Difficulty filter
│   │   ├── TranslateToggle.tsx      # English/Urdu switch
│   │   ├── ChatWidget.tsx           # RAG chatbot UI
│   │   ├── ProgressTracker.tsx      # Completion visualization
│   │   └── SelfAssessment.tsx       # MCQ component
│   ├── pages/
│   │   ├── index.tsx                # Homepage
│   │   ├── dashboard.tsx            # User progress dashboard
│   │   └── auth/
│   │       ├── signup.tsx           # Registration (skill level)
│   │       └── login.tsx            # Authentication
│   ├── services/
│   │   ├── authService.ts           # Better-Auth integration
│   │   ├── chatService.ts           # API calls to FastAPI
│   │   └── analyticsService.ts      # PostHog integration
│   ├── hooks/
│   │   ├── usePersonalization.ts    # Content filtering logic
│   │   ├── useTranslation.ts        # Language switching
│   │   └── useProgress.ts           # Track completion
│   ├── i18n/
│   │   ├── en.json                  # English translations
│   │   └── ur.json                  # Urdu translations
│   └── theme/
│       └── custom.css               # Tailwind customizations
├── static/
│   └── img/                         # Isaac Sim screenshots, diagrams
├── docusaurus.config.ts             # Docusaurus configuration
├── package.json
└── tsconfig.json

# Backend: FastAPI RAG engine
backend/
├── src/
│   ├── main.py                      # FastAPI app entry
│   ├── models/
│   │   ├── user.py                  # User model (Pydantic + SQLAlchemy)
│   │   ├── chat_message.py          # Chat history model
│   │   └── progress.py              # Week completion model
│   ├── api/
│   │   ├── auth.py                  # Authentication endpoints
│   │   ├── chat.py                  # RAG chatbot endpoints
│   │   ├── progress.py              # Progress tracking endpoints
│   │   └── analytics.py             # Analytics event logging
│   ├── services/
│   │   ├── auth_service.py          # Better-Auth backend logic
│   │   ├── rag_service.py           # OpenAI + Qdrant integration
│   │   ├── embedding_service.py     # Text chunking + embedding
│   │   └── postgres_service.py      # Database operations
│   ├── db/
│   │   ├── database.py              # Neon Postgres connection
│   │   └── migrations/              # Alembic migrations
│   ├── vector/
│   │   └── qdrant_client.py         # Qdrant Cloud integration
│   └── utils/
│       ├── selection_rag.py         # Selection-based context extraction
│       └── translation.py           # Urdu translation helpers
├── scripts/
│   └── embed_content.py             # Script to index MDX files in Qdrant
├── tests/
│   ├── test_api/
│   ├── test_services/
│   └── test_rag.py
├── requirements.txt
└── .env.example

# Shared configuration
.github/
└── workflows/
    ├── frontend-deploy.yml          # Vercel/GitHub Pages deployment
    └── backend-deploy.yml           # Railway/Vercel deployment

README.md
```

**Structure Decision**: Web application with separate frontend (Docusaurus + TypeScript) and backend (FastAPI + Python). Frontend serves static MDX content with dynamic components; backend provides RAG chatbot, authentication, and progress tracking APIs. This separation allows independent scaling and deployment.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No complexity violations detected.** Project follows standard web application patterns appropriate for educational portal with AI features.

