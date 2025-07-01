// User Dashboard - Main interface for idea-to-video generation
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [idea, setIdea] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchGenerations();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setSocialAccounts(response.data.socialAccounts);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchGenerations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/videos/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGenerations(response.data.generations);
    } catch (error) {
      console.error('Failed to fetch generations:', error);
    }
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerateVideo = async () => {
    if (!idea.trim() || selectedPlatforms.length === 0) {
      alert('Please enter an idea and select at least one platform');
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/social/generate-video', {
        idea: idea,
        platforms: selectedPlatforms
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Video generation started! You will be notified when complete.');
      setIdea('');
      setSelectedPlatforms([]);
      fetchGenerations();
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to start video generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const connectSocialAccount = (platform) => {
    // This would open OAuth flow for each platform
    window.open(`/api/auth/${platform}/connect`, '_blank');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Idea to Video Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <span className="subscription-badge">{user.subscription_status}</span>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Social Accounts Section */}
        <section className="social-accounts">
          <h2>Connected Accounts</h2>
          <div className="accounts-grid">
            {['instagram', 'youtube', 'tiktok'].map(platform => {
              const account = socialAccounts.find(acc => acc.platform === platform);
              return (
                <div key={platform} className={`account-card ${account ? 'connected' : 'disconnected'}`}>
                  <h3>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
                  {account ? (
                    <div>
                      <p>✅ Connected</p>
                      <small>Connected: {new Date(account.connectedAt).toLocaleDateString()}</small>
                    </div>
                  ) : (
                    <button onClick={() => connectSocialAccount(platform)}>
                      Connect {platform}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Video Generation Section */}
        <section className="video-generation">
          <h2>Generate Video</h2>
          <div className="generation-form">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Enter your idea here... (e.g., 'Create a motivational video about morning routines')"
              rows={4}
              className="idea-input"
            />
            
            <div className="platform-selection">
              <h3>Select Platforms:</h3>
              {['instagram', 'youtube', 'tiktok'].map(platform => {
                const account = socialAccounts.find(acc => acc.platform === platform);
                return (
                  <label key={platform} className={`platform-checkbox ${!account ? 'disabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform)}
                      onChange={() => handlePlatformToggle(platform)}
                      disabled={!account}
                    />
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    {!account && <span className="not-connected">(Not connected)</span>}
                  </label>
                );
              })}
            </div>

            <button 
              onClick={handleGenerateVideo}
              disabled={isGenerating || !idea.trim() || selectedPlatforms.length === 0}
              className="generate-button"
            >
              {isGenerating ? 'Generating...' : 'Generate & Post Video'}
            </button>
          </div>
        </section>

        {/* Recent Generations */}
        <section className="recent-generations">
          <h2>Recent Generations</h2>
          <div className="generations-list">
            {generations.length === 0 ? (
              <p>No videos generated yet. Create your first one above!</p>
            ) : (
              generations.map(gen => (
                <div key={gen.id} className="generation-item">
                  <div className="generation-info">
                    <h4>{gen.idea_text.substring(0, 50)}...</h4>
                    <p>Platforms: {gen.target_platforms.join(', ')}</p>
                    <small>Created: {new Date(gen.created_at).toLocaleString()}</small>
                  </div>
                  <div className={`status-badge ${gen.status}`}>
                    {gen.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .user-info {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .subscription-badge {
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .account-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        
        .account-card.connected {
          border-color: #28a745;
          background: #f8fff9;
        }
        
        .idea-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .platform-selection {
          margin-bottom: 20px;
        }
        
        .platform-checkbox {
          display: block;
          margin: 10px 0;
        }
        
        .platform-checkbox.disabled {
          opacity: 0.5;
        }
        
        .generate-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .generate-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .generations-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .generation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .status-badge.processing {
          background: #ffc107;
          color: #000;
        }
        
        .status-badge.completed {
          background: #28a745;
          color: white;
        }
        
        .status-badge.failed {
          background: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
}