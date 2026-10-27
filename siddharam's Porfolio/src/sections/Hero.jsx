import { profile, stats } from '../data/siteData';
import { soundManager } from '../utils/soundEffects';
import { FiFileText } from 'react-icons/fi';

export default function Hero({ onNavigate }) {
  return (
    <div className="section-inner hero-section-v2">
      {/* Dynamic Background Watermark Typography */}
      <div className="hero-watermark-text" aria-hidden="true">
        SIDDHARAM
      </div>

      <div className="hero-content-wrapper">
        {/* Center Portrait with Holographic Cyber Halo */}
        <div className="hero-avatar-container">
          <div className="hero-avatar-ring outer-ring"></div>
          <div className="hero-avatar-ring inner-ring"></div>
          <div className="hero-avatar-glow"></div>
          <div className="hero-photo-wrapper">
            <img
              src={profile.photo}
              alt={profile.name}
              className="hero-portrait-img"
            />
          </div>
        </div>

        {/* Typography & Subtitle */}
        <h1 className="hero-title">
          <span className="hero-title-greeting">Hello, I'm</span>
          <span className="hero-title-name">{profile.name}</span>
        </h1>

        <p className="hero-tagline centered-tagline">
          <span className="hero-tagline-highlight">{profile.role}</span>
        </p>

        <p className="hero-subtext">
          Building tamper-proof smart contracts, decentralized applications, and next-gen Web3 architecture on Ethereum & EVM chains.
        </p>

        {/* Stats Row */}
        <div className="hero-stats-row">
          {stats.map((s, idx) => (
            <div className="hero-stat-card" key={idx}>
              <div className="hero-stat-number">{s.value}+</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action CTAs: Projects, Resume, Ask AI */}
        <div className="hero-actions">
          <button
            className="btn-primary-glow"
            onClick={() => {
              soundManager.playClick();
              onNavigate('projects');
            }}
            onMouseEnter={() => soundManager.playHover()}
            title="Explore Web3 & Software Projects"
          >
            <span>View Projects</span>
            <span className="btn-arrow">↗</span>
          </button>

          <button
            className="btn-glass btn-resume-link"
            onClick={() => {
              soundManager.playClick();
              onNavigate('resume');
            }}
            onMouseEnter={() => soundManager.playHover()}
            title="View & Download Tech Resume & Academic CV"
          >
            <FiFileText size={15} />
            <span>Resume & CV</span>
            <span className="btn-resume-badge">PDF</span>
          </button>

          <button
            className="btn-glass btn-ai-link"
            onClick={() => {
              soundManager.playClick();
              onNavigate('assistant');
            }}
            onMouseEnter={() => soundManager.playHover()}
            title="Interact with AI Assistant"
          >
            <span>Ask AI</span>
            <span className="btn-ai-indicator">⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
}

