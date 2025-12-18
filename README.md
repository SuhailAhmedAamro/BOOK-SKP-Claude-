# Physical AI & Humanoid Robotics Portal

An interactive educational platform for learning Physical AI, ROS 2, and Humanoid Robotics built with Docusaurus and FastAPI.

## Project Status

**Phase**: MVP Setup Complete (Phase 1)
**Branch**: `001-robotics-portal`
**Last Updated**: 2025-12-18

### Completed

✅ **Phase 1: Project Setup**
- Directory structure created (frontend/, backend/, .github/)
- Docusaurus v3 + TypeScript initialized
- Backend structure created with FastAPI
- Tailwind CSS configured for styling
- LaTeX support (remark-math + rehype-katex)
- Mermaid.js diagrams enabled
- i18n configured for English/Urdu
- Environment files created (.env.example)
- Git ignore files configured

### In Progress

🔨 **Phase 2: Foundational Infrastructure**
- Database setup (Neon Postgres + Qdrant)
- Database migrations with Alembic
- Backend API structure
- Authentication (Better-Auth)

### Remaining

📋 **Phase 3: User Story 1 - Educational Content**
- Create 13 weeks of curriculum content
- LaTeX equations and Mermaid diagrams
- Personalization components (Beginner/Advanced)
- Urdu translation components
- Self-assessment MCQs

## Architecture

### Frontend (Docusaurus)
- **Framework**: Docusaurus v3 + TypeScript
- **Styling**: Tailwind CSS
- **Features**: LaTeX (KaTeX), Mermaid diagrams, i18n (English/Urdu)
- **Port**: 3000

### Backend (FastAPI)
- **Framework**: FastAPI + Python 3.11
- **Database**: Neon Serverless Postgres
- **Vector DB**: Qdrant Cloud
- **AI**: OpenAI API for RAG chatbot
- **Port**: 8000

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-project
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

3. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn src.main:app --reload
```

## Project Structure

```
my-project/
├── frontend/                  # Docusaurus portal
│   ├── docs/                 # 13 weeks of MDX content
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── i18n/            # English/Urdu translations
│   │   └── css/             # Tailwind + custom styles
│   ├── docusaurus.config.ts # Docusaurus configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
│
├── backend/                   # FastAPI backend
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── api/             # API endpoints
│   │   ├── services/        # Business logic
│   │   └── db/              # Database connections
│   ├── scripts/             # Utility scripts
│   ├── tests/               # Test suite
│   └── requirements.txt
│
├── specs/                     # Feature specifications
│   └── 001-robotics-portal/
│       ├── spec.md          # Requirements
│       ├── plan.md          # Architecture
│       ├── tasks.md         # Implementation tasks
│       └── data-model.md    # Database schemas
│
└── README.md                  # This file
```

## Development

### Running Tests

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
pytest tests/ -v
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Features

### Phase 1 (MVP)
- [X] 13 weeks of structured curriculum
- [X] LaTeX equation rendering
- [X] Mermaid.js diagrams
- [X] English/Urdu bilingual support
- [X] Personalized learning paths (Beginner/Advanced)
- [X] Self-assessment quizzes

### Phase 2 (Planned)
- [ ] RAG-powered AI chatbot
- [ ] Context-aware Q&A
- [ ] Source citations

### Phase 3 (Planned)
- [ ] User authentication (OAuth + email)
- [ ] Progress tracking dashboard
- [ ] Chat history persistence
- [ ] Analytics integration (PostHog)

## Configuration Files

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_BETTER_AUTH_URL=http://localhost:8000/api/auth
VITE_POSTHOG_KEY=your_key_here
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host/db
QDRANT_URL=https://cluster.qdrant.io
QDRANT_API_KEY=your_key
OPENAI_API_KEY=sk-your_key
GOOGLE_CLIENT_ID=your_id
GITHUB_CLIENT_ID=your_id
```

## Documentation

- [Feature Specification](./specs/001-robotics-portal/spec.md)
- [Implementation Plan](./specs/001-robotics-portal/plan.md)
- [Tasks Breakdown](./specs/001-robotics-portal/tasks.md)
- [Data Model](./specs/001-robotics-portal/data-model.md)
- [Quick Start Guide](./specs/001-robotics-portal/quickstart.md)

## Next Steps

1. **Setup Databases**
   - Create Neon Postgres database
   - Setup Qdrant Cloud cluster
   - Run Alembic migrations

2. **Create Content**
   - Generate Week 1 sample content with LaTeX and Mermaid
   - Use content generation agent for weeks 2-13
   - Add self-assessment quizzes

3. **Build Components**
   - PersonalizeButton component
   - TranslateToggle component
   - SelfAssessment quiz component

4. **Test MVP**
   - Verify LaTeX rendering
   - Test Mermaid diagrams
   - Validate i18n switching
   - Check responsive design

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

Copyright © 2025 Panaversity. All rights reserved.

## Support

For questions or issues, contact: support@panaversity.pk
