export default function TransitionOverlay({ active, phase, quote }) {
  // phase: 'cover' (sliding in) | 'reveal' (sliding out)
  if (!active) return null;
  return (
    <div className={`transition-overlay ${phase}`}>
      <div className="transition-block"></div>
      <div className="transition-quote">{quote}</div>
    </div>
  );
}
