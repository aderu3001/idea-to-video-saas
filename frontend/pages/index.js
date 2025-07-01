// Landing page
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <h1 className="logo">IdeaToVideo</h1>
          <nav>
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <div className="auth-buttons">
                <Link href="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="hero">
        <div className="container">
          <h1 className="hero-title">
            Turn Your Ideas Into Viral Videos
          </h1>
          <p className="hero-subtitle">
            AI-powered video generation that automatically posts to Instagram, YouTube, and TikTok
          </p>
          
          <div className="features">
            <div className="feature">
              <h3>💡 Submit Your Idea</h3>
              <p>Just type your video concept</p>
            </div>
            <div className="feature">
              <h3>🎬 AI Creates Video</h3>
              <p>High-quality videos generated instantly</p>
            </div>
            <div className="feature">
              <h3>📱 Auto-Post Everywhere</h3>
              <p>Automatically posts to all your social accounts</p>
            </div>
          </div>

          <div className="cta">
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-large btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/register" className="btn btn-large btn-primary">
                Start Creating Videos
              </Link>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .header {
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        
        .auth-buttons {
          display: flex;
          gap: 10px;
        }
        
        .btn {
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .btn-primary {
          background: #ff6b6b;
          color: white;
        }
        
        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid white;
        }
        
        .btn-large {
          padding: 15px 30px;
          font-size: 18px;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .hero {
          padding: 80px 0;
          text-align: center;
        }
        
        .hero-title {
          font-size: 48px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        .hero-subtitle {
          font-size: 20px;
          margin-bottom: 60px;
          opacity: 0.9;
        }
        
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 60px;
        }
        
        .feature {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        
        .feature h3 {
          margin-bottom: 10px;
          font-size: 20px;
        }
        
        .cta {
          margin-top: 40px;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .features {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}