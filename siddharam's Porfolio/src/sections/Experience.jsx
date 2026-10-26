import { experience } from '../data/siteData';
import { soundManager } from '../utils/soundEffects';

export default function Experience({ onNavigate }) {
  return (
    <div className="section-inner experience-section-v2">
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>CAREER PATH & EXPERIENCES</span>
      </div>

      <h2 className="section-main-title">
        Where I've Contributed & <span className="text-gradient">What's Next</span>
      </h2>

      <p className="section-lead-text">
        Practical industry experience combined with continuous hands-on blockchain development.
      </p>

      <div className="timeline-container-v2">
        {/* Active Seeking Beacon Card */}
        <div className="timeline-item active-beacon-item">
          <div className="timeline-node">
            <div className="beacon-pulse"></div>
            <div className="beacon-center"></div>
          </div>

          <div className="timeline-card beacon-card">
            <div className="timeline-card-header">
              <span className="status-badge-active">● CURRENTLY OPEN FOR HIRE</span>
              <span className="timeline-duration">2026 — Present</span>
            </div>

            <h3 className="timeline-role-title">Blockchain & Web3 Developer Roles</h3>
            <div className="timeline-company">Seeking Internships & Collaborative Roles</div>

            <p className="timeline-desc">
              Ready to bring smart contract engineering, testing, EVM integration, and modern frontend DApp experience to high-impact teams building decentralized technologies.
            </p>

            <div className="timeline-tags">
              <span className="exp-tag-pill">Solidity</span>
              <span className="exp-tag-pill">Smart Contracts</span>
              <span className="exp-tag-pill">DApp Architecture</span>
              <span className="exp-tag-pill">EVM Chains</span>
            </div>

            <button
              className="btn-primary-glow btn-sm"
              onClick={() => {
                soundManager.playClick();
                onNavigate('contact');
              }}
            >
              Let's Connect ✉
            </button>
          </div>
        </div>

        {/* SkillInfytech Internship Card */}
        {experience.internships.map((exp, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-node completed-node">
              <span className="node-icon">✓</span>
            </div>

            <div className="timeline-card completed-card">
              <div className="timeline-card-header">
                <span className="status-badge-completed">INTERNSHIP COMPLETED</span>
                <span className="timeline-duration">{exp.duration}</span>
              </div>

              <h3 className="timeline-role-title">{exp.title}</h3>
              <div className="timeline-company">{exp.company}</div>

              <p className="timeline-desc">{exp.description}</p>

              <div className="timeline-tags">
                {exp.tags.map((t, j) => (
                  <span className="exp-tag-pill" key={j}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}