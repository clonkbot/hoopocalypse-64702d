import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface EnemyProps {
  position: THREE.Vector3
  health: number
  maxHealth: number
}

export function Enemy({ position, health, maxHealth }: EnemyProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const wobbleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.copy(position)
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 4 + wobbleRef.current) * 0.1 + 0.3
      groupRef.current.rotation.y += 0.02
    }
  })

  const healthPercent = health / maxHealth
  const enemyColor = healthPercent > 0.5 ? '#8b00ff' : healthPercent > 0.25 ? '#ff00ff' : '#ff0066'

  return (
    <group ref={groupRef}>
      {/* Enemy body - opposing player */}
      <mesh castShadow>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={enemyColor}
          emissive={enemyColor}
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#440044"
          emissive="#660066"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Evil eyes */}
      <mesh position={[0.1, 0.85, 0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-0.1, 0.85, 0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Health bar background */}
      <mesh position={[0, 1.3, 0]}>
        <planeGeometry args={[1, 0.12]} />
        <meshBasicMaterial color="#220022" side={THREE.DoubleSide} />
      </mesh>

      {/* Health bar fill */}
      <mesh position={[(healthPercent - 1) * 0.5, 1.3, 0.01]}>
        <planeGeometry args={[healthPercent, 0.1]} />
        <meshBasicMaterial color={enemyColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Menacing aura */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#8b00ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
