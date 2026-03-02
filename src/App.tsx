import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { Game } from './components/Game'
import { HUD } from './components/HUD'
import { StartScreen } from './components/StartScreen'
import { GameOverScreen } from './components/GameOverScreen'

export type GameState = 'start' | 'playing' | 'gameover'

export interface GameStats {
  score: number
  level: number
  kills: number
  time: number
  exp: number
  expToNext: number
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    level: 1,
    kills: 0,
    time: 0,
    exp: 0,
    expToNext: 10
  })

  const handleStart = useCallback(() => {
    setStats({
      score: 0,
      level: 1,
      kills: 0,
      time: 0,
      exp: 0,
      expToNext: 10
    })
    setGameState('playing')
  }, [])

  const handleGameOver = useCallback(() => {
    setGameState('gameover')
  }, [])

  const handleUpdateStats = useCallback((newStats: Partial<GameStats>) => {
    setStats(prev => ({ ...prev, ...newStats }))
  }, [])

  return (
    <div className="w-screen h-screen bg-[#0a0612] overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#0a0612] to-[#0d1117] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,95,31,0.15)_0%,_transparent_70%)]" />
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 25, 20], fov: 50 }}
        shadows
        className="touch-none"
      >
        <Suspense fallback={null}>
          <Game
            gameState={gameState}
            stats={stats}
            onUpdateStats={handleUpdateStats}
            onGameOver={handleGameOver}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'playing' && <HUD stats={stats} />}
      {gameState === 'gameover' && <GameOverScreen stats={stats} onRestart={handleStart} />}

      {/* Footer */}
      <footer className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center z-20">
        <p className="text-[10px] md:text-xs text-white/30 font-light tracking-widest">
          Requested by <span className="text-orange-400/50">@ymassalski</span> · Built by <span className="text-cyan-400/50">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}

export default App
