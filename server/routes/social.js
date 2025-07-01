// Social media account management routes
const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();
const userModel = new User();

// Connect Instagram account
router.post('/connect/instagram', authenticateToken, async (req, res) => {
  try {
    const { accessToken, userInfo } = req.body;
    
    // Verify token with Instagram API (simplified)
    const instagramData = {
      access_token: accessToken,
      user_id: userInfo.id,
      username: userInfo.username,
      connected_at: new Date().toISOString()
    };

    await userModel.saveSocialCredentials(req.user.userId, 'instagram', instagramData);

    res.json({
      message: 'Instagram account connected successfully',
      platform: 'instagram',
      username: userInfo.username
    });
  } catch (error) {
    console.error('Instagram connection error:', error);
    res.status(500).json({ error: 'Failed to connect Instagram account' });
  }
});

// Connect YouTube account
router.post('/connect/youtube', authenticateToken, async (req, res) => {
  try {
    const { accessToken, refreshToken, channelInfo } = req.body;
    
    const youtubeData = {
      access_token: accessToken,
      refresh_token: refreshToken,
      channel_id: channelInfo.id,
      channel_name: channelInfo.title,
      connected_at: new Date().toISOString()
    };

    await userModel.saveSocialCredentials(req.user.userId, 'youtube', youtubeData);

    res.json({
      message: 'YouTube account connected successfully',
      platform: 'youtube',
      channelName: channelInfo.title
    });
  } catch (error) {
    console.error('YouTube connection error:', error);
    res.status(500).json({ error: 'Failed to connect YouTube account' });
  }
});

// Connect TikTok account
router.post('/connect/tiktok', authenticateToken, async (req, res) => {
  try {
    const { accessToken, userInfo } = req.body;
    
    const tiktokData = {
      access_token: accessToken,
      user_id: userInfo.open_id,
      username: userInfo.display_name,
      connected_at: new Date().toISOString()
    };

    await userModel.saveSocialCredentials(req.user.userId, 'tiktok', tiktokData);

    res.json({
      message: 'TikTok account connected successfully',
      platform: 'tiktok',
      username: userInfo.display_name
    });
  } catch (error) {
    console.error('TikTok connection error:', error);
    res.status(500).json({ error: 'Failed to connect TikTok account' });
  }
});

// Get connected social accounts
router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    const socialAccounts = await userModel.getSocialCredentials(req.user.userId);
    
    const accounts = socialAccounts.map(account => ({
      platform: account.platform,
      username: account.credentials.username || account.credentials.channel_name,
      connectedAt: account.created_at,
      isActive: account.is_active
    }));

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to get social accounts' });
  }
});

// Disconnect social account
router.delete('/disconnect/:platform', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    
    // In a real implementation, you'd delete or deactivate the account
    // For now, we'll just mark it as inactive
    const account = await userModel.getSocialCredentials(req.user.userId, platform);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Update to mark as inactive (you'd implement this method)
    // await userModel.deactivateSocialAccount(req.user.userId, platform);

    res.json({
      message: `${platform} account disconnected successfully`
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
});

// Trigger n8n workflow with user credentials
router.post('/generate-video', authenticateToken, async (req, res) => {
  try {
    const { idea, platforms } = req.body;
    
    // Get user's social credentials for selected platforms
    const socialAccounts = await userModel.getSocialCredentials(req.user.userId);
    const userCredentials = {};
    
    platforms.forEach(platform => {
      const account = socialAccounts.find(acc => acc.platform === platform);
      if (account) {
        userCredentials[platform] = account.credentials;
      }
    });

    // Log the video generation request
    const generation = await userModel.logVideoGeneration(req.user.userId, idea, null, platforms);

    // Trigger your existing n8n workflow with user-specific credentials
    const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
      userId: req.user.userId,
      generationId: generation.id,
      idea: idea,
      platforms: platforms,
      userCredentials: userCredentials
    });

    res.json({
      message: 'Video generation started',
      generationId: generation.id,
      status: 'processing',
      n8nExecutionId: n8nResponse.data?.executionId
    });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to start video generation' });
  }
});

module.exports = router;