# Getting Started - Complete Beginner Guide

## What You Need to Install First

### 1. Install Node.js
- Go to https://nodejs.org/
- Download the LTS version (recommended)
- Install it (just click next, next, finish)
- Open terminal/command prompt and type: `node --version` (should show a version number)

### 2. Install Git
- Go to https://git-scm.com/
- Download and install
- Test: `git --version`

### 3. Install PostgreSQL (Database)
- Go to https://www.postgresql.org/download/
- Download and install
- Remember the password you set for the 'postgres' user
- Test: Open "pgAdmin" (comes with PostgreSQL)

## Step 2: Get the Code Running Locally

### Clone the Repository
```bash
# Open terminal/command prompt
# Navigate to where you want the project
cd Desktop

# Clone the project
git clone https://github.com/aderu3001/idea-to-video-saas.git
cd idea-to-video-saas
```

### Install Dependencies
```bash
# Install all the packages the app needs
npm install
```

### Set Up Database
```bash
# Create the database
# Open pgAdmin or use command line:
createdb idea_to_video

# Run the database setup
psql -d idea_to_video -f database/schema.sql
```

### Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your settings:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/idea_to_video
# JWT_SECRET=your_random_secret_here
# PORT=3001
```

## Step 3: Start the Application

### Start Backend Server
```bash
# In one terminal window
cd server
node index.js
```

### Start Frontend (in another terminal)
```bash
# In another terminal window
cd frontend
npm run dev
```

### Access Your App
- Open browser: http://localhost:3000
- You should see your app interface!

## Step 4: Test Basic Functionality

### Create a Test User
1. Go to http://localhost:3000/register
2. Create an account
3. Login
4. You should see the dashboard

## What You'll See
- User registration/login pages
- Dashboard with social account connections
- Video generation form
- History of generated videos

## Next Steps After Local Testing
1. Get API keys (Kie.ai, Blotato)
2. Set up n8n locally
3. Deploy to DigitalOcean
4. Configure domain and SSL

## Common Issues & Solutions

### "npm install" fails
- Try: `npm install --legacy-peer-deps`

### Database connection fails
- Check PostgreSQL is running
- Verify password in .env file
- Make sure database exists

### Port already in use
- Change PORT in .env file
- Or kill the process using the port

### Can't access localhost
- Check if servers are running
- Try different browsers
- Check firewall settings

## Need Help?
- Check the logs in terminal for error messages
- Make sure all services are running
- Verify environment variables are set correctly