import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { GameState, GameStats } from '../App'
import { Player } from './Player'
import { Enemy } from './Enemy'
import { Basketball } from './Basketball'
import { Court } from './Court'
import { ExpOrb } from './ExpOrb'

interface GameProps {
  gameState: GameState
  stats: GameStats
  onUpdateStats: (stats: Partial<GameStats>) => void
  onGameOver: () => void
}

interface EnemyData {
  id: string
  position: THREE.Vector3
  health: number
  maxHealth: number
  speed: number
}

interface ProjectileData {
  id: string
  position: THREE.Vector3
  velocity: THREE.Vector3
  damage: number
}

interface ExpOrbData {
  id: string
  position: THREE.Vector3
  value: number
}

export function Game({ gameState, stats, onUpdateStats, onGameOver }: GameProps) {
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0))
  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemies, setEnemies] = useState<EnemyData[]>([])
  const [projectiles, setProjectiles] = useState<ProjectileData[]>([])
  const [expOrbs, setExpOrbs] = useState<ExpOrbData[]>([])
  const [shootCooldown, setShootCooldown] = useState(0)

  const keys = useRef<Set<string>>(new Set())
  const lastSpawnTime = useRef(0)
  const gameTime = useRef(0)
  const { camera } = useThree()

  // Shooting rate based on level
  const shootInterval = useMemo(() => Math.max(0.15, 0.5 - stats.level * 0.03), [stats.level])
  const projectileCount = useMemo(() => Math.min(8, 1 + Math.floor(stats.level / 3)), [stats.level])
  const projectileDamage = useMemo(() => 10 + stats.level * 2, [stats.level])

  // Reset game state when starting
  useEffect(() => {
    if (gameState === 'playing') {
      setPlayerPosition(new THREE.Vector3(0, 0, 0))
      setPlayerHealth(100)
      setEnemies([])
      setProjectiles([])
      setExpOrbs([])
      gameTime.current = 0
      lastSpawnTime.current = 0
    }
  }, [gameState])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase())
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase())
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Touch/mouse controls
  const touchTarget = useRef<THREE.Vector3 | null>(null)

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (gameState !== 'playing') return
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const intersection = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersection)
      if (intersection) {
        touchTarget.current = intersection
      }
    }
    const handlePointerUp = () => {
      touchTarget.current = null
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [camera, gameState])

  // Find closest enemy for auto-aim
  const findClosestEnemy = useCallback((pos: THREE.Vector3): THREE.Vector3 | null => {
    let closest: THREE.Vector3 | null = null
    let minDist = Infinity
    for (const enemy of enemies) {
      const dist = pos.distanceTo(enemy.position)
      if (dist < minDist && dist < 30) {
        minDist = dist
        closest = enemy.position.clone()
      }
    }
    return closest
  }, [enemies])

  // Spawn enemies
  const spawnEnemy = useCallback(() => {
    const angle = Math.random() * Math.PI * 2
    const distance = 25 + Math.random() * 10
    const position = new THREE.Vector3(
      Math.cos(angle) * distance + playerPosition.x,
      0,
      Math.sin(angle) * distance + playerPosition.z
    )

    const baseHealth = 20 + stats.level * 5
    const speedMultiplier = 1 + stats.level * 0.1

    const newEnemy: EnemyData = {
      id: Math.random().toString(36),
      position,
      health: baseHealth,
      maxHealth: baseHealth,
      speed: (1.5 + Math.random() * 0.5) * speedMultiplier
    }

    setEnemies(prev => [...prev, newEnemy])
  }, [playerPosition, stats.level])

  // Game loop
  useFrame((_, delta) => {
    if (gameState !== 'playing') return

    gameTime.current += delta
    onUpdateStats({ time: Math.floor(gameTime.current) })

    // Player movement
    const speed = 8
    const movement = new THREE.Vector3()

    if (keys.current.has('w') || keys.current.has('arrowup')) movement.z -= 1
    if (keys.current.has('s') || keys.current.has('arrowdown')) movement.z += 1
    if (keys.current.has('a') || keys.current.has('arrowleft')) movement.x -= 1
    if (keys.current.has('d') || keys.current.has('arrowright')) movement.x += 1

    // Touch movement
    if (touchTarget.current) {
      const diff = touchTarget.current.clone().sub(playerPosition)
      if (diff.length() > 0.5) {
        movement.copy(diff.normalize())
      }
    }

    if (movement.length() > 0) {
      movement.normalize().multiplyScalar(speed * delta)
      const newPos = playerPosition.clone().add(movement)
      // Bound to arena
      newPos.x = Math.max(-20, Math.min(20, newPos.x))
      newPos.z = Math.max(-20, Math.min(20, newPos.z))
      setPlayerPosition(newPos)
    }

    // Camera follow
    camera.position.x = playerPosition.x
    camera.position.z = playerPosition.z + 20
    camera.lookAt(playerPosition.x, 0, playerPosition.z)

    // Auto-shooting
    setShootCooldown(prev => Math.max(0, prev - delta))
    if (shootCooldown <= 0 && enemies.length > 0) {
      const newProjectiles: ProjectileData[] = []

      for (let i = 0; i < projectileCount; i++) {
        const angleOffset = (i - (projectileCount - 1) / 2) * 0.3
        const closestEnemy = findClosestEnemy(playerPosition)

        let direction: THREE.Vector3
        if (closestEnemy) {
          direction = closestEnemy.sub(playerPosition).normalize()
        } else {
          direction = new THREE.Vector3(0, 0, -1)
        }

        // Rotate direction by offset
        const rotatedDir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angleOffset)

        newProjectiles.push({
          id: Math.random().toString(36),
          position: playerPosition.clone().add(new THREE.Vector3(0, 1, 0)),
          velocity: rotatedDir.multiplyScalar(25),
          damage: projectileDamage
        })
      }

      setProjectiles(prev => [...prev, ...newProjectiles])
      setShootCooldown(shootInterval)
    }

    // Update projectiles
    setProjectiles(prev => prev.map(p => ({
      ...p,
      position: p.position.clone().add(p.velocity.clone().multiplyScalar(delta))
    })).filter(p => p.position.length() < 50))

    // Spawn enemies
    const spawnInterval = Math.max(0.3, 2 - stats.level * 0.1)
    if (gameTime.current - lastSpawnTime.current > spawnInterval) {
      spawnEnemy()
      lastSpawnTime.current = gameTime.current
    }

    // Update enemies (move toward player)
    setEnemies(prev => prev.map(enemy => {
      const direction = playerPosition.clone().sub(enemy.position).normalize()
      const newPos = enemy.position.clone().add(direction.multiplyScalar(enemy.speed * delta))
      return { ...enemy, position: newPos }
    }))

    // Collision: projectiles vs enemies
    const projectilesToRemove = new Set<string>()
    const enemiesToRemove = new Set<string>()
    const newExpOrbs: ExpOrbData[] = []
    let killCount = 0
    let scoreGain = 0

    for (const projectile of projectiles) {
      for (const enemy of enemies) {
        if (projectile.position.distanceTo(enemy.position) < 1.5) {
          projectilesToRemove.add(projectile.id)
          enemy.health -= projectile.damage

          if (enemy.health <= 0) {
            enemiesToRemove.add(enemy.id)
            killCount++
            scoreGain += 10 * stats.level

            // Drop exp orbs
            const orbCount = 1 + Math.floor(Math.random() * 3)
            for (let i = 0; i < orbCount; i++) {
              newExpOrbs.push({
                id: Math.random().toString(36),
                position: enemy.position.clone().add(new THREE.Vector3(
                  (Math.random() - 0.5) * 2,
                  0.5,
                  (Math.random() - 0.5) * 2
                )),
                value: 1
              })
            }
          }
          break
        }
      }
    }

    if (projectilesToRemove.size > 0) {
      setProjectiles(prev => prev.filter(p => !projectilesToRemove.has(p.id)))
    }
    if (enemiesToRemove.size > 0) {
      setEnemies(prev => prev.filter(e => !enemiesToRemove.has(e.id)))
    }
    if (newExpOrbs.length > 0) {
      setExpOrbs(prev => [...prev, ...newExpOrbs])
    }
    if (killCount > 0) {
      onUpdateStats({
        kills: stats.kills + killCount,
        score: stats.score + scoreGain
      })
    }

    // Collect exp orbs
    const collectedOrbs = new Set<string>()
    let expGain = 0
    for (const orb of expOrbs) {
      if (playerPosition.distanceTo(orb.position) < 2) {
        collectedOrbs.add(orb.id)
        expGain += orb.value
      }
    }

    if (collectedOrbs.size > 0) {
      setExpOrbs(prev => prev.filter(o => !collectedOrbs.has(o.id)))

      let newExp = stats.exp + expGain
      let newLevel = stats.level
      let newExpToNext = stats.expToNext

      while (newExp >= newExpToNext) {
        newExp -= newExpToNext
        newLevel++
        newExpToNext = Math.floor(newExpToNext * 1.5)
      }

      onUpdateStats({
        exp: newExp,
        level: newLevel,
        expToNext: newExpToNext
      })
    }

    // Enemy collision with player
    for (const enemy of enemies) {
      if (playerPosition.distanceTo(enemy.position) < 1.2) {
        setPlayerHealth(prev => {
          const newHealth = prev - 20 * delta
          if (newHealth <= 0) {
            onGameOver()
          }
          return Math.max(0, newHealth)
        })
      }
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ff5f1f" />

      {/* Environment */}
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />

      {/* Court */}
      <Court />

      {/* Player */}
      <Player position={playerPosition} health={playerHealth} />

      {/* Enemies */}
      {enemies.map(enemy => (
        <Enemy
          key={enemy.id}
          position={enemy.position}
          health={enemy.health}
          maxHealth={enemy.maxHealth}
        />
      ))}

      {/* Projectiles (Basketballs) */}
      {projectiles.map(projectile => (
        <Basketball
          key={projectile.id}
          position={projectile.position}
        />
      ))}

      {/* Exp Orbs */}
      {expOrbs.map(orb => (
        <ExpOrb key={orb.id} position={orb.position} />
      ))}

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0612', 30, 60]} />
    </>
  )
}
