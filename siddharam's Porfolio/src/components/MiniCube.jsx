import { useEffect, useRef } from 'react';
import MiniCubeScene from '../three/MiniCubeScene';
import { soundManager } from '../utils/soundEffects';

export default function MiniCube({ sectionIndex, theme = 'dark' }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    sceneRef.current = new MiniCubeScene(canvasRef.current, theme);
    return () => sceneRef.current?.destroy();
  }, []);

  useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    sceneRef.current?.setShape(sectionIndex);
  }, [sectionIndex]);

  const handleClick = () => {
    soundManager.playBlip(750, 0.08);
    sceneRef.current?.boostSpeed();
  };

  return (
    <div
      className="mini-cube-wrap"
      onClick={handleClick}
      title="Click to spin 3D core"
    >
      <canvas ref={canvasRef} className="mini-cube-canvas" />
      <span className="mini-cube-hint">3D CORE</span>
    </div>
  );
}
