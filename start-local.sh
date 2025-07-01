#!/bin/bash

# Simple script to start the app locally
echo "🚀 Starting Idea-to-Video SAAS locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it from https://postgresql.org/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "📝 Please edit .env file with your database credentials"
    echo "   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/idea_to_video"
    echo "   JWT_SECRET=your_random_secret_here"
    read -p "Press Enter after you've updated the .env file..."
fi

# Create database if it doesn't exist
echo "🗄️ Setting up database..."
createdb idea_to_video 2>/dev/null || echo "Database already exists"

# Run database schema
echo "📊 Setting up database schema..."
psql -d idea_to_video -f database/schema.sql

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend: npm run server"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "Or run: npm run dev (starts both)"