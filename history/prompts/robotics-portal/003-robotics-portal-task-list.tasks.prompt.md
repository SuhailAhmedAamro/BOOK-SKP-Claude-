---
id: 003
title: Robotics Portal Task List
stage: tasks
date: 2025-12-18
surface: agent
model: claude-sonnet-4-5-20250929
feature: robotics-portal
branch: 001-robotics-portal
user: Suhail Ahmed
command: /sp.tasks
labels: ["tasks", "implementation", "checklist", "user-stories"]
links:
  spec: specs/001-robotics-portal/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-robotics-portal/tasks.md
tests:
  - N/A (Task decomposition artifact)
---

## Prompt

```text
# Project Task List: Physical AI Textbook

## [TASK-01] Frontend Foundation & UI Components
- [ ] Initialize Docusaurus with TypeScript and Tailwind CSS.
- [ ] Create `src/components/ActionButtons.tsx` for 'Personalize' and 'Urdu Translate' buttons.
- [ ] Create `src/theme/Root.tsx` to wrap the app in `ChatKitProvider` and `AuthProvider`.

## [TASK-02] Content Generation (Weeks 1-13)
- [ ] Generate `docs/week-1-intro.mdx` with LaTeX equations for State Estimation.
- [ ] Generate `docs/week-2-ros2.mdx` with Mermaid diagrams for Node Communication.
- [ ] Generate all remaining weeks (3-13) based on the course syllabus.
- [ ] Add "Assessment" MCQs at the end of each chapter.

## [TASK-03] Authentication & User Context
- [ ] Setup `better-auth` client in Docusaurus.
- [ ] Build a custom `/signup` page with a questionnaire:
    - Experience: Beginner, Intermediate, Pro.
    - Focus: Software (Python/AI) or Hardware (Control/Electronics).
- [ ] Store this profile data in Neon Postgres via the FastAPI backend.
```

## Response snapshot

Generated comprehensive task list with 94 tasks organized across 6 phases aligned to user story priorities:

**Phase 1: Setup** (10 tasks, all parallelizable)
- T001-T010: Initialize Docusaurus + FastAPI, configure Tailwind/LaTeX/Mermaid, create .env files, setup PostHog analytics

**Phase 2: Foundational** (12 tasks, 11 parallelizable, BLOCKS all user stories)
- T011-T022: Setup Neon Postgres + Alembic migrations, create Qdrant collection, configure Better-Auth (frontend + backend), setup i18n structure, configure Docusaurus with plugins

**Phase 3: User Story 1 - Content Learning Journey (P1 MVP)** (20 tasks, 17 parallelizable)
- T023-T030: Create 13 weeks of MDX content with LaTeX equations, Mermaid diagrams, difficulty tags [Beginner]/[Advanced]
- T031-T038: Build PersonalizeButton, TranslateToggle, SelfAssessment components; populate en.json/ur.json translations
- T039-T042: Test LaTeX/Mermaid rendering, personalization filtering, Urdu translation toggle
- **Independent Test**: Access Week 1, view equations/diagrams, toggle language, filter by difficulty, complete MCQs

**Phase 4: User Story 2 - Context-Aware AI Assistant (P2)** (18 tasks, 11 parallelizable)
- T043-T049: Create ChatMessage model, embedding service, RAG service with Selection RAG logic, vector search with metadata filtering
- T050-T052: Build /api/chat and /api/chat/history endpoints with rate limiting
- T053-T057: Create ChatWidget component with text selection listener, chatService.ts, source citations display
- T058-T060: Test Selection RAG, rate limiting (6th query blocks anonymous users), chatbot P95 latency <3s
- **Independent Test**: Highlight text in Week 3, ask question, verify grounded response with citations

**Phase 5: User Story 3 - Progress Tracking & Authentication (P3)** (23 tasks, 16 parallelizable)
- T061-T063: Create User, UserProgress, Session models
- T064-T069: Build auth endpoints (signup, login, OAuth, /me) and progress endpoints (GET /progress, PUT /progress/{week})
- T070-T074: Create signup/login pages, dashboard with ProgressTracker component, useProgress hook
- T075-T079: Add "Mark Complete" checkboxes, persist preferences, save chat history for authenticated users, build ChatHistory sidebar
- T080-T083: Test signup/OAuth flows, progress persistence, dashboard completion %
- **Independent Test**: Create account, mark Week 1 complete, log out/in, verify persistence

**Phase 6: Polish & Cross-Cutting** (11 tasks, all parallelizable)
- T084-T094: Responsive CSS, Lighthouse audit (95+ accessibility score), error boundaries, graceful degradation, HTTPS/security headers, deployment (Vercel + Railway), PostHog event tracking, quickstart validation

**Task Organization**:
- All tasks follow strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- Parallel markers [P] on 66 tasks (70% parallelizable)
- Story labels [US1], [US2], [US3] map tasks to user stories
- Exact file paths for every implementation task

**Dependencies & Execution Order**:
- Setup → Foundational → User Stories (in parallel or P1→P2→P3) → Polish
- US1, US2, US3 are independent after Foundational phase completes
- Minimal coupling: US3 optionally saves chat history from US2 endpoint

**MVP Scope** (Recommended first release):
- Phase 1 + Phase 2 + Phase 3 = 42 tasks
- Estimated: 3-5 days (parallelized), 7-10 days (sequential)
- Delivers: 13 weeks of content with personalization, translation, self-assessment

**Full Feature** (All 3 user stories):
- All 94 tasks
- Estimated: 7-10 days (parallelized), 15-20 days (sequential)
- Delivers: Complete portal with RAG chatbot, auth, progress tracking

**Parallel Opportunities**:
- Phase 1: All 10 tasks parallel
- Phase 2: 11 of 12 tasks parallel
- US1: 17 of 20 tasks parallel (all 13 weeks' content can be created simultaneously)
- US2: 11 of 18 tasks parallel
- US3: 16 of 23 tasks parallel
- Phase 6: All 11 tasks parallel

File created: `specs/001-robotics-portal/tasks.md` (427 lines)

## Outcome

- ✅ Impact: Complete task decomposition ready for implementation; all 3 user stories are independently executable with clear acceptance criteria
- 🧪 Tests: Each user story phase includes testing tasks (T039-T042 for US1, T058-T060 for US2, T080-T083 for US3)
- 📁 Files: 1 file created (tasks.md with 94 tasks)
- 🔁 Next prompts: Begin implementation with `/sp.implement` or manually execute tasks starting with Phase 1 (Setup), or use agents to parallelize work across user stories
- 🧠 Reflection: Tasks successfully organized by user story priority (P1 MVP → P2 enhancement → P3 retention) enabling incremental delivery. 70% of tasks are parallelizable, allowing significant speedup with multiple developers/agents. MVP scope (42 tasks) clearly defined to deliver core educational value. Each phase has explicit checkpoint with independent test criteria. Dependency graph shows US1-US3 can proceed in parallel after Foundational phase, minimizing blocking dependencies. Ready for execution.

## Evaluation notes (flywheel)

- Failure modes observed: None (task generation successful)
- Graders run and results (PASS/FAIL): Task format validation PASS (all tasks follow checklist format with IDs, parallel markers, story labels, file paths)
- Prompt variant (if applicable): User provided high-level task outline; expanded to full 94-task dependency-ordered checklist
- Next experiment (smallest change to try): Execute MVP scope (Phase 1-3, 42 tasks) to validate that tasks are granular enough for autonomous agent execution and that independent test criteria enable validation without cross-story dependencies
