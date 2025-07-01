-- Database schema for Idea-to-Video SAAS

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  subscription_status VARCHAR(50) DEFAULT 'trial',
  subscription_plan_id VARCHAR(100),
  stripe_customer_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User social media accounts and credentials
CREATE TABLE user_social_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'youtube', 'tiktok'
  credentials JSONB NOT NULL, -- Store tokens, account info
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Video generation history
CREATE TABLE video_generations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  idea_text TEXT NOT NULL,
  video_prompt TEXT,
  video_url VARCHAR(500),
  target_platforms JSONB, -- ['instagram', 'youtube', 'tiktok']
  status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  social_post_ids JSONB, -- Store post IDs from each platform
  n8n_execution_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Subscription plans
CREATE TABLE subscription_plans (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_monthly DECIMAL(10,2),
  video_limit_monthly INTEGER,
  features JSONB,
  stripe_price_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User usage tracking
CREATE TABLE user_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL, -- '2025-01'
  videos_generated INTEGER DEFAULT 0,
  videos_posted INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price_monthly, video_limit_monthly, features) VALUES
('trial', 'Trial', 0.00, 3, '{"platforms": ["instagram", "youtube", "tiktok"], "support": "email"}'),
('basic', 'Basic', 29.99, 50, '{"platforms": ["instagram", "youtube", "tiktok"], "support": "email", "analytics": true}'),
('pro', 'Pro', 79.99, 200, '{"platforms": ["instagram", "youtube", "tiktok"], "support": "priority", "analytics": true, "scheduling": true}'),
('enterprise', 'Enterprise', 199.99, 1000, '{"platforms": ["instagram", "youtube", "tiktok"], "support": "dedicated", "analytics": true, "scheduling": true, "api_access": true}');

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_social_accounts_user_platform ON user_social_accounts(user_id, platform);
CREATE INDEX idx_video_generations_user_status ON video_generations(user_id, status);
CREATE INDEX idx_user_usage_user_month ON user_usage(user_id, month_year);