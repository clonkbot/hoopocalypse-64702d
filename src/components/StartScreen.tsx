interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612]/90 via-[#1a0a2e]/80 to-[#0a0612]/90 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 px-4 text-center">
        {/* Title decoration */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-transparent to-orange-500" />
          <span
            className="text-xs md:text-sm tracking-[0.5em] text-orange-400/70 uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Survivors
          </span>
          <div className="w-8 md:w-16 h-0.5 bg-gradient-to-l from-transparent to-orange-500" />
        </div>

        {/* Main title */}
        <h1
          className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-200 to-orange-500"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            textShadow: '0 0 60px rgba(255,95,31,0.5)',
            WebkitTextStroke: '1px rgba(255,95,31,0.3)'
          }}
        >
          HOOPOCALYPSE
        </h1>

        {/* Subtitle */}
        <p
          className="text-base md:text-xl text-cyan-300/80 tracking-widest max-w-md"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          SURVIVE THE COURT
        </p>

        {/* Basketball icon */}
        <div className="relative my-4 md:my-8">
          <div
            className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-400 via-orange-600 to-orange-800 animate-bounce"
            style={{
              boxShadow: '0 0 60px rgba(255,95,31,0.6), inset 0 -10px 30px rgba(0,0,0,0.3)',
              animationDuration: '1s'
            }}
          >
            {/* Basketball lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-black/40 rounded-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-full bg-black/40 rounded-full" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-black/30" />
          </div>

          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: 'radial-gradient(circle, rgba(255,95,31,0.3) 0%, transparent 70%)',
              animationDuration: '2s'
            }}
          />
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="group relative px-10 md:px-16 py-4 md:py-5 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto min-w-[200px] md:min-w-[280px]"
          style={{
            boxShadow: '0 0 40px rgba(255,95,31,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span
            className="relative text-lg md:text-2xl font-black tracking-widest text-white"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            PLAY
          </span>
        </button>

        {/* Instructions */}
        <div className="flex flex-col gap-3 mt-4 md:mt-8 text-white/50 text-xs md:text-sm">
          <p style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <span className="text-cyan-400">WASD</span> or <span className="text-cyan-400">TAP</span> to move
          </p>
          <p style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Auto-aim basketballs at enemies
          </p>
          <p style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Collect <span className="text-green-400">EXP</span> to level up
          </p>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-20 md:w-32 h-20 md:h-32 border-l-2 border-t-2 border-orange-500/30 rounded-tl-3xl" />
      <div className="absolute top-8 right-8 w-20 md:w-32 h-20 md:h-32 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-3xl" />
      <div className="absolute bottom-8 left-8 w-20 md:w-32 h-20 md:h-32 border-l-2 border-b-2 border-purple-500/30 rounded-bl-3xl" />
      <div className="absolute bottom-8 right-8 w-20 md:w-32 h-20 md:h-32 border-r-2 border-b-2 border-orange-500/30 rounded-br-3xl" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
