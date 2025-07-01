// Blotato Social Media Posting Service
const axios = require('axios');

class BlotoService {
  constructor() {
    this.baseURL = 'https://api.blotato.com';
    this.apiKey = process.env.BLOTATO_API_KEY;
  }

  async postToInstagram(videoUrl, caption, userToken) {
    try {
      const response = await axios.post(`${this.baseURL}/v1/instagram/post`, {
        media_url: videoUrl,
        caption: caption,
        media_type: 'video',
        user_token: userToken
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Instagram Post Error:', error.response?.data || error.message);
      throw new Error('Instagram posting failed');
    }
  }

  async postToYouTube(videoUrl, title, description, userToken) {
    try {
      const response = await axios.post(`${this.baseURL}/v1/youtube/upload`, {
        video_url: videoUrl,
        title: title,
        description: description,
        privacy: 'public',
        user_token: userToken
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('YouTube Post Error:', error.response?.data || error.message);
      throw new Error('YouTube posting failed');
    }
  }

  async postToTikTok(videoUrl, caption, userToken) {
    try {
      const response = await axios.post(`${this.baseURL}/v1/tiktok/post`, {
        video_url: videoUrl,
        caption: caption,
        user_token: userToken
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('TikTok Post Error:', error.response?.data || error.message);
      throw new Error('TikTok posting failed');
    }
  }

  async connectSocialAccount(platform, authCode) {
    try {
      const response = await axios.post(`${this.baseURL}/v1/auth/${platform}/connect`, {
        auth_code: authCode
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Social Connect Error:', error.response?.data || error.message);
      throw new Error(`${platform} connection failed`);
    }
  }
}

module.exports = BlotoService;