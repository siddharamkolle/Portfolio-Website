import { useState, useEffect } from 'react';
import { getProjects, EVENT_DATA_UPDATED } from '../utils/portfolioStorage';
import { soundManager } from '../utils/soundEffects';

// Bespoke visual themes and metadata for each project
const DEFAULT_METAS = [
  {
    network: 'Ethereum / Sepolia',
    type: 'ERC-721 Smart Contract',
    badgeColor: '#00f0ff',
    icon: '🎨',
    features: ['MetaMask Integration', 'Real-time Gas Estimation', 'IPFS Metadata Storage', 'Minted NFT Gallery'],
  },
  {
    network: 'Ethereum EVM',
    type: 'Decentralized Tracking',
    badgeColor: '#10b981',
    icon: '📦',
    features: ['Batch Origin Verification', 'Tamper-proof State Logs', 'Multi-role Access Control', 'QR Code Tracing'],
  },
  {
    network: 'Ethereum Mainnet/Testnet',
    type: 'Cryptographic Voting',
    badgeColor: '#8a2be2',
    icon: '🗳️',
    features: ['1 Wallet = 1 Vote', 'Tamper-evident Auditing', 'Live On-Chain Tally', 'Automated Winner Declaration'],
  },
  {
    network: 'EVM Smart Contract',
    type: 'Decentralized Application',
    badgeColor: '#ffd700',
    icon: '⚡',
    features: ['Automated Contract State', 'Decentralized Architecture', 'Web3 Wallet Connectivity', 'Tamper-proof Logic'],
  },
];

export default function Projects() {
  const [projectsList, setProjectsList] = useState(() => getProjects());
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setProjectsList(getProjects());
    };
    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
  }, []);

  const openModal = (project, meta) => {
    soundManager.playClick();
    setActiveProjectModal({ project, meta });
  };

  const closeModal = () => {
    soundManager.playClick();
    setActiveProjectModal(null);
  };

  return (
    <div className="section-inner projects-section-v2">
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>PORTFOLIO SHOWCASE</span>
      </div>

      <h2 className="section-main-title">
        Featured <span className="text-gradient">Web3 & Smart Contract</span> Projects
      </h2>

      <p className="section-lead-text">
        Production-ready decentralized applications built with Solidity, Hardhat, Ethers.js, and modern frontend stacks.
      </p>

      {/* Projects Cards Grid */}
      <div className="projects-grid-v2">
        {projectsList.map((p, i) => {
          const meta = DEFAULT_METAS[i % DEFAULT_METAS.length];

          return (
            <div
              className="proj-card-v2"
              key={p.title || i}
              onMouseEnter={() => soundManager.playHover()}
            >
              {/* Card Window Bar */}
              <div className="proj-card-window-bar">
                <div className="window-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="window-status">
                  <span className="network-indicator" style={{ backgroundColor: meta.badgeColor }}></span>
                  <span className="network-name">{meta.network}</span>
                </div>
                <div className="window-index">{i + 1 < 10 ? `0${i + 1}` : i + 1}</div>
              </div>

              {/* Bespoke Visual Mockup Display */}
              <div className="proj-mockup-banner">
                <div className="mockup-cyber-glow"></div>
                <div className="mockup-icon-badge">{meta.icon}</div>
                <div className="mockup-content">
                  <div className="mockup-badge">{meta.type}</div>
                  <div className="mockup-title">{p.title}</div>
                  <div className="mockup-verified">✔ Smart Contract Verified</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="proj-card-content">
                <h3 className="proj-card-title">{p.title}</h3>
                <p className="proj-card-desc">{p.description}</p>

                {/* Feature Highlights */}
                <div className="proj-feature-list">
                  {meta.features.slice(0, 3).map((feat, fIdx) => (
                    <div className="proj-feature-item" key={fIdx}>
                      <span className="feature-bullet">▹</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="proj-tech-tags">
                    {p.tags.map((tag, j) => (
                      <span className="proj-tag-pill" key={j}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Links */}
                <div className="proj-card-actions">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-proj-live"
                      onClick={() => soundManager.playClick()}
                    >
                      <span>Live DApp</span>
                      <span className="action-arrow">↗</span>
                    </a>
                  )}

                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-proj-github"
                      onClick={() => soundManager.playClick()}
                    >
                      <span>GitHub</span>
                      <span className="action-arrow">⌥</span>
                    </a>
                  )}

                  <button
                    className="btn-proj-details"
                    onClick={() => openModal(p, meta)}
                  >
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {activeProjectModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon">{activeProjectModal.meta.icon}</span>
                <h3>{activeProjectModal.project.title}</h3>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-meta-row">
                <span className="modal-meta-chip">Network: {activeProjectModal.meta.network}</span>
                <span className="modal-meta-chip">Contract: {activeProjectModal.meta.type}</span>
              </div>

              <p className="modal-description">{activeProjectModal.project.description}</p>

              <h4 className="modal-subtitle">Architecture & Capabilities</h4>
              <ul className="modal-features-list">
                {activeProjectModal.meta.features.map((f, idx) => (
                  <li key={idx}>✓ {f}</li>
                ))}
              </ul>

              <h4 className="modal-subtitle">Tech Stack</h4>
              <div className="proj-tech-tags">
                {Array.isArray(activeProjectModal.project.tags) && activeProjectModal.project.tags.map((t, idx) => (
                  <span className="proj-tag-pill" key={idx}>{t}</span>
                ))}
              </div>

              <div className="modal-footer-actions">
                {activeProjectModal.project.liveUrl && (
                  <a
                    href={activeProjectModal.project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-glow"
                  >
                    Launch Live DApp ↗
                  </a>
                )}
                {activeProjectModal.project.githubUrl && (
                  <a
                    href={activeProjectModal.project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass"
                  >
                    Source Code ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}