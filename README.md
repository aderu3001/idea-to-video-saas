# Idea-to-Video SAAS

Transform your ideas into engaging social media videos automatically.

## Features
- AI-powered video generation from text ideas
- Multi-platform posting (Instagram, YouTube, TikTok)
- Video generation via Kie.ai (Veo API)
- Social media posting via Blotato

## Tech Stack
- Frontend: Next.js + React
- Backend: Node.js + Express
- Database: PostgreSQL
- Workflow: n8n
- Video Generation: Kie.ai (Veo API)
- Social Posting: Blotato
- Hosting: DigitalOcean

## Getting Started
```bash
npm install
npm run dev
```
User Input → n8n Workflow → Kie.ai Video → Blotato Posting
## Architecture
```
User Input → n8n Workflow → Video Generation → Social Media Posting
```