import { useEffect, useRef, useState } from 'react';
import FancyDonutScene from '../three/FancyDonutScene';
import { soundManager } from '../utils/soundEffects';

const MODES = [
  { id: 'cyber-donut', label: '🍩 Cyber Donut' },
  { id: 'torus-knot', label: '♾️ Torus Knot' },
  { id: 'quantum-particles', label: '✨ Quantum Vortex' },
  { id: 'blockchain-mesh', label: '⛓️ Smart Mesh' },
];

export default function BlockchainCanvas({ sectionIndex = 0, theme = 'dark' }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [activeMode, setActiveMode] = useState('cyber-donut');
  const [isHudOpen, setIsHudOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new FancyDonutScene(canvasRef.current, theme);
    sceneRef.current = scene;

    return () => {
      scene.destroy();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setSection(sectionIndex);
    }
  }, [sectionIndex]);

  const handleModeChange = (modeId) => {
    soundManager.playClick();
    setActiveMode(modeId);
    if (sceneRef.current) {
      sceneRef.current.setMode(modeId);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="bg-canvas fancy-donut-canvas" />

      {/* Interactive 3D Donut HUD Controller */}
      <div className="three-hud-container">
        <button
          className={`three-hud-badge ${isHudOpen ? 'open' : ''}`}
          onClick={() => {
            soundManager.playClick();
            setIsHudOpen(!isHudOpen);
          }}
          title="Customize 3D View"
        >
          <span className="three-hud-pulse"></span>
          <span className="three-hud-label">3D: {MODES.find(m => m.id === activeMode)?.label || 'Donut'}</span>
          <span className="three-hud-arrow">{isHudOpen ? '✕' : '⚙'}</span>
        </button>

        {isHudOpen && (
          <div className="three-hud-menu">
            <div className="three-hud-title">3D VIEW PRESETS</div>
            <div className="three-hud-options">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  className={`three-hud-option-btn ${activeMode === m.id ? 'active' : ''}`}
                  onClick={() => handleModeChange(m.id)}
                >
                  <span>{m.label}</span>
                  {activeMode === m.id && <span className="three-hud-check">●</span>}
                </button>
              ))}
            </div>
            <div className="three-hud-tip">💡 Drag anywhere to rotate in 3D</div>
          </div>
        )}
      </div>
    </>
  );
}
