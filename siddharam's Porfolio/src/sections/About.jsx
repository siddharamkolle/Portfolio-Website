import { useState, useEffect } from 'react';
import { profile } from '../data/siteData';
import { getAcademicDetails, EVENT_DATA_UPDATED } from '../utils/portfolioStorage';
import { soundManager } from '../utils/soundEffects';

export default function About({ onNavigate }) {
  const [academic, setAcademic] = useState(() => getAcademicDetails());

  useEffect(() => {
    const handleUpdate = () => {
      setAcademic(getAcademicDetails());
    };
    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
  }, []);

  const s = academic || profile.studentDetails;

  return (
    <div className="section-inner about-section-v2">
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>BACKGROUND & PROFILE</span>
      </div>

      <h2 className="section-main-title">
        Engineering at the Intersection of <span className="text-gradient">Blockchain, Cryptography</span> & AI Systems
      </h2>

      <div className="about-grid-v2">
        {/* Main Bio Card */}
        <div className="about-card-v2 bio-card">
          <div className="card-header-tag">CORE MISSION</div>
          <p className="bio-paragraph">
            {profile.bio}
          </p>

          <div className="quote-callout">
            <span className="quote-mark">“</span>
            <span className="quote-text">{profile.tagline} — {profile.subTagline}</span>
          </div>

          <div className="about-card-footer-actions">
            <button
              className="btn-link-action"
              onClick={() => {
                soundManager.playClick();
                onNavigate('timeline');
              }}
            >
              Explore Career Timeline →
            </button>
          </div>
        </div>

        {/* Education & Academic Foundation Card */}
        <div className="about-card-v2 edu-card">
          <div className="card-header-tag">ACADEMIC FOUNDATION</div>
          <div className="edu-icon-badge">🎓</div>

          {/* Student Identity Tag */}
          <div className="student-badge-banner">
            <div className="student-name-tag">{s.fullName}</div>
            <div className="student-prn-tag">PRN: <span>{s.prn}</span></div>
          </div>

          <h3 className="edu-degree-title">{s.program}</h3>
          
          <div className="edu-dept-highlight">
            {s.department}
          </div>

          <div className="edu-inst-info">
            <span>{s.institution}</span>
            <span className="edu-timeline-pill">{s.classYear} | {s.sectionDivision}</span>
          </div>

          {Array.isArray(s.highlights) && s.highlights.length > 0 && (
            <div className="edu-details-list">
              {s.highlights.map((h, i) => (
                <div className="edu-detail-item" key={i}>
                  <span className="bullet-point">▸</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Future Vision Card */}
        <div className="about-card-v2 vision-card">
          <div className="card-header-tag">STRATEGIC GOAL</div>
          <div className="vision-icon-badge">🚀</div>
          <h3 className="vision-title">Protocol & Core Engineering</h3>
          <p className="vision-text">
            {profile.futureGoals}
          </p>
          <div className="vision-badges">
            <span className="vision-pill">Layer 1/2 Scaling</span>
            <span className="vision-pill">Zero-Knowledge Proofs</span>
            <span className="vision-pill">Smart Contract Security</span>
            <span className="vision-pill">Cross-Chain Interop</span>
          </div>
        </div>
      </div>
    </div>
  );
}