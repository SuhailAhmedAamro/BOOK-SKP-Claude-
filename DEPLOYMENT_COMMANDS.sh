#!/bin/bash
# Quick deployment script
# Run with: bash DEPLOYMENT_COMMANDS.sh

echo "🚀 Physical AI RAG Chatbot - Deployment Helper"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo -e "${BLUE}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Step 2: Backend setup
echo -e "${BLUE}Setting up backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Step 3: Ask for database initialization
echo -e "${BLUE}Step 1: Initialize Database${NC}"
echo "Have you initialized the database? (y/n)"
read -r db_init

if [ "$db_init" = "n" ]; then
    echo ""
    echo "Please initialize the database first:"
    echo "1. Go to: https://console.neon.tech"
    echo "2. Open SQL Editor"
    echo "3. Copy contents of backend/scripts/init_db.sql"
    echo "4. Paste and run in SQL Editor"
    echo ""
    echo "Press Enter when done..."
    read -r
fi

echo -e "${GREEN}✅ Database initialized${NC}"
echo ""

# Step 4: Data ingestion
echo -e "${BLUE}Step 2: Ingest Book Chapters${NC}"
echo "This will take ~5-10 minutes. Continue? (y/n)"
read -r ingest

if [ "$ingest" = "y" ]; then
    echo "Starting ingestion..."
    python scripts/ingest_chapters.py
    echo -e "${GREEN}✅ Data ingestion complete${NC}"
else
    echo "⚠️  Skipping ingestion. You can run it later with:"
    echo "   cd backend && python scripts/ingest_chapters.py"
fi

echo ""

# Step 5: Test backend locally
echo -e "${BLUE}Step 3: Test Backend Locally${NC}"
echo "Start local server to test? (y/n)"
read -r test_local

if [ "$test_local" = "y" ]; then
    echo "Starting server at http://localhost:8000"
    echo "Press Ctrl+C to stop when ready to deploy..."
    uvicorn app.main:app --reload --port 8000
fi

echo ""

# Step 6: Deploy backend
echo -e "${BLUE}Step 4: Deploy Backend to Vercel${NC}"
echo "Deploy now? (y/n)"
read -r deploy_backend

if [ "$deploy_backend" = "y" ]; then
    vercel --prod
    echo ""
    echo -e "${GREEN}✅ Backend deployed!${NC}"
    echo ""
    echo "⭐ IMPORTANT: Save your backend URL!"
    echo "Example: https://physical-ai-backend.vercel.app"
    echo ""
    echo "Press Enter to continue..."
    read -r
else
    echo "You can deploy later with: cd backend && vercel --prod"
    exit 0
fi

# Step 7: Configure backend environment
echo -e "${BLUE}Step 5: Configure Backend Environment${NC}"
echo ""
echo "Go to Vercel Dashboard and add environment variables:"
echo "1. DATABASE_URL"
echo "2. QDRANT_URL"
echo "3. QDRANT_API_KEY"
echo "4. COHERE_API_KEY"
echo "5. SECRET_KEY (generate with: openssl rand -hex 32)"
echo "6. FRONTEND_URL (will update later)"
echo ""
echo "Press Enter when done..."
read -r

# Redeploy with env vars
vercel --prod
echo -e "${GREEN}✅ Backend redeployed with environment variables${NC}"
echo ""

# Step 8: Frontend deployment
echo -e "${BLUE}Step 6: Deploy Frontend${NC}"
cd ../frontend

echo "Enter your backend URL (from Step 4):"
read -r backend_url

# Update .env.production
echo "VITE_API_URL=$backend_url" > .env.production

echo "Building frontend..."
npm run build

echo "Deploying to Vercel..."
vercel --prod

echo ""
echo -e "${GREEN}✅ Frontend deployed!${NC}"
echo ""
echo "⭐ Save your frontend URL!"
echo ""

# Step 9: Update backend CORS
echo -e "${BLUE}Step 7: Update Backend CORS${NC}"
echo "Enter your frontend URL (just deployed):"
read -r frontend_url

echo ""
echo "Update FRONTEND_URL in backend Vercel settings to:"
echo "  $frontend_url"
echo ""
echo "Then redeploy backend: cd backend && vercel --prod"
echo ""

# Final verification
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your URLs:"
echo "  Frontend: $frontend_url"
echo "  Backend:  $backend_url"
echo "  API Docs: $backend_url/api/docs"
echo ""
echo "Next steps:"
echo "1. Test signup flow"
echo "2. Test chat functionality"
echo "3. Share with users!"
echo ""
echo -e "${BLUE}See DEPLOY_NOW.md for detailed verification steps${NC}"
