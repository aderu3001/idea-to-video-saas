// User model for managing user accounts and social credentials
const { Pool } = require('pg');

class User {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async createUser(email, password, name) {
    const query = `
      INSERT INTO users (email, password_hash, name, created_at, subscription_status)
      VALUES ($1, $2, $3, NOW(), 'trial')
      RETURNING id, email, name, subscription_status
    `;
    
    const result = await this.pool.query(query, [email, password, name]);
    return result.rows[0];
  }

  async getUserById(userId) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  }

  async saveSocialCredentials(userId, platform, credentials) {
    const query = `
      INSERT INTO user_social_accounts (user_id, platform, credentials, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, platform) 
      DO UPDATE SET credentials = $3, updated_at = NOW()
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [userId, platform, JSON.stringify(credentials)]);
    return result.rows[0];
  }

  async getSocialCredentials(userId, platform = null) {
    let query = 'SELECT * FROM user_social_accounts WHERE user_id = $1';
    let params = [userId];
    
    if (platform) {
      query += ' AND platform = $2';
      params.push(platform);
    }
    
    const result = await this.pool.query(query, params);
    return platform ? result.rows[0] : result.rows;
  }

  async updateSubscription(userId, status, planId = null) {
    const query = `
      UPDATE users 
      SET subscription_status = $1, subscription_plan_id = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [status, planId, userId]);
    return result.rows[0];
  }

  async logVideoGeneration(userId, ideaText, videoUrl, platforms) {
    const query = `
      INSERT INTO video_generations (user_id, idea_text, video_url, target_platforms, created_at, status)
      VALUES ($1, $2, $3, $4, NOW(), 'processing')
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [userId, ideaText, videoUrl, JSON.stringify(platforms)]);
    return result.rows[0];
  }

  async updateVideoStatus(generationId, status, socialPostIds = null) {
    const query = `
      UPDATE video_generations 
      SET status = $1, social_post_ids = $2, completed_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [status, JSON.stringify(socialPostIds), generationId]);
    return result.rows[0];
  }
}

module.exports = User;