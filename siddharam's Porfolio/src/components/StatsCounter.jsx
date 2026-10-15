import { useEffect, useRef, useState } from 'react';
import { stats } from '../data/siteData';

function Counter({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let raf;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsCounter() {
  return (
    <div className="stats-row">
      {stats.map((s, i) => (
        <div className="stat-item" key={i}>
          <div className="stat-value"><Counter value={s.value} duration={1000 + i * 200} /></div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
