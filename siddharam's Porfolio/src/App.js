import { useEffect, useState, useCallback, useRef } from 'react';
import BlockchainCanvas from './components/BlockchainCanvas';
import LoadingScreen from './components/LoadingScreen';
import IntroScreen from './components/IntroScreen';
import SectionNav from './components/SectionNav';
import SocialNav from './components/SocialNav';
import MiniCube from './components/MiniCube';
import TransitionOverlay from './components/TransitionOverlay';
import AdminStudioModal from './components/AdminStudioModal';
import Hero from './sections/Hero';
import About from './sections/About';
import Timeline from './sections/Timeline';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Credentials from './sections/Credentials';
import Resume from './sections/Resume';
import AIAssistant from './sections/AIAssistant';
import Contact from './sections/Contact';
import { quotes } from './data/siteData';
import { soundManager } from './utils/soundEffects';

const SECTIONS = [
  { id: 'home', label: 'Home', Comp: Hero },
  { id: 'about', label: 'About', Comp: About },
  { id: 'timeline', label: 'Timeline', Comp: Timeline },
  { id: 'skills', label: 'Skills', Comp: Skills },
  { id: 'projects', label: 'Projects', Comp: Projects },
  { id: 'resume', label: 'Resume / CV', Comp: Resume },
  { id: 'credentials', label: 'Credentials', Comp: Credentials },
  { id: 'assistant', label: 'AI Assistant', Comp: AIAssistant },
  { id: 'contact', label: 'Contact', Comp: Contact },
];

