import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlayerProps {
  position: THREE.Vector3
  health: number
}

export function Player({ position, health }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.copy(position)
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.5
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Player body - basketball player silhouette */}
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 1, 8, 16]} />
        <meshStandardMaterial
          color="#ff5f1f"
          emissive="#ff5f1f"
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ffb38a"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Jersey number */}
      <mesh position={[0, 0.3, 0.42]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color="#ff5f1f"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Health indicator ring */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32, 1, 0, (health / 100) * Math.PI * 2]} />
        <meshBasicMaterial
          color={health > 50 ? '#00ff88' : health > 25 ? '#ffaa00' : '#ff3333'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shadow on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
