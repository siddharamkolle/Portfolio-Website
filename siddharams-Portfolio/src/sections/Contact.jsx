import { useState } from 'react';
import { profile } from '../data/siteData';
import { soundManager } from '../utils/soundEffects';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { SiX, SiDiscord } from 'react-icons/si';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentStatus, setSentStatus] = useState(false);

  const cleanEmail = 'siddharamkolle097@gmail.com';

  const copyEmail = () => {
    soundManager.playBlip(700, 0.1);
    navigator.clipboard.writeText(cleanEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!email.trim() || !message.trim()) {
      return;
    }

    soundManager.playClick();

    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${name.trim() || email.trim()}`
    );

    const body = encodeURIComponent(
      `Name: ${name.trim() || 'Not specified'}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`
    );

    setSentStatus(true);
    setTimeout(() => {
      window.location.href = `mailto:${cleanEmail}?subject=${subject}&body=${body}`;
      setSentStatus(false);
    }, 600);
  };

  return (
    <div className="section-inner contact-section-v2">
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>GET IN TOUCH</span>
      </div>

      <h2 className="section-main-title">
        Let's Build Something <span className="text-gradient">Worth Shipping</span>
      </h2>

      <p className="section-lead-text">
        Whether you have a Web3 project, an internship opportunity, or want to collaborate on smart contracts, feel free to reach out.
      </p>

      <div className="contact-grid-v2">
        {/* Contact Information & Socials Card */}
        <div className="contact-info-card">
          <div className="card-header-tag">DIRECT CHANNELS</div>

          <div className="email-copy-box">
            <div className="email-label">PRIMARY INBOX</div>
            <div className="email-val">{cleanEmail}</div>
            <button
              className={`btn-copy-email ${copied ? 'copied' : ''}`}
              onClick={copyEmail}
              onMouseEnter={() => soundManager.playHover()}
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Email Address'}
            </button>
          </div>

          <div className="social-links-grid">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card-item"
              onMouseEnter={() => soundManager.playHover()}
            >
              <div className="social-icon-box"><FiGithub size={20} /></div>
              <div className="social-meta">
                <span className="social-name">GitHub</span>
                <span className="social-sub">@siddharamkolle</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>

            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card-item"
              onMouseEnter={() => soundManager.playHover()}
            >
              <div className="social-icon-box"><FiLinkedin size={20} color="#0077b5" /></div>
              <div className="social-meta">
                <span className="social-name">LinkedIn</span>
                <span className="social-sub">Siddharam Kolle</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>

            <a
              href={profile.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card-item"
              onMouseEnter={() => soundManager.playHover()}
            >
              <div className="social-icon-box"><SiX size={20} /></div>
              <div className="social-meta">
                <span className="social-name">X (Twitter)</span>
                <span className="social-sub">@ShashankKolle</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>

            <a
              href={profile.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card-item"
              onMouseEnter={() => soundManager.playHover()}
            >
              <div className="social-icon-box"><SiDiscord size={20} color="#5865f2" /></div>
              <div className="social-meta">
                <span className="social-name">Discord</span>
                <span className="social-sub">shashank_0_</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>
          </div>
        </div>

        {/* Dispatch Message Form */}
        <div className="contact-form-card">
          <div className="card-header-tag">TRANSMIT MESSAGE</div>

          <form className="contact-form-v2" onSubmit={handleSend}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satoshi Nakamoto"
                className="contact-input"
              />
            </div>

            <div className="form-group">
              <label>Your Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="satoshi@bitcoin.org"
                required
                className="contact-input"
              />
            </div>

            <div className="form-group">
              <label>Your Message / Proposal *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project, contract audit, or role opportunity..."
                rows={5}
                required
                className="contact-input contact-textarea"
              />
            </div>

            <button
              type="submit"
              className="btn-primary-glow btn-submit-message"
              onMouseEnter={() => soundManager.playHover()}
            >
              <span>{sentStatus ? 'Opening Mail Client...' : 'Dispatch Message ↗'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}