"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated, config } from "@react-spring/three"
import * as THREE from "three"

export function SecurityEye() {
  const eyeGroup = useRef<THREE.Group>(null)
  const irisRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  const [isPoked, setIsPoked] = useState(false)

  // Animation states using react-spring
  const { springScale, springColor, springGlow } = useSpring({
    springScale: isPoked ? 1.4 : 1,
    springColor: isPoked ? "#ff3333" : "#3399ff",
    springGlow: isPoked ? 2 : 1,
    config: config.stiff,
    onRest: () => {
      if (isPoked) setIsPoked(false)
    },
  })

  // Animation loop for floating and eye tracking
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (eyeGroup.current) {
      // Floating animation
      eyeGroup.current.position.y = Math.sin(time * 0.5) * 0.2
      eyeGroup.current.position.x = Math.cos(time * 0.3) * 0.1
      
      // Rotate the group slightly based on mouse
      eyeGroup.current.rotation.x = THREE.MathUtils.lerp(eyeGroup.current.rotation.x, state.pointer.y * 0.2, 0.1)
      eyeGroup.current.rotation.y = THREE.MathUtils.lerp(eyeGroup.current.rotation.y, state.pointer.x * 0.2, 0.1)
    }

    if (irisRef.current) {
      // Iris tracking (lookAt)
      const target = new THREE.Vector3(state.pointer.x * 5, state.pointer.y * 5, 5)
      irisRef.current.lookAt(target)
    }

    if (ringRef.current) {
      // Continuous ring rotation
      ringRef.current.rotation.z = time * 0.5
      ringRef.current.rotation.y = time * 0.2
    }
  })

  const handlePoke = () => {
    setIsPoked(true)
  }

  return (
    <animated.group
      ref={eyeGroup}
      scale={springScale.to((s) => [s, s, s])}
      onPointerDown={(e) => {
        e.stopPropagation()
        handlePoke()
      }}
    >
      {/* Outer Glow Sphere (Subtle) */}
      <mesh scale={[2.2, 2.2, 2.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#3399ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Eye Ball */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.8}
          envMapIntensity={1}
        />
      </mesh>

      {/* Iris & Pupil System */}
      <group ref={irisRef}>
        <mesh position={[0, 0, 0.95]}>
          <circleGeometry args={[0.45, 32]} />
          <animated.meshStandardMaterial
            color={springColor}
            emissive={springColor}
            emissiveIntensity={springGlow}
          />
        </mesh>
        <mesh position={[0, 0, 0.96]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Scanning lines / detail */}
        <mesh position={[0, 0, 0.97]}>
          <ringGeometry args={[0.4, 0.42, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Rotating Digital Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <animated.meshStandardMaterial
          color={springColor}
          emissive={springColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Secondary Orbiting Ring */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.8, 0.01, 8, 100]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.3} />
      </mesh>

      {/* Floating data particles (points) */}
      <points>
        <sphereGeometry args={[2.5, 10, 10]} />
        <pointsMaterial color="#3399ff" size={0.02} transparent opacity={0.4} />
      </points>
    </animated.group>
  )
}
