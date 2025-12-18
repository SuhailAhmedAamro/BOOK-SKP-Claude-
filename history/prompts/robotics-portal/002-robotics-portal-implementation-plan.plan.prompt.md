---
id: 002
title: Robotics Portal Implementation Plan
stage: plan
date: 2025-12-18
surface: agent
model: claude-sonnet-4-5-20250929
feature: robotics-portal
branch: 001-robotics-portal
user: Suhail Ahmed
command: /sp.plan
labels: ["planning", "architecture", "docusaurus", "fastapi", "rag", "design"]
links:
  spec: specs/001-robotics-portal/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-robotics-portal/plan.md
  - specs/001-robotics-portal/research.md
  - specs/001-robotics-portal/data-model.md
  - specs/001-robotics-portal/quickstart.md
  - specs/001-robotics-portal/contracts/api.openapi.yaml
tests:
  - N/A (Planning artifacts)
---

## Prompt

```text
# Implementation Plan: Physical AI Textbook & RAG Portal

## Phase 1: Environment & Book Scaffolding (Day 1)
- [ ] Initialize Docusaurus with TypeScript.
- [ ] Configure Tailwind CSS and Shadcn/UI for custom components.
- [ ] Create folder structure for `docs/` (Week 1 to Week 13).
- [ ] **Task:** Use Claude Subagents to generate Week 1 & 2 content with LaTeX and Mermaid diagrams.

## Phase 2: Backend & Database Setup (Day 1-2)
- [ ] Setup FastAPI server for the RAG engine.
- [ ] Connect Neon Postgres for user profiles and session management.
- [ ] Initialize Qdrant Cloud and write a script to embed/index the MDX files.
- [ ] **Task:** Deploy the backend to Vercel or Railway.

## Phase 3: Auth & Personalization (Day 2)
- [ ] Integrate Better-Auth with Docusaurus.
- [ ] Create a custom Signup page asking about "Hardware/Software background".
- [ ] Implement the `PersonalizeButton` component that fetches user-specific content from the AI.
- [ ] **Task:** Add the Urdu translation logic using OpenAI's GPT-4o API.
```

## Response snapshot

Created comprehensive implementation plan with full architecture design across multiple artifacts:

**plan.md (169 lines)**: Main implementation plan
- Summary: Docusaurus + TypeScript + Tailwind CSS frontend, FastAPI + Python 3.11 backend
- Technical Context: Languages (TypeScript 5.x, Python 3.11), Dependencies (Docusaurus v3, React 18, FastAPI, OpenAI SDK, Qdrant, Neon Postgres, Better-Auth), Performance goals (<5s page load, <3s chatbot P95, 100 concurrent users)
- Constitution Check: ✅ PASS on all 6 core principles (Technical Accuracy, Visual Communication, Adaptive Learning, Self-Assessment, AI Transparency, Bilingual Support)
- Project Structure: Web application with separate frontend/ and backend/ directories, detailed file tree with 50+ files mapped
- Complexity Tracking: No violations detected

**research.md (238 lines)**: Phase 0 architecture decisions
- Decision 1: Docusaurus v3 (purpose-built for docs, MDX support, LaTeX/Mermaid plugins)
- Decision 2: FastAPI (async support, OpenAI SDK compatibility, auto-generated OpenAPI)
- Decision 3: Better-Auth (modern type-safe auth, OAuth + email/password)
- Decision 4: Qdrant Cloud (managed vector DB, sub-100ms search, free tier)
- Decision 5: Neon Serverless Postgres (autoscaling, branching, 0.5GB free tier)
- Decision 6: Pre-compute embeddings offline (performance + cost optimization)
- Decision 7: Selection RAG (highlighted text + vector search for grounded responses)
- Decision 8: Urdu translation (UI strings in Phase 1, content in Phase 2)
- Decision 9: PostHog analytics (privacy-first, 1M events/month free)
- Decision 10: Vercel (frontend) + Railway (backend) deployment
- Best practices: Docusaurus+Tailwind integration, KaTeX for LaTeX (10x faster than MathJax), RAG prompt engineering with XML-like tags

**data-model.md (404 lines)**: Phase 1 database schemas
- Relational DB (Neon Postgres): 4 tables (users, user_progress, chat_messages, sessions)
- ERD with Mermaid diagram showing relationships
- Detailed table schemas with validation rules, indexes, constraints
- Vector DB (Qdrant): Collection config (1536-dim embeddings, HNSW index, cosine similarity)
- Payload schema: week, section, difficulty, language, text_chunk, chunk_index
- State machine for user progress (NotStarted → InProgress → QuizTaken → Completed)
- Alembic migration strategy with initial SQL schema
- Security considerations: bcrypt password hashing, SQL injection prevention, session security
- Performance optimizations: connection pooling, query indexes, vector search O(log N)

**quickstart.md (354 lines)**: Developer setup guide
- Prerequisites: Node.js 18+, Python 3.11, Git
- Step-by-step setup: Clone repo, install deps, configure .env files
- Database setup: Alembic migrations, table verification
- Seed Qdrant: Run embedding script to index 13 weeks of content
- Run dev servers: Backend (uvicorn port 8000), Frontend (Docusaurus port 3000)
- Verification steps: Test frontend rendering, backend API health check, RAG chatbot
- Troubleshooting: 7 common issues with solutions
- Development workflow: Making changes, adding endpoints, schema migrations
- Testing commands: Frontend (npm test), Backend (pytest), E2E (Playwright)
- Deployment checklist: 10 pre-deployment tasks

**contracts/api.openapi.yaml (395 lines)**: OpenAPI 3.1 API specification
- 9 endpoints across 4 tags (auth, chat, progress, analytics)
- Auth: POST /signup, POST /login, GET /oauth/{provider}, GET /me
- Chat: POST /chat (RAG chatbot), GET /chat/history
- Progress: GET /progress (all weeks), PUT /progress/{week_number}
- Analytics: POST /analytics/event (PostHog logging)
- Security: Bearer JWT authentication (Better-Auth)
- Schemas: UserResponse, ChatMessage, WeekProgress, Error
- Request/response examples with validation rules

**Total Planning Artifacts**: 5 files, ~1500 lines of comprehensive design documentation

## Outcome

- ✅ Impact: Complete architecture design ready for `/sp.tasks` command to generate implementation tasks; all technical unknowns resolved through research phase
- 🧪 Tests: Constitution check passed all 6 principles; quality gates defined for ROS 2 content validation, diagram rendering, Urdu translation review
- 📁 Files: 5 files created (plan.md, research.md, data-model.md, quickstart.md, api.openapi.yaml)
- 🔁 Next prompts: `/sp.tasks` to generate dependency-ordered task list from plan, or begin implementation starting with Phase 1 (Environment & Book Scaffolding)
- 🧠 Reflection: Plan successfully bridges business requirements (from spec.md) to technical implementation details while preserving constitution compliance. Research phase resolved all architectural decisions (10 decisions documented with alternatives considered). Data model provides complete schemas for both relational (Postgres) and vector (Qdrant) databases. Quickstart enables developer onboarding in <1 hour. API contracts enable parallel frontend/backend development. Ready for task decomposition.

## Evaluation notes (flywheel)

- Failure modes observed: None (planning phase successful)
- Graders run and results (PASS/FAIL): Constitution Check PASS (all 6 principles compliant)
- Prompt variant (if applicable): User provided high-level phase outline; expanded to full architecture design with 10 research decisions
- Next experiment (smallest change to try): Generate tasks.md via `/sp.tasks` and validate that task decomposition aligns with user stories (P1 MVP → P2 enhancement → P3 retention) and enables incremental delivery
