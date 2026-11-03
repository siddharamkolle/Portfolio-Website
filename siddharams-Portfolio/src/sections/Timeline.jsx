import { useState, useEffect } from 'react';
import { getTimeline, EVENT_DATA_UPDATED } from '../utils/portfolioStorage';
import { soundManager } from '../utils/soundEffects';
import { FiBriefcase, FiBookOpen, FiCalendar, FiCheckCircle, FiClock, FiLayers, FiInfo, FiX } from 'react-icons/fi';

export default function Timeline({ onNavigate }) {
  const [items, setItems] = useState(() => getTimeline());
  const [filter, setFilter] = useState('all'); // 'all' | 'career' | 'education'
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getTimeline());
    };
    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type?.toLowerCase() === filter.toLowerCase();
  });

  const openMilestoneModal = (milestone) => {
    soundManager.playClick();
    setSelectedMilestone(milestone);
  };

  const closeMilestoneModal = () => {
    soundManager.playClick();
    setSelectedMilestone(null);
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('current') || s.includes('active') || s.includes('progress')) {
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#10b981' };
    }
    return { bg: 'rgba(0, 240, 255, 0.15)', text: '#00f0ff', border: '#00f0ff' };
  };

  return (
    <div className="section-inner timeline-section-v2">
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>CHRONOLOGICAL JOURNEY</span>
      </div>

      <div className="timeline-header-row">
        <div>
          <h2 className="section-main-title">
            Career & <span className="text-gradient">Education Milestones</span>
          </h2>
          <p className="section-lead-text">
            Interactive vertical timeline tracking academic foundations, industry experience, and technical leadership milestones.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="timeline-filter-pills">
          <button
            className={`filter-pill-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('all');
            }}
          >
            All Milestones ({items.length})
          </button>
          <button
            className={`filter-pill-btn ${filter === 'career' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('career');
            }}
          >
            <FiBriefcase size={12} /> Career ({items.filter(i => i.type?.toLowerCase() === 'career').length})
          </button>
          <button
            className={`filter-pill-btn ${filter === 'education' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('education');
            }}
          >
            <FiBookOpen size={12} /> Education ({items.filter(i => i.type?.toLowerCase() === 'education').length})
          </button>
        </div>
      </div>

      {/* Vertical Timeline Track */}
      <div className="vertical-timeline-track">
        <div className="timeline-rail-line" aria-hidden="true"></div>

        {filteredItems.map((item, idx) => {
          const isEdu = item.type?.toLowerCase() === 'education';
          const statusStyle = getStatusColor(item.status);
          const isCurrent = (item.status || '').toLowerCase().includes('current') || (item.status || '').toLowerCase().includes('active');

          return (
            <div
              key={item.id || idx}
              className={`timeline-milestone-node ${isCurrent ? 'is-active-milestone' : ''}`}
              onMouseEnter={() => soundManager.playHover()}
            >
              {/* Connector Pin / Node */}
              <div className="milestone-pin-wrap">
                <div
                  className="milestone-pin-dot"
                  style={{ borderColor: statusStyle.border }}
                >
                  {isCurrent ? (
                    <span className="milestone-pin-pulse"></span>
                  ) : isEdu ? (
                    <FiBookOpen size={12} style={{ color: statusStyle.text }} />
                  ) : (
                    <FiCheckCircle size={12} style={{ color: statusStyle.text }} />
                  )}
                </div>
                <div className="milestone-pin-connector"></div>
              </div>

              {/* Milestone Card */}
              <div
                className="milestone-card-body"
                onClick={() => openMilestoneModal(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openMilestoneModal(item)}
              >
                <div className="milestone-card-topbar">
                  <div className="milestone-tags-left">
                    <span
                      className="milestone-status-chip"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        borderColor: statusStyle.border,
                      }}
                    >
                      {isCurrent && <span className="pulse-indicator">●</span>}
                      {item.status || 'Verified'}
                    </span>
                    <span className="milestone-type-chip">
                      {isEdu ? '🎓 Education' : '💼 Career Experience'}
                    </span>
                  </div>

                  <div className="milestone-period-badge">
                    <FiCalendar size={11} />
                    <span>{item.date}</span>
                    {item.period && <span className="period-sub">({item.period})</span>}
                  </div>
                </div>

                <h3 className="milestone-title">{item.title}</h3>
                <div className="milestone-org">{item.organization}</div>

                <p className="milestone-description">{item.description}</p>

                {/* Skill Pills */}
                {Array.isArray(item.skills) && item.skills.length > 0 && (
                  <div className="milestone-skills-wrap">
                    {item.skills.map((skill, sIdx) => (
                      <span className="milestone-skill-pill" key={sIdx}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="milestone-card-footer">
                  <span className="milestone-inspect-hint">
                    <FiInfo size={12} /> Tap / Click to inspect detailed achievements
                  </span>
                  <span className="milestone-arrow-link">View Details ↗</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Milestone Modal */}
      {selectedMilestone && (
        <div className="modal-backdrop" onClick={closeMilestoneModal}>
          <div className="modal-dialog milestone-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon">
                  {selectedMilestone.type?.toLowerCase() === 'education' ? '🎓' : '💼'}
                </span>
                <div>
                  <h3>{selectedMilestone.title}</h3>
                  <div className="modal-subtitle-org">{selectedMilestone.organization}</div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeMilestoneModal} title="Close">
                <FiX size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-meta-row">
                <span className="modal-meta-chip">
                  <FiCalendar size={12} /> {selectedMilestone.date}
                </span>
                {selectedMilestone.period && (
                  <span className="modal-meta-chip">
                    <FiClock size={12} /> {selectedMilestone.period}
                  </span>
                )}
                <span className="modal-meta-chip highlight-chip">
                  Status: {selectedMilestone.status}
                </span>
                <span className="modal-meta-chip">
                  Type: {selectedMilestone.type}
                </span>
              </div>

              <div className="modal-section-title">Overview & Context</div>
              <p className="modal-description">{selectedMilestone.description}</p>

              {Array.isArray(selectedMilestone.details) && selectedMilestone.details.length > 0 && (
                <>
                  <div className="modal-section-title">Key Responsibilities & Achievements</div>
                  <ul className="modal-features-list">
                    {selectedMilestone.details.map((bullet, bIdx) => (
                      <li key={bIdx}>
                        <span className="bullet-sym">▹</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {Array.isArray(selectedMilestone.skills) && selectedMilestone.skills.length > 0 && (
                <>
                  <div className="modal-section-title">Technologies & Competencies</div>
                  <div className="proj-tech-tags">
                    {selectedMilestone.skills.map((skill, sIdx) => (
                      <span className="proj-tag-pill" key={sIdx}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="modal-footer-actions">
                <button
                  className="btn-primary-glow"
                  onClick={() => {
                    closeMilestoneModal();
                    if (onNavigate) onNavigate('contact');
                  }}
                >
                  Discuss Milestone / Hire ↗
                </button>
                <button className="btn-glass" onClick={closeMilestoneModal}>
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
