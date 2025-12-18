# Research & Architecture Decisions: Physical AI & Humanoid Robotics Portal

**Feature**: 001-robotics-portal
**Date**: 2025-12-18
**Phase**: Phase 0 - Research & Technical Discovery

## Overview

This document captures architecture decisions, technology selections, and best practices research for building the Physical AI & Humanoid Robotics Portal.

## Key Architecture Decisions

### Decision 1: Frontend Framework - Docusaurus v3

**Decision**: Use Docusaurus v3 with TypeScript as the primary frontend framework.

**Rationale**:
- **Purpose-built for documentation**: Docusaurus is specifically designed for content-heavy educational sites
- **MDX support**: Native MDX support allows mixing Markdown with React components (essential for PersonalizeButton, TranslateToggle)
- **LaTeX & Mermaid plugins**: Excellent ecosystem for remark-math (KaTeX/MathJax) and Mermaid.js diagram rendering
- **Static site generation**: Fast page loads, SEO-friendly, deployable to GitHub Pages/Vercel with zero configuration
- **Versioning & i18n built-in**: Native support for versioning (future course iterations) and internationalization (English/Urdu)
- **React-based**: Allows custom components (ChatWidget, SelfAssessment) alongside Markdown content

**Alternatives Considered**:
- **Next.js + MDX**: More flexible but requires custom build pipeline for documentation features; overkill for content-focused site
- **VitePress**: Vue-based alternative, but React ecosystem better for integrating with existing libraries (Better-Auth, PostHog)
- **Gatsby**: Similar to Docusaurus but slower build times and more complex configuration

**Implementation Notes**:
- Install `@docusaurus/preset-classic`, `@docusaurus/theme-mermaid`, `remark-math`, `rehype-katex`
- Configure Tailwind CSS via PostCSS plugin
- Use Docusaurus's built-in search (Algolia DocSearch)

---

### Decision 2: Backend Framework - FastAPI

**Decision**: Use FastAPI (Python 3.11+) for the RAG chatbot backend and API services.

**Rationale**:
- **Async support**: Native async/await for concurrent chatbot requests (critical for <3s P95 latency)
- **OpenAI SDK compatibility**: Python SDK is most mature for OpenAI API integration
- **Qdrant client**: Official Qdrant Python client with strong typing support
- **Auto-generated OpenAPI**: FastAPI automatically generates OpenAPI 3.1 schemas (useful for frontend TypeScript client generation)
- **Pydantic validation**: Built-in request/response validation matches well with type-safe development
- **Lightweight**: Faster startup and lower memory footprint than Django/Flask for API-only backend

**Alternatives Considered**:
- **Node.js/Express**: Would share language with frontend but Python ecosystem is stronger for AI/ML (OpenAI, vector DBs)
- **Django REST Framework**: Too heavyweight for stateless API; admin panel not needed
- **Flask**: Simpler than FastAPI but lacks async support and modern type annotations

**Implementation Notes**:
- Use `uvicorn` with `--workers 4` for production deployment
- Structure as modular routers (`api/chat.py`, `api/auth.py`, `api/progress.py`)
- Enable CORS for frontend domain (Vercel/GitHub Pages)

---

### Decision 3: Authentication - Better-Auth

**Decision**: Use Better-Auth for authentication with OAuth (Google, GitHub) and email/password support.

**Rationale**:
- **Modern auth library**: Better-Auth is a newer, type-safe alternative to NextAuth.js with first-class TypeScript support
- **Flexible providers**: Supports email/password, OAuth providers, and magic links
- **Session management**: Built-in session handling with JWT or database-backed sessions
- **React hooks**: Provides `useSession()`, `useUser()` hooks for easy frontend integration
- **Backend integration**: Works with FastAPI via middleware or token validation

**Alternatives Considered**:
- **NextAuth.js**: More mature but tightly coupled to Next.js; requires workarounds for Docusaurus
- **Auth0/Firebase Auth**: Vendor lock-in, pricing concerns for 1000+ students, privacy implications
- **Roll-your-own JWT**: Reinventing the wheel, security risks, time-intensive

**Implementation Notes**:
- Configure providers: Google OAuth 2.0, GitHub OAuth, email/password
- Store sessions in Neon Postgres (not in-memory for multi-instance scaling)
- Frontend uses `authService.ts` wrapper around Better-Auth SDK
- Backend validates JWT tokens via Better-Auth middleware

---

### Decision 4: Vector Database - Qdrant Cloud

**Decision**: Use Qdrant Cloud for storing and querying textbook content embeddings.

