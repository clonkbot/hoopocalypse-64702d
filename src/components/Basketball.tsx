import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BasketballProps {
  position: THREE.Vector3
}

export function Basketball({ position }: BasketballProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.copy(position)
      meshRef.current.rotation.x += delta * 15
      meshRef.current.rotation.z += delta * 10
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        {/* Basketball sphere */}
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#ff5f1f"
          emissive="#ff5f1f"
          emissiveIntensity={0.8}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Basketball lines - horizontal */}
      <mesh position={position}>
        <torusGeometry args={[0.35, 0.02, 8, 32]} />
        <meshBasicMaterial color="#1a0800" />
      </mesh>

      {/* Glow trail */}
      <mesh position={position}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#ff5f1f"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light for dramatic effect */}
      <pointLight
        position={[position.x, position.y, position.z]}
        intensity={0.5}
        distance={3}
        color="#ff5f1f"
      />
    </group>
  )
}
