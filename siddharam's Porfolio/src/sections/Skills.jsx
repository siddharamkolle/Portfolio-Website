import { useState, useEffect } from 'react';
import {
  SiSolidity,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiWeb3Dotjs,
  SiEthereum,
  SiGit,
  SiGithub,
  SiVercel,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { getSkills, EVENT_DATA_UPDATED } from '../utils/portfolioStorage';
import { soundManager } from '../utils/soundEffects';

const ICON_MAP = {
  SiSolidity,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiWeb3Dotjs,
  SiEthereum,
  SiGit,
  SiGithub,
  SiVercel,
  VscVscode,
};

const PROFICIENCY_MAP = {
  'Solidity': 'Core Focus',
  'Ethereum / EVM': 'Specialization',
  'Web3.js': 'Advanced',
  'React': 'Production',
  'JavaScript': 'Advanced',
  'TypeScript': 'Proficient',
  'Node.js': 'Intermediate',
  'Python': 'Proficient',
  'Git': 'Workflow',
  'GitHub': 'Workflow',
  'VS Code': 'Primary IDE',
  'Vercel': 'Deployment',
};

export default function Skills() {
  const [skillsData, setSkillsData] = useState(() => getSkills());
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const handleUpdate = () => {
      setSkillsData(getSkills());
    };
    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
  }, []);

  const categories = ['All', ...Object.keys(skillsData)];

  const allSkillItems = Object.entries(skillsData).flatMap(([category, items]) =>
    (Array.isArray(items) ? items : []).map((it) => ({ ...it, category }))
  );

  const filteredItems = activeCategory === 'All'
    ? allSkillItems
    : allSkillItems.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (cat) => {
    soundManager.playClick();
    setActiveCategory(cat);
  };

  return (
    <div className="section-inner skills-section-v2">
      <p className="section-lead-text">
        Focused on decentralized protocols, EVM smart contracts, and responsive full-stack Web3 interfaces.
      </p>

      {/* Category Tabs */}
      <div className="skills-filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`skills-tab-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
            onMouseEnter={() => soundManager.playHover()}
          >
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="skills-matrix-grid">
        {filteredItems.map((it, i) => {
          const Icon = ICON_MAP[it.icon] || SiEthereum;
          const level = PROFICIENCY_MAP[it.name] || 'Proficient';
          const color = it.color || '#00f0ff';

          return (
            <div
              className="skill-card-v2"
              key={i}
              onMouseEnter={() => soundManager.playHover()}
              style={{ '--skill-accent': color }}
            >
              <div className="skill-card-halo" style={{ backgroundColor: color }}></div>

              <div className="skill-icon-wrapper" style={{ borderColor: `${color}44` }}>
                <Icon size={28} color={color} />
              </div>

              <div className="skill-info">
                <h4 className="skill-name">{it.name}</h4>
                <div className="skill-sub-info">
                  <span className="skill-category-label">{it.category}</span>
                  <span className="skill-level-badge">{level}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}