"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated, config } from "@react-spring/three"
import * as THREE from "three"

export function Sentinel() {
  const sentinelGroup = useRef<THREE.Group>(null)
  const visorRef = useRef<THREE.Mesh>(null)
  const shieldRef = useRef<THREE.Mesh>(null)

  const [isPoked, setIsPoked] = useState(false)

  // Animation states using react-spring
  const { springScale, springColor, springGlow } = useSpring({
    springScale: isPoked ? 1.5 : 1,
    springColor: isPoked ? "#ff0044" : "#00f2ff",
    springGlow: isPoked ? 4 : 1.5,
    config: config.wobbly,
    onRest: () => {
      if (isPoked) setIsPoked(false)
    },
  })

  // Animation loop for floating and tracking
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (sentinelGroup.current) {
      // Floating animation
      sentinelGroup.current.position.y = Math.sin(time * 0.7) * 0.25
      sentinelGroup.current.rotation.y = Math.sin(time * 0.3) * 0.1
    }

    if (visorRef.current) {
      // Visor tracking
      const targetX = state.pointer.x * 1.5
      const targetY = state.pointer.y * 1.5
      visorRef.current.position.x = THREE.MathUtils.lerp(visorRef.current.position.x, targetX * 0.2, 0.1)
      visorRef.current.position.y = THREE.MathUtils.lerp(visorRef.current.position.y, targetY * 0.2, 0.1)
    }

    if (shieldRef.current) {
      // Shield movement
      shieldRef.current.rotation.z = time * 0.2
      shieldRef.current.position.z = 1.8 + Math.sin(time * 2) * 0.1
    }
  })

  const handlePoke = () => {
    setIsPoked(true)
  }

  return (
    <animated.group
      ref={sentinelGroup}
      scale={springScale.to((s) => [s, s, s])}
      onPointerDown={(e) => {
        e.stopPropagation()
        handlePoke()
      }}
    >
      {/* Sentinel Head/Body */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Visor Area */}
      <mesh position={[0, 0, 0.8]}>
        <boxGeometry args={[1.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Visor Light (Tracking) */}
      <mesh ref={visorRef} position={[0, 0, 0.91]}>
        <planeGeometry args={[0.8, 0.15]} />
        <animated.meshStandardMaterial
          color={springColor}
          emissive={springColor}
          emissiveIntensity={springGlow}
        />
      </mesh>

      {/* Side Antennas */}
      <mesh position={[-1.1, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color="#333333" metalness={1} />
      </mesh>
      <mesh position={[1.1, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color="#333333" metalness={1} />
      </mesh>

      {/* Floating Hexagonal Shield */}
      <mesh ref={shieldRef} position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.05, 6]} />
        <meshStandardMaterial
          color="#00f2ff"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Shield Core */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 6]} />
        <animated.meshStandardMaterial
          color={springColor}
          emissive={springColor}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Data pulses around the sentinel */}
      <points>
        <sphereGeometry args={[3, 16, 16]} />
        <pointsMaterial color="#00f2ff" size={0.03} transparent opacity={0.3} />
      </points>
    </animated.group>
  )
}
