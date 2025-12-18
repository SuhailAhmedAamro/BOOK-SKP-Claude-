# Tasks: Physical AI & Humanoid Robotics Portal

**Input**: Design documents from `/specs/001-robotics-portal/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/` and `backend/` at repository root
- Frontend: Docusaurus with `frontend/docs/`, `frontend/src/`
- Backend: FastAPI with `backend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create repository root directory structure (frontend/, backend/, .github/)
- [X] T002 [P] Initialize frontend with Docusaurus v3 + TypeScript in frontend/
- [X] T003 [P] Initialize backend with FastAPI + Python 3.11 in backend/
- [X] T004 [P] Configure Tailwind CSS for Docusaurus in frontend/tailwind.config.js
- [X] T005 [P] Install remark-math and rehype-katex plugins for LaTeX in frontend/package.json
- [X] T006 [P] Install @docusaurus/theme-mermaid plugin for diagrams in frontend/package.json
- [X] T007 [P] Create frontend/.env.example with API_URL, POSTHOG_KEY placeholders
- [X] T008 [P] Create backend/.env.example with DATABASE_URL, QDRANT_URL, OPENAI_API_KEY placeholders
- [ ] T009 [P] Configure PostHog analytics in frontend/src/services/analyticsService.ts
- [X] T010 Create .gitignore files for frontend/ and backend/ (node_modules, venv, .env)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Setup Neon Postgres database and copy connection string to backend/.env
- [ ] T012 [P] Initialize Alembic for database migrations in backend/alembic/
- [ ] T013 [P] Create database schema migration (users, user_progress, chat_messages, sessions) in backend/alembic/versions/001_initial_schema.py
- [ ] T014 Run Alembic migration to create tables in Neon database
- [ ] T015 [P] Setup Qdrant Cloud cluster and copy API key to backend/.env
- [ ] T016 [P] Create Qdrant collection "robotics_textbook_embeddings" with 1536-dim vectors in backend/src/vector/qdrant_client.py
- [ ] T017 [P] Configure Better-Auth in backend/src/services/auth_service.py (OAuth providers: Google, GitHub)
- [ ] T018 [P] Configure Better-Auth frontend client in frontend/src/services/authService.ts
- [ ] T019 [P] Create FastAPI main app with CORS middleware in backend/src/main.py
- [ ] T020 [P] Setup i18n structure for English/Urdu in frontend/src/i18n/ (en.json, ur.json)
- [ ] T021 Create shared TypeScript types for API responses in frontend/src/types/api.ts
- [ ] T022 Create Docusaurus config with LaTeX, Mermaid, and i18n plugins in frontend/docusaurus.config.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Content Learning Journey (Priority: P1) 🎯 MVP

**Goal**: Students can access 13 weeks of educational content with LaTeX equations, Mermaid diagrams, personalization filtering, and Urdu translation toggle.

**Independent Test**: Access Week 1 content, view LaTeX equations and Mermaid diagram, click "Personalize" to filter by Beginner/Advanced, toggle "Translate to Urdu", complete Self-Assessment MCQs.

### Implementation for User Story 1

- [ ] T023 [P] [US1] Create Week 1 directory structure in frontend/docs/week-01/
- [ ] T024 [P] [US1] Create Week 1 index.mdx with Learning Objectives and Conceptual Overview in frontend/docs/week-01/index.mdx
- [ ] T025 [P] [US1] Add Mermaid diagram for ROS 2 node architecture to Week 1 in frontend/docs/week-01/index.mdx
- [ ] T026 [P] [US1] Add LaTeX equations for state estimation to Week 1 in frontend/docs/week-01/index.mdx
- [ ] T027 [P] [US1] Create Week 1 tutorial.mdx with hands-on exercises in frontend/docs/week-01/tutorial.mdx
- [ ] T028 [P] [US1] Create Week 1 advanced.mdx with C++/CUDA content tagged [Advanced] in frontend/docs/week-01/advanced.mdx
- [ ] T029 [P] [US1] Create Week 1 assessment.mdx with 5-10 MCQs in frontend/docs/week-01/assessment.mdx
- [ ] T030 [P] [US1] Repeat T023-T029 for Weeks 2-13 (create all MDX files with LaTeX, Mermaid, difficulty tags)
- [ ] T031 [US1] Create PersonalizeButton component in frontend/src/components/PersonalizeButton.tsx
- [ ] T032 [US1] Implement usePersonalization hook to filter content by difficulty in frontend/src/hooks/usePersonalization.ts
- [ ] T033 [US1] Create TranslateToggle component in frontend/src/components/TranslateToggle.tsx
- [ ] T034 [US1] Implement useTranslation hook to switch language in frontend/src/hooks/useTranslation.ts
- [ ] T035 [US1] Populate en.json with English UI strings (buttons, labels, headings) in frontend/src/i18n/en.json
- [ ] T036 [US1] Populate ur.json with Urdu translations of UI strings in frontend/src/i18n/ur.json
- [ ] T037 [US1] Create SelfAssessment component with MCQ rendering and immediate feedback in frontend/src/components/SelfAssessment.tsx
- [ ] T038 [US1] Add PersonalizeButton and TranslateToggle to Docusaurus theme in frontend/src/theme/DocItem/Layout/index.tsx
- [ ] T039 [US1] Test LaTeX rendering with KaTeX across all 13 weeks
- [ ] T040 [US1] Test Mermaid diagram rendering across all 13 weeks
- [ ] T041 [US1] Verify personalization filtering shows/hides [Beginner]/[Advanced] content correctly
- [ ] T042 [US1] Verify Urdu translation toggle switches UI text while preserving technical terms

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Context-Aware AI Assistant (Priority: P2)

**Goal**: Students can highlight text, ask questions via RAG chatbot, and receive grounded answers with source citations.

**Independent Test**: Highlight a paragraph in Week 3, click "Ask AI about this", type question, verify response uses only highlighted text + textbook context (not generic knowledge), check source citations.

### Implementation for User Story 2

- [ ] T043 [P] [US2] Create ChatMessage model (Pydantic + SQLAlchemy) in backend/src/models/chat_message.py
- [ ] T044 [P] [US2] Create embedding service to chunk and embed MDX content in backend/src/services/embedding_service.py
- [ ] T045 [US2] Create script to parse all MDX files and generate embeddings in backend/scripts/embed_content.py
- [ ] T046 [US2] Run embed_content.py to upload ~500 vectors to Qdrant (13 weeks × ~15-50 chunks/week)
- [ ] T047 [P] [US2] Create RAG service with Selection RAG logic in backend/src/services/rag_service.py
- [ ] T048 [P] [US2] Implement vector search with metadata filtering (week, difficulty) in backend/src/services/rag_service.py
- [ ] T049 [P] [US2] Implement prompt engineering for grounded responses in backend/src/services/rag_service.py
- [ ] T050 [US2] Create /api/chat endpoint (POST) in backend/src/api/chat.py
- [ ] T051 [US2] Create /api/chat/history endpoint (GET) in backend/src/api/chat.py
- [ ] T052 [US2] Add rate limiting middleware (5 queries for anonymous, unlimited for authenticated) in backend/src/api/chat.py
- [ ] T053 [P] [US2] Create ChatWidget component (floating/sidebar panel) in frontend/src/components/ChatWidget.tsx
- [ ] T054 [P] [US2] Implement text selection listener to capture highlighted text in frontend/src/components/ChatWidget.tsx
- [ ] T055 [P] [US2] Create chatService.ts to call /api/chat endpoint in frontend/src/services/chatService.ts
- [ ] T056 [US2] Integrate ChatWidget into Docusaurus theme in frontend/src/theme/Root.tsx
- [ ] T057 [US2] Display source citations in ChatWidget responses in frontend/src/components/ChatWidget.tsx
- [ ] T058 [US2] Test Selection RAG: Highlight "DH parameters" text, ask question, verify response references only selected text + related chunks
- [ ] T059 [US2] Test rate limiting: Make 6 queries as anonymous user, verify 6th shows rate limit message
- [ ] T060 [US2] Test chatbot latency: Verify P95 response time <3 seconds for 20 test queries

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Progress Tracking & Authentication (Priority: P3)

**Goal**: Students can create accounts, save preferences, track week completion, view chat history, and see progress dashboard.

**Independent Test**: Sign up with email/password, set "Advanced Path", mark Week 1 complete, log out, log back in, verify preferences and progress persist.

### Implementation for User Story 3

- [ ] T061 [P] [US3] Create User model (Pydantic + SQLAlchemy) in backend/src/models/user.py
- [ ] T062 [P] [US3] Create UserProgress model in backend/src/models/progress.py
- [ ] T063 [P] [US3] Create Session model in backend/src/models/session.py
- [ ] T064 [P] [US3] Create /api/auth/signup endpoint (POST) in backend/src/api/auth.py
- [ ] T065 [P] [US3] Create /api/auth/login endpoint (POST) in backend/src/api/auth.py
- [ ] T066 [P] [US3] Create /api/auth/oauth/{provider} endpoint (GET) for Google/GitHub OAuth in backend/src/api/auth.py
- [ ] T067 [P] [US3] Create /api/auth/me endpoint (GET) to fetch current user in backend/src/api/auth.py
- [ ] T068 [P] [US3] Create /api/progress endpoint (GET) to fetch all weeks' progress in backend/src/api/progress.py
- [ ] T069 [P] [US3] Create /api/progress/{week_number} endpoint (PUT) to update completion/quiz score in backend/src/api/progress.py
- [ ] T070 [P] [US3] Create signup page with OAuth buttons and email/password form in frontend/src/pages/auth/signup.tsx
- [ ] T071 [P] [US3] Create login page with OAuth buttons and email/password form in frontend/src/pages/auth/login.tsx
- [ ] T072 [P] [US3] Create dashboard page with progress tracker in frontend/src/pages/dashboard.tsx
- [ ] T073 [P] [US3] Create ProgressTracker component (visual completion %) in frontend/src/components/ProgressTracker.tsx
- [ ] T074 [US3] Implement useProgress hook to fetch and update progress in frontend/src/hooks/useProgress.ts
- [ ] T075 [US3] Add "Mark Complete" checkbox to each week's page in frontend/src/theme/DocItem/Footer/index.tsx
- [ ] T076 [US3] Persist personalization preference (Beginner/Advanced) to user profile in backend database
- [ ] T077 [US3] Load user preferences on login and apply personalization filter automatically
- [ ] T078 [US3] Save chat messages to database for authenticated users in backend/src/api/chat.py
- [ ] T079 [US3] Create "Chat History" sidebar component in frontend/src/components/ChatHistory.tsx
- [ ] T080 [US3] Test signup flow: Create account with email/password, verify user record in Neon database
- [ ] T081 [US3] Test OAuth flow: Sign up with Google, verify OAuth provider ID stored
- [ ] T082 [US3] Test progress persistence: Mark Week 1 complete, log out, log in, verify checkmark persists
- [ ] T083 [US3] Test dashboard: Complete 5 weeks, verify "5 of 13 weeks completed (38%)" displays

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T084 [P] Add responsive CSS for mobile (375px+) and tablet (768px+) in frontend/src/css/custom.css
- [ ] T085 [P] Run Lighthouse accessibility audit, fix issues to achieve 95+ score
- [ ] T086 [P] Add loading states and error boundaries to React components
- [ ] T087 [P] Implement graceful degradation for Qdrant unavailability (show error message)
- [ ] T088 [P] Add HTTPS enforcement and security headers in backend/src/main.py
- [ ] T089 [P] Configure deployment: Frontend to Vercel, Backend to Railway
- [ ] T090 [P] Setup environment variables in Vercel and Railway dashboards
- [ ] T091 [P] Test end-to-end: Deploy to production, verify all 3 user stories work
- [ ] T092 [P] Create README.md with setup instructions and architecture overview
- [ ] T093 [P] Add PostHog event tracking: page_view, personalize_clicked, translate_toggled, chatbot_query, quiz_completed
- [ ] T094 Run quickstart.md validation (follow setup guide, verify all steps work)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent from US1 (but benefits from Week 1 content existing for testing)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent from US1/US2 (but needs chat endpoint from US2 to save chat history)

### Within Each User Story

- **User Story 1**:
  - Content creation (T023-T030) can all run in parallel
  - Components (T031-T038) depend on i18n setup from Foundational phase
  - Testing (T039-T042) depends on all components being implemented

- **User Story 2**:
  - Models and services (T043-T049) can run in parallel
  - Endpoints (T050-T052) depend on services
  - Frontend components (T053-T057) can run in parallel with backend
  - Testing (T058-T060) depends on full integration

- **User Story 3**:
  - Models (T061-T063) can run in parallel
  - Endpoints (T064-T069) depend on models
  - Frontend pages (T070-T074) can run in parallel
  - Integration (T075-T079) depends on both frontend and backend
  - Testing (T080-T083) depends on full integration

### Parallel Opportunities

- **Phase 1**: All 10 tasks can run in parallel (T002-T009 marked [P])
- **Phase 2**: Tasks T012-T013, T015-T022 can run in parallel (11 tasks)
- **User Story 1**: Content creation for all 13 weeks (T023-T030) can run in parallel
- **User Story 2**: Models/services (T043-T049) and frontend components (T053-T057) can run in parallel
- **User Story 3**: Models (T061-T063), endpoints (T064-T069), frontend pages (T070-T074) can run in parallel
- **Phase 6**: All 11 polish tasks can run in parallel

---

## Parallel Example: User Story 1 (Content Creation)

```bash
# Launch all week content creation in parallel:
Task T023-T030: Create docs/week-01/ through docs/week-13/
  - Each week is independent (different files)
  - Can be done by different team members or AI agents simultaneously
  - Expected time: 2-3 hours per week (if sequential), 3-4 hours total (if parallel with 13 agents)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T022) - CRITICAL
