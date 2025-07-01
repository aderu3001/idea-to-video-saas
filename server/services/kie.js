// Kie.ai Video Generation Service
const axios = require('axios');

class KieService {
  constructor() {
    this.baseURL = 'https://api.kie.ai';
    this.apiKey = process.env.KIE_API_KEY;
  }

  async generateVideo(prompt, options = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/v1/video/generate`, {
        prompt: prompt,
        model: 'veo-2',
        duration: options.duration || 5,
        aspect_ratio: options.aspectRatio || '16:9',
        quality: options.quality || 'high'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Kie.ai API Error:', error.response?.data || error.message);
      throw new Error('Video generation failed');
    }
  }

  async getVideoStatus(jobId) {
    try {
      const response = await axios.get(`${this.baseURL}/v1/video/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Kie.ai Status Error:', error.response?.data || error.message);
      throw new Error('Failed to get video status');
    }
  }
}

module.exports = KieService;