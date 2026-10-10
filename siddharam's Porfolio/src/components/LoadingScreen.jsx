import { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/soundEffects';

export default function LoadingScreen({ label = 'Initializing 3D Environment', duration = 1200, onDone }) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let current = 0;
    const stepTime = 20;
    const increment = 100 / (duration / stepTime);
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        if (!doneRef.current) {
          doneRef.current = true;
          soundManager.playBlip(880, 0.12);
          setTimeout(() => onDone && onDone(), 200);
        }
      }
      setCount(Math.floor(current));
    }, stepTime);
    return () => clearInterval(timer);
  }, [duration, onDone]);

  return (
    <div className="loading-screen-v2">
      <div className="loading-cyber-core">
        <div className="loading-donut-ring"></div>
        <div className="loading-percent-text">{count}%</div>
      </div>

      <div className="loading-bar-track-v2">
        <div className="loading-bar-fill-v2" style={{ width: `${count}%` }}></div>
      </div>

      <div className="loading-status-text">
        <span className="loading-status-dot"></span>
        <span>{label}</span>
      </div>
    </div>
  );
}
