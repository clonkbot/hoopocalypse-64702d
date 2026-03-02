import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ExpOrbProps {
  position: THREE.Vector3
}

export function ExpOrb({ position }: ExpOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const startY = useRef(position.y)
  const phase = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = position.x
      meshRef.current.position.z = position.z
      meshRef.current.position.y = startY.current + Math.sin(state.clock.elapsedTime * 4 + phase.current) * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 3
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        {/* Diamond-shaped exp orb */}
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner glow */}
      <pointLight
        position={[position.x, position.y + 0.5, position.z]}
        intensity={0.3}
        distance={2}
        color="#00ff88"
      />
    </group>
  )
}
