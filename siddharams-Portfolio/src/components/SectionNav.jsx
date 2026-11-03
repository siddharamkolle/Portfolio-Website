import {
  FiHome,
  FiUser,
  FiCode,
  FiBriefcase,
  FiFolder,
  FiFileText,
  FiMessageCircle,
  FiMail,
  FiClock,
  FiAward,
  FiGithub,
} from 'react-icons/fi';
import { soundManager } from '../utils/soundEffects';

const ICONS = {
  home: FiHome,
  about: FiUser,
  timeline: FiClock,
  skills: FiCode,
  projects: FiFolder,
  resume: FiFileText,
  credentials: FiAward,
  github: FiGithub,
  assistant: FiMessageCircle,
  contact: FiMail,
};

export default function SectionNav({ sections, activeIndex, onNavigate }) {
  return (
    <nav className="dock-nav" aria-label="Section Navigation">
      <div className="dock-inner">
        {sections.map((s, i) => {
          const Icon = ICONS[s.id] || FiHome;
          const isActive = i === activeIndex;

          return (
            <button
              key={s.id}
              className={`dock-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                soundManager.playSectionTransition();
                onNavigate(i);
              }}
              onMouseEnter={() => soundManager.playHover()}
              aria-label={s.label}
            >
              <span className="dock-icon-wrap">
                <Icon size={17} />
              </span>
              <span className="dock-tooltip">
                <span className="dock-tooltip-index">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                <span className="dock-tooltip-label">{s.label}</span>
              </span>
              {isActive && <span className="dock-active-glow" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