3. Complete Phase 3: User Story 1 (T023-T042)
4. **STOP and VALIDATE**: Test Week 1 independently (LaTeX, Mermaid, Personalize, Translate, MCQs)
5. Deploy frontend to Vercel, test production
6. **MVP COMPLETE**: Students can learn from 13 weeks of content with personalization and translation

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP!)
3. Add User Story 2 → Test independently → Deploy (RAG chatbot enhancement)
4. Add User Story 3 → Test independently → Deploy (Progress tracking and retention)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers or AI agents:

1. Team completes Setup + Foundational together (T001-T022)
2. Once Foundational is done:
   - **Developer/Agent A**: User Story 1 (T023-T042)
   - **Developer/Agent B**: User Story 2 (T043-T060)
   - **Developer/Agent C**: User Story 3 (T061-T083)
3. Stories complete and integrate independently
4. Integration point: User Story 3 saves chat history from US2 endpoint (minimal coupling)

---

## Task Summary

- **Total Tasks**: 94
- **Phase 1 (Setup)**: 10 tasks (all parallelizable)
- **Phase 2 (Foundational)**: 12 tasks (11 parallelizable)
- **Phase 3 (User Story 1 - MVP)**: 20 tasks (17 parallelizable)
- **Phase 4 (User Story 2 - RAG)**: 18 tasks (11 parallelizable)
- **Phase 5 (User Story 3 - Auth)**: 23 tasks (16 parallelizable)
- **Phase 6 (Polish)**: 11 tasks (all parallelizable)

**Parallel Opportunities**: 66 tasks (70%) can run in parallel within their phase

**MVP Scope** (Recommended first release):
- Phase 1 + Phase 2 + Phase 3 = 42 tasks
- Estimated effort: 3-5 days (with parallelization), 7-10 days (sequential)
- Delivers: Full educational portal with 13 weeks of content, personalization, translation, self-assessment

**Full Feature** (All 3 user stories):
- All phases = 94 tasks
- Estimated effort: 7-10 days (with parallelization), 15-20 days (sequential)
- Delivers: Complete portal with RAG chatbot, authentication, progress tracking

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are absolute (relative to repository root: frontend/ or backend/)
- Follow quickstart.md for local development setup before starting implementation
