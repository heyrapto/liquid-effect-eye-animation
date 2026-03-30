"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated, config } from "@react-spring/three"
import * as THREE from "three"

export function GuardianDog() {
  const dogGroup = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Group>(null)
  const rightEyeRef = useRef<THREE.Group>(null)
  const snoutRef = useRef<THREE.Group>(null)

  const [isPoked, setIsPoked] = useState(false)

  // Animation states using react-spring
  const { springScale, springRotation } = useSpring({
    springScale: isPoked ? [0.9, 0.7, 0.9] : [0.7, 0.7, 0.7],
    springRotation: isPoked ? [0.2, 0, 0.1] : [0, 0, 0],
    config: config.wobbly,
    onRest: () => {
      if (isPoked) setIsPoked(false)
    },
  })

  // Animation loop for floating and tracking
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (dogGroup.current) {
      // Floating animation
      // dogGroup.current.position.y = Math.sin(time * 0.5) * 0.15
      // dogGroup.current.rotation.z = Math.sin(time * 0.3) * 0.05
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      // Eye tracking
      const target = new THREE.Vector3(state.pointer.x * 2, state.pointer.y * 2, 5)
      leftEyeRef.current.lookAt(target)
      rightEyeRef.current.lookAt(target)

      // Blink animation
      const blinkInterval = 4
      const blink = (time % blinkInterval) > (blinkInterval - 0.15)
      if (!isPoked) {
        leftEyeRef.current.scale.y = blink ? 0.1 : 1
        rightEyeRef.current.scale.y = blink ? 0.1 : 1
      } else {
        leftEyeRef.current.scale.y = 1.3
        rightEyeRef.current.scale.y = 1.3
      }
    }
  })

  const handlePoke = () => {
    setIsPoked(true)
  }

  return (
    <animated.group
      ref={dogGroup}
      scale={springScale as any}
      rotation={springRotation as any}
      onPointerDown={(e) => {
        e.stopPropagation()
        handlePoke()
      }}
    >
      {/* Dog Head */}
      <group position={[0, 0.8, 0]}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#4A4A4A" roughness={0.6} />
        </mesh>

        {/* Snout */}
        <group position={[0, -0.2, 0.8]}>
          <mesh scale={[1.1, 0.8, 1]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          {/* Nose */}
          <mesh position={[0, 0.2, 0.5]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>

        {/* Ears */}
        <mesh position={[-0.8, 0.8, 0]} rotation={[0.2, 0, 0.5]}>
          <coneGeometry args={[0.3, 0.8, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0.8, 0.8, 0]} rotation={[0.2, 0, -0.5]}>
          <coneGeometry args={[0.3, 0.8, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Eyes */}
        <group ref={leftEyeRef} position={[-0.35, 0.3, 0.85]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.18]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.05, 0.05, 0.26]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
        <group ref={rightEyeRef} position={[0.35, 0.3, 0.85]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.18]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.05, 0.05, 0.26]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* Body */}
      <mesh position={[0, -0.8, -0.2]} scale={[1, 1.2, 1.1]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Red Collar with Gold Tag */}
      <group position={[0, -0.1, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.1, 0.1, 16, 32]} />
          <meshStandardMaterial color="#D32F2F" />
        </mesh>
        <mesh position={[0, -0.4, 1.1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Front Paws */}
      <mesh position={[-0.6, -1.8, 0.8]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.6, -1.8, 0.8]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Ground shadow (subtle fake shadow) */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.1} />
      </mesh>
    </animated.group>
  )
}
