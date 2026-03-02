import { GameStats } from '../App'

interface HUDProps {
  stats: GameStats
}

export function HUD({ stats }: HUDProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const expPercent = (stats.exp / stats.expToNext) * 100

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-3 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
          {/* Level & EXP */}
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <span
                className="text-sm md:text-lg font-bold tracking-widest text-cyan-400"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                LVL
              </span>
              <span
                className="text-2xl md:text-4xl font-black text-white"
                style={{ fontFamily: "'Archivo Black', sans-serif", textShadow: '0 0 20px rgba(0,255,255,0.5)' }}
              >
                {stats.level}
              </span>
            </div>
            {/* EXP bar */}
            <div className="w-full md:w-48 h-2 md:h-3 bg-black/50 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-300"
                style={{
                  width: `${expPercent}%`,
                  boxShadow: '0 0 10px rgba(0,255,255,0.8)'
                }}
              />
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-start md:items-center">
            <span
              className="text-[10px] md:text-xs tracking-[0.3em] text-orange-400/70"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              SCORE
            </span>
            <span
              className="text-3xl md:text-5xl font-black text-orange-400"
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                textShadow: '0 0 30px rgba(255,95,31,0.6)'
              }}
            >
              {stats.score.toLocaleString()}
            </span>
          </div>

          {/* Time */}
          <div className="absolute top-3 right-3 md:relative md:top-0 md:right-0 flex flex-col items-end">
            <span
              className="text-[10px] md:text-xs tracking-[0.3em] text-white/50"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              TIME
            </span>
            <span
              className="text-xl md:text-3xl font-bold text-white/90"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {formatTime(stats.time)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-12 md:bottom-16 left-0 right-0 px-3 md:px-6">
        <div className="flex justify-between items-end">
          {/* Kills counter */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 md:px-4 py-2 rounded-lg border border-purple-500/30">
            <svg className="w-4 h-4 md:w-6 md:h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span
              className="text-lg md:text-2xl font-bold text-purple-300"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {stats.kills}
            </span>
          </div>

          {/* Controls hint */}
          <div className="hidden md:flex gap-2 items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="flex gap-1">
              <Key>W</Key>
              <Key>A</Key>
              <Key>S</Key>
              <Key>D</Key>
            </div>
            <span className="text-white/40 text-xs ml-2">to move</span>
          </div>
        </div>
      </div>

      {/* Mobile controls hint */}
      <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2">
        <span className="text-white/30 text-xs">Tap to move</span>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 md:w-24 h-16 md:h-24 border-l-2 border-t-2 border-orange-500/30 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-3xl" />
      <div className="absolute bottom-12 left-0 w-16 md:w-24 h-16 md:h-24 border-l-2 border-b-2 border-purple-500/30 rounded-bl-3xl" />
      <div className="absolute bottom-12 right-0 w-16 md:w-24 h-16 md:h-24 border-r-2 border-b-2 border-orange-500/30 rounded-br-3xl" />
    </div>
  )
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white/10 border border-white/20 rounded text-white/60 text-xs md:text-sm font-bold"
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      {children}
    </span>
  )
}
