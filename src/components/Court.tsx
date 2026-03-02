import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Court() {
  const gridRef = useRef<THREE.GridHelper>(null!)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = -0.01
    }
  })

  return (
    <group>
      {/* Main court floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#1a0a2e"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Grid overlay */}
      <gridHelper
        ref={gridRef}
        args={[50, 50, '#3d1a66', '#2a0f4a']}
      />

      {/* Center court circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3, 3.2, 64]} />
        <meshBasicMaterial color="#ff5f1f" side={THREE.DoubleSide} />
      </mesh>

      {/* Inner center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial
          color="#2a0f4a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.15, 50]} />
        <meshBasicMaterial color="#ff5f1f" side={THREE.DoubleSide} />
      </mesh>

      {/* Three-point arcs */}
      <CourtArc position={[0, 0.02, 18]} />
      <CourtArc position={[0, 0.02, -18]} rotation={Math.PI} />

      {/* Basketball hoops */}
      <Hoop position={[0, 0, 22]} />
      <Hoop position={[0, 0, -22]} rotation={Math.PI} />

      {/* Corner markers */}
      <CornerGlow position={[-20, 0.1, -20]} />
      <CornerGlow position={[20, 0.1, -20]} />
      <CornerGlow position={[-20, 0.1, 20]} />
      <CornerGlow position={[20, 0.1, 20]} />

      {/* Ambient floor glow */}
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color="#8b00ff" distance={30} />
    </group>
  )
}

function CourtArc({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, rotation]}>
      <mesh>
        <torusGeometry args={[6, 0.08, 8, 32, Math.PI]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
    </group>
  )
}

function Hoop({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Backboard */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 3.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.05, 8, 32]} />
        <meshStandardMaterial color="#ff5f1f" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 2, 0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 4, 16]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Hoop glow */}
      <pointLight position={[0, 3.2, -0.5]} intensity={0.5} color="#ff5f1f" distance={5} />
    </group>
  )
}

function CornerGlow({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.2)
    }
  })

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
    </mesh>
  )
}