**Rationale**:
- **Managed service**: Qdrant Cloud eliminates infrastructure management (no self-hosting overhead)
- **High performance**: Sub-100ms vector search at scale, critical for <3s chatbot latency
- **Filtering support**: Can filter by metadata (week number, difficulty level, topic) for targeted RAG
- **Free tier**: 1GB free tier sufficient for 13 weeks of chunked content (~500-1000 vectors)
- **Python SDK**: Well-documented client with async support for FastAPI integration

**Alternatives Considered**:
- **Pinecone**: Similar performance but more expensive after free tier; fewer filtering options
- **Weaviate**: Self-hosted adds operational complexity; overkill for this use case
- **Postgres pgvector**: Requires managing embeddings in same DB as user data; slower vector search than specialized DB

**Implementation Notes**:
- Chunk MDX files into 500-token segments with 100-token overlap
- Embed using OpenAI `text-embedding-3-small` (cheaper, faster than `ada-002`)
- Store metadata: `{week: int, section: str, difficulty: str, language: str}`
- Create collection with HNSW index for fast approximate nearest neighbor search

---

### Decision 5: Database - Neon Serverless Postgres

**Decision**: Use Neon Serverless Postgres for user data, progress tracking, and chat history.

**Rationale**:
- **Serverless autoscaling**: Automatically scales to zero during low traffic, cost-effective for education workload
- **Postgres compatibility**: Standard SQL, mature ORMs (SQLAlchemy), ACID compliance
- **Generous free tier**: 0.5 GB storage + 191 hours compute/month covers development and small cohorts
- **Branching**: Git-like database branching for testing migrations (useful for iterative development)
- **Low latency**: Sub-10ms response times from edge locations

**Alternatives Considered**:
- **Supabase**: Similar serverless Postgres but includes unused features (auth, storage, real-time)
- **PlanetScale**: MySQL-compatible but lacks Postgres-specific features (JSONB, full-text search)
- **MongoDB Atlas**: NoSQL doesn't fit relational data model (users ↔ progress ↔ chat_history)

**Implementation Notes**:
- Use SQLAlchemy ORM with Alembic for migrations
- Tables: `users`, `user_progress`, `chat_messages`, `sessions`
- Connection pooling via `asyncpg` driver for async FastAPI
- Enable row-level security (RLS) for multi-tenancy

---

### Decision 6: Content Embedding Strategy

**Decision**: Pre-compute embeddings offline, store in Qdrant, refresh only on content updates.

**Rationale**:
- **Performance**: Offline embedding avoids latency during chatbot queries
- **Cost**: One-time embedding cost vs. per-query embedding costs
- **Consistency**: All users query same embeddings, no risk of runtime embedding failures

**Implementation**:
1. Run `backend/scripts/embed_content.py` script to:
   - Parse all MDX files in `frontend/docs/`
   - Chunk text into 500-token segments
   - Generate embeddings via OpenAI API
   - Upload to Qdrant with metadata
2. Re-run script only when content is updated (manual trigger or CI/CD hook)

**Alternatives Considered**:
- **Real-time embedding**: Embed user-selected text on-the-fly (higher latency, API costs)
- **Hybrid approach**: Pre-embed chapters, embed user queries (added complexity)

---

### Decision 7: Selection RAG Implementation

**Decision**: Implement "Selection RAG" by combining highlighted text with vector search results.

**Approach**:
1. User highlights text in browser (JavaScript `window.getSelection()`)
2. Frontend sends highlighted text + user question to `/api/chat` endpoint
3. Backend:
   - Embeds user question
   - Queries Qdrant for top-5 similar chunks (metadata filter: same week or related topics)
   - Constructs prompt: `Context 1: [highlighted text]\nContext 2: [retrieved chunk 1]\n...`
   - Sends to OpenAI Chat Completions API with system prompt: "Answer using ONLY the provided context"
4. Backend returns response with source citations (week/section references)

**Rationale**:
- **Grounded responses**: Prevents hallucinations by constraining to course content
- **User control**: Highlighted text ensures chatbot focuses on what student is confused about
- **Traceability**: Source citations allow students to verify answers in textbook

**Implementation Notes**:
- Use OpenAI `gpt-4-turbo-preview` for better reasoning (vs. gpt-3.5-turbo)
- Set `temperature=0.3` for more deterministic answers
- Include system prompt: "You are a ROS 2 and robotics tutor. Answer concisely using only the provided textbook context."

---

### Decision 8: Urdu Translation Approach

**Decision**: Pre-translate UI strings to Urdu, use i18n JSON files; delay content translation to post-MVP.

