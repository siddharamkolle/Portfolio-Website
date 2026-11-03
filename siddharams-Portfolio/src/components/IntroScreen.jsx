import { useEffect, useState } from 'react';
import { profile, quotes } from '../data/siteData';
import { soundManager } from '../utils/soundEffects';

export default function IntroScreen({ onOpen }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 2600);
    return () => clearInterval(t);
  }, []);

  const handleOpen = () => {
    soundManager.playSectionTransition();
    onOpen();
  };

  return (
    <div className="intro-screen-v2">
      <div className="intro-topbar">
        <div className="intro-badge">
          <span className="intro-dot"></span>
          <span>SYSTEM ONLINE · v4.5</span>
        </div>
        <div className="intro-subtitle-right">SOL - ETH - EVM</div>
      </div>

      <div className="intro-center-v2">
        <div className="intro-eyebrow">BLOCKCHAIN & WEB3 DEVELOPER</div>
        <h1 className="intro-hero-name">{profile.name}</h1>

        <div className="intro-quote-container">
          <span key={quoteIndex} className="intro-quote-text">
            “{quotes[quoteIndex]}”
          </span>
        </div>

        <button
          className="intro-launch-btn"
          onClick={handleOpen}
          onMouseEnter={() => soundManager.playHover()}
        >
          <span className="launch-btn-glow"></span>
          <span className="launch-btn-text">ENTER EXPERIENCE</span>
          <span className="launch-btn-arrow">→</span>
        </button>

        <div className="intro-keyboard-hint">
          <span>press</span>
          <kbd className="intro-kbd">ENTER</kbd>
          <span>or click above</span>
        </div>
      </div>

    </div>
  );
}