export default function App() {
  const [bootPhase, setBootPhase] = useState('loading');
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [phase, setPhase] = useState('cover');
  const [quote, setQuote] = useState(quotes[0]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('siddharam_portfolio_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const wheelLockRef = useRef(false);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('siddharam_portfolio_theme', theme);
    } catch (e) {}
  }, [theme]);

  const selectTheme = useCallback((newTheme) => {
    soundManager.playClick();
    setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    soundManager.playClick();
    setTheme((prev) => (prev === 'dark' ? 'white' : 'dark'));
  }, []);

  const goTo = useCallback((newIndex) => {
    if (newIndex === index || transitioning || newIndex < 0 || newIndex >= SECTIONS.length) return;
    soundManager.playSectionTransition();
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setTransitioning(true);
    setPhase('cover');
    setTimeout(() => {
      setIndex(newIndex);
      setPhase('reveal');
    }, 450);
    setTimeout(() => {
      setTransitioning(false);
    }, 950);
  }, [index, transitioning]);

  const goToById = useCallback((id) => {
    const i = SECTIONS.findIndex((s) => s.id === id);
    if (i >= 0) goTo(i);
  }, [goTo]);

  // Keyboard navigation & Theme shortcut
  useEffect(() => {
    if (bootPhase !== 'site') return;
    function onKey(e) {
      if (isAdminOpen) return;
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'j') goTo(index + 1);
      if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'k') goTo(index - 1);
      if (e.key === '1') selectTheme('dark');
      if (e.key === '2') selectTheme('white');
      if (e.key === 't' || e.key === 'T') toggleTheme();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bootPhase, index, goTo, isAdminOpen, selectTheme, toggleTheme]);

  // Mouse-wheel / trackpad navigation with smooth cooldown and scroll-container awareness
  useEffect(() => {
    if (bootPhase !== 'site') return;

    function onWheel(e) {
      // If modal or admin is open, don't change section
      if (isAdminOpen || e.target.closest('.modal-backdrop, .modal-dialog, .admin-modal-backdrop')) return;

      // If user is inside a scrollable container
      const scrollable = e.target.closest('.section-inner, .chat-box-v2, .projects-grid-v2, .heatmap-scroll-wrap');
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 5;
        const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 5;
        // If scrolling down and not at bottom, let container scroll naturally
        if (e.deltaY > 0 && !atBottom) return;
        // If scrolling up and not at top, let container scroll naturally
        if (e.deltaY < 0 && !atTop) return;
      }

      if (wheelLockRef.current) return;

      if (Math.abs(e.deltaY) > 35) {
        wheelLockRef.current = true;
        if (e.deltaY > 0) {
          goTo(index + 1);
        } else {
          goTo(index - 1);
        }
        setTimeout(() => {
          wheelLockRef.current = false;
        }, 850);
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [bootPhase, index, goTo, isAdminOpen]);

  // Enter key on intro screen
  useEffect(() => {
    if (bootPhase !== 'intro') return;
    function onKey(e) {
      if (e.key === 'Enter') {
        soundManager.playSectionTransition();
        setBootPhase('site');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bootPhase]);

  const ActiveComp = SECTIONS[index].Comp;

  return (
    <div className={`app-root theme-${theme}`} data-theme={theme}>
      <BlockchainCanvas sectionIndex={index} theme={theme} />

      {/* Boot Phase 1: Fast initial preloader */}
      {bootPhase === 'loading' && (
        <LoadingScreen label="Spinning Up 3D Torus Engine" duration={1100} onDone={() => setBootPhase('intro')} />
      )}

      {/* Boot Phase 2: Cyber Intro Hero */}
      {bootPhase === 'intro' && (
        <IntroScreen onOpen={() => setBootPhase('site')} />
      )}

      {/* Boot Phase 3: Active Portfolio Experience */}
      {bootPhase === 'site' && (
        <>
          {/* Top Header Floating Status Bar */}
          <header className="site-header-hud">
            <div className="hud-actions-right">
              {/* Sleek DARK / WHITE One-Click Mode Toggle */}
              <button
                type="button"
                className={`theme-mode-toggle-pill ${theme === 'dark' ? 'is-dark' : 'is-white'}`}
                onClick={toggleTheme}
                title={`Theme Mode: ${theme === 'dark' ? 'DARK' : 'WHITE'} (Click to toggle, Shortcut: T)`}
                aria-label={`Current mode: ${theme === 'dark' ? 'DARK' : 'WHITE'}. Click to toggle.`}
              >
                <span className={`mode-badge ${theme === 'dark' ? 'active' : ''}`}>
                  <span className="mode-symbol">🌙</span>
                  <span className="mode-name">DARK</span>
                </span>
                <span className={`mode-badge ${theme === 'white' ? 'active' : ''}`}>
                  <span className="mode-symbol">☀️</span>
                  <span className="mode-name">WHITE</span>
                </span>
                <span className="mode-pill-thumb" aria-hidden="true" />
              </button>

              {/* Admin Studio Launcher */}
              <button
                className="hud-admin-btn"
                onClick={() => {
                  soundManager.playClick();
                  setIsAdminOpen(true);
                }}
                title="Open Admin Studio (Add, Edit, Reorder Timeline & Credentials)"
              >
                <span>⚡</span>
                <span className="hud-admin-label">Admin Studio</span>
              </button>
            </div>
          </header>

          {/* Main Slide Stage */}
          <main className="section-stage">
            <ActiveComp onNavigate={goToById} />
          </main>

          {/* Navigation Docks & Companion Elements */}
          <SectionNav sections={SECTIONS} activeIndex={index} onNavigate={goTo} />
          <SocialNav />
          <MiniCube sectionIndex={index} theme={theme} />

          {/* Sleek Floating Arrow Capsule */}
          <div className="nav-arrows-v2">
            <button
              className="nav-arrow-btn"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous section"
              title="Previous section (↑ or k)"
            >
              ▲
            </button>
            <span className="nav-arrow-counter">
              {index + 1 < 10 ? `0${index + 1}` : index + 1} / {SECTIONS.length < 10 ? `0${SECTIONS.length}` : SECTIONS.length}
            </span>
            <button
              className="nav-arrow-btn"
              onClick={() => goTo(index + 1)}
              disabled={index === SECTIONS.length - 1}
              aria-label="Next section"
              title="Next section (↓ or j)"
            >
              ▼
            </button>
          </div>

          {/* Admin Studio Management Modal */}
          <AdminStudioModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </>
      )}

      {/* Section Transition Overlay */}
      <TransitionOverlay active={transitioning} phase={phase} quote={quote} />
    </div>
  );
}
