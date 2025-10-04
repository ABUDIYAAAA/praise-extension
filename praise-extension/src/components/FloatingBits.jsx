const FloatingBits = () => {
  const bits = Array.from({ length: 30 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    bit: Math.random() > 0.5 ? "0" : "1",
    size: `${10 + Math.random() * 16}px`,
    opacity: 0.2 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-hidden rounded-xl">
      {bits.map((b, i) => (
        <span
          key={i}
          className="
            absolute 
            text-white 
            font-mono 
            select-none 
            pointer-events-none 
            blur-[0.5px] 
            animate-floatBits
          "
          style={{
            left: b.left,
            top: b.top,
            fontSize: b.size,
            opacity: b.opacity,
            animationDelay: b.delay,
          }}
        >
          {b.bit}
        </span>
      ))}
      <style>{`
        @keyframes floatBits {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0.1; }
        }
        .animate-floatBits {
          animation: floatBits 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingBits;
