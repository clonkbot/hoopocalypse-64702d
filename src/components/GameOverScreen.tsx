import { GameStats } from '../App'

interface GameOverScreenProps {
  stats: GameStats
  onRestart: () => void
}

export function GameOverScreen({ stats, onRestart }: GameOverScreenProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      {/* Overlay with red tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0612]/95 via-[#200a1a]/90 to-[#0a0612]/95 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6 px-4 text-center max-w-md w-full">
        {/* Game Over text */}
        <h1
          className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-red-500 to-red-800"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            textShadow: '0 0 60px rgba(255,50,50,0.5)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          GAME OVER
        </h1>

        {/* Final score */}
        <div className="flex flex-col items-center gap-1 md:gap-2 mt-4 md:mt-8">
          <span
            className="text-xs md:text-sm tracking-[0.3em] text-orange-400/70"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            FINAL SCORE
          </span>
          <span
            className="text-5xl md:text-8xl font-black text-orange-400"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              textShadow: '0 0 40px rgba(255,95,31,0.6)'
            }}
          >
            {stats.score.toLocaleString()}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-8 w-full">
          <StatBox label="LEVEL" value={stats.level.toString()} color="cyan" />
          <StatBox label="KILLS" value={stats.kills.toString()} color="purple" />
          <StatBox label="TIME" value={formatTime(stats.time)} color="green" />
        </div>

        {/* Restart button */}
        <button
          onClick={onRestart}
          className="group relative px-10 md:px-16 py-4 md:py-5 mt-6 md:mt-10 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto min-w-[200px] md:min-w-[280px]"
          style={{
            boxShadow: '0 0 40px rgba(255,95,31,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span
            className="relative text-lg md:text-2xl font-black tracking-widest text-white"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            PLAY AGAIN
          </span>
        </button>

        {/* Motivational text */}
        <p
          className="text-white/40 text-xs md:text-sm mt-4"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          The court awaits your return...
        </p>
      </div>

      {/* Red glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,50,50,0.1) 0%, transparent 50%)',
          animation: 'pulse 3s ease-in-out infinite'
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-20 md:w-32 h-20 md:h-32 border-l-2 border-t-2 border-red-500/30 rounded-tl-3xl" />
      <div className="absolute top-8 right-8 w-20 md:w-32 h-20 md:h-32 border-r-2 border-t-2 border-red-500/30 rounded-tr-3xl" />
      <div className="absolute bottom-8 left-8 w-20 md:w-32 h-20 md:h-32 border-l-2 border-b-2 border-red-500/30 rounded-bl-3xl" />
      <div className="absolute bottom-8 right-8 w-20 md:w-32 h-20 md:h-32 border-r-2 border-b-2 border-red-500/30 rounded-br-3xl" />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses = {
    cyan: 'border-cyan-500/30 text-cyan-400',
    purple: 'border-purple-500/30 text-purple-400',
    green: 'border-green-500/30 text-green-400',
    orange: 'border-orange-500/30 text-orange-400'
  }

  return (
    <div className={`flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 bg-black/30 backdrop-blur-sm rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <span
        className="text-[10px] md:text-xs tracking-widest opacity-70"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        {label}
      </span>
      <span
        className="text-xl md:text-3xl font-bold"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
      >
        {value}
      </span>
    </div>
  )
}