**Rationale**:
- **Scope management**: Translating 13 weeks of technical content is large effort, not critical for MVP
- **Quality**: Human translation of UI (buttons, labels) ensures accuracy; GPT-4 for content may have technical errors
- **Constitution compliance**: Constitution requires translation toggle; UI translation satisfies minimum requirement

**Implementation**:
- Phase 1 (MVP): Translate UI strings (headers, buttons, form labels) to Urdu → `frontend/src/i18n/ur.json`
- Phase 2 (Post-MVP): Use GPT-4 to translate MDX content → store in `frontend/docs-ur/` (separate Urdu doc tree)
- Technical terms: Keep English with Urdu explanation (e.g., "Node (نوڈ، ایک ROS 2 process)")

---

### Decision 9: Analytics - PostHog

**Decision**: Use PostHog for privacy-friendly analytics and event tracking.

**Rationale**:
- **Privacy-first**: GDPR/CCPA compliant, self-hostable if needed
- **Feature-rich**: Event tracking, session replay, feature flags, A/B testing
- **Free tier**: 1M events/month covers expected usage (1000 users × ~50 events/user/month)
- **Easy integration**: Official React and Python SDKs

**Implementation**:
- Frontend: `posthog-js` SDK to track page views, button clicks, personalization events
- Backend: `posthog-python` SDK to track chatbot queries, quiz completions
- Events to track:
  - `page_view` (week number, difficulty filter)
  - `personalize_clicked` (selected path)
  - `translate_toggled` (language)
  - `chatbot_query` (week context, response time)
  - `quiz_completed` (week, score)

---

### Decision 10: Deployment Strategy

**Decision**:
- **Frontend**: Deploy to Vercel (static site + edge functions for i18n)
- **Backend**: Deploy to Railway (FastAPI + Postgres connection)

**Rationale**:
- **Vercel**: Free tier for static sites, automatic HTTPS, global CDN, preview deployments per branch
- **Railway**: $5/month for FastAPI backend, built-in Postgres connection pooling, easy environment variables
- **Separation**: Frontend CDN (fast content delivery) + backend API (dynamic chatbot) = optimal performance

**Alternatives Considered**:
- **GitHub Pages**: Free but doesn't support server-side rendering or API proxying
- **Vercel for both**: Serverless functions for backend, but Python cold starts slower than Railway's dedicated containers
- **Self-hosted VPS**: More control but adds operational overhead (not justified for MVP)

**Implementation Notes**:
- Configure `vercel.json` to proxy `/api/*` to Railway backend (avoid CORS preflight)
- Set environment variables: `OPENAI_API_KEY`, `QDRANT_URL`, `NEON_DATABASE_URL`

---

## Best Practices Research

### Docusaurus + Tailwind CSS Integration

**Finding**: Docusaurus uses CSS modules by default; Tailwind requires PostCSS configuration.

**Best Practice**:
1. Install: `npm install -D tailwindcss postcss autoprefixer`
2. Create `tailwind.config.js`:
   ```js
   module.exports = {
     content: ['./src/**/*.{js,jsx,ts,tsx}', './docs/**/*.mdx'],
     theme: { extend: {} },
   }
   ```
3. Add PostCSS config via `docusaurus.config.ts`:
   ```ts
   plugins: ['docusaurus-plugin-tailwindcss']
   ```
4. Import Tailwind in `src/css/custom.css`

**Source**: [Docusaurus + Tailwind guide](https://docusaurus.io/docs/styling-layout)

---

### LaTeX Rendering Performance

**Finding**: KaTeX is 10x faster than MathJax but has slightly less feature coverage.

**Best Practice**:
- Use `remark-math` + `rehype-katex` for Docusaurus
- Configure in `docusaurus.config.ts`:
  ```ts
  presets: [
    ['classic', {
      docs: {
        remarkPlugins: [require('remark-math')],
        rehypePlugins: [[require('rehype-katex'), { strict: false }]],
      },
    }],
  ],
  stylesheets: ['https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css'],
  ```

**Source**: [Docusaurus math equations docs](https://docusaurus.io/docs/markdown-features/math-equations)

---

### RAG Prompt Engineering

**Finding**: Structuring context with XML-like tags improves GPT-4 citation accuracy.

**Best Practice**:
```
System: You are a robotics tutor. Answer using ONLY the context below.

<highlighted_text>
{user_selected_text}
</highlighted_text>

<related_content week="{week_number}" section="{section_title}">
{retrieved_chunk_1}
</related_content>

<related_content week="{week_number}" section="{section_title}">
{retrieved_chunk_2}
</related_content>

User: {user_question}