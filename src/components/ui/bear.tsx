"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated, config } from "@react-spring/three"
import * as THREE from "three"

export function Bear() {
  const bearGroup = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Group>(null)
  const rightEyeRef = useRef<THREE.Group>(null)

  const [isPoked, setIsPoked] = useState(false)

  // Animation states using react-spring
  const { springScale, springRotation } = useSpring({
    springScale: isPoked ? 0.8 : 0.6,
    springRotation: isPoked ? [0.2, 0, 0] : [0, 0, 0],
    config: config.wobbly,
    onRest: () => {
      if (isPoked) setIsPoked(false)
    },
  })

  // Animation loop for subtle movement and eye tracking
  useFrame((state) => {
    if (bearGroup.current) {
      // Add very subtle floating animation
      bearGroup.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05

      // Blink animation
      if (leftEyeRef.current && rightEyeRef.current) {
        const blinkInterval = 3
        const time = state.clock.getElapsedTime()
        const blink = time % blinkInterval > blinkInterval - 0.15
        
        // When poked, eyes stay open and wide
        if (isPoked) {
          leftEyeRef.current.scale.y = 1.2
          rightEyeRef.current.scale.y = 1.2
        } else {
          leftEyeRef.current.scale.y = blink ? 0.1 : 1
          rightEyeRef.current.scale.y = blink ? 0.1 : 1
        }

        // Eye tracking
        const target = new THREE.Vector3(state.pointer.x * 2, state.pointer.y * 2, 2)
        leftEyeRef.current.lookAt(target)
        rightEyeRef.current.lookAt(target)
      }
    }
  })

  const handlePoke = () => {
    setIsPoked(true)
  }

  return (
    <animated.group
      ref={bearGroup}
      scale={springScale.to((s) => [s, s, s])}
      rotation={springRotation as any}
      onPointerDown={(e) => {
        e.stopPropagation()
        handlePoke()
      }}
    >
      {/* Bear Head */}
      <group position={[0, 0.8, 0]}>
        <mesh scale={[1.4, 1.1, 1.2]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#C19A6B" />
        </mesh>
      </group>

      {/* Bear Face */}
      <group position={[0, 0.8, 1.2]}>
        {/* Muzzle/Face background */}
        <mesh position={[0, -0.1, 0.2]}>
          <circleGeometry args={[0.8, 32]} />
          <meshStandardMaterial color="#F5E6D3" />
        </mesh>

        {/* Eyes - using spheres for better tracking */}
        <group ref={leftEyeRef} position={[-0.4, 0.2, 0.3]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          {/* Pupil highlight */}
          <mesh position={[0, 0, 0.18]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
        <group ref={rightEyeRef} position={[0.4, 0.2, 0.3]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          {/* Pupil highlight */}
          <mesh position={[0, 0, 0.18]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.1, 0.35]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Mouth - 3D and Reactive */}
        <group position={[0, -0.45, 0.25]}>
          <mesh scale={[1, isPoked ? 1.5 : 0.4, 0.2]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#000000" roughness={0.1} />
          </mesh>
          {/* Tongue/Inner Mouth when open */}
          {isPoked && (
            <mesh position={[0, -0.1, 0.1]} scale={[0.6, 0.4, 0.1]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#ff4d4d" />
            </mesh>
          )}
        </group>
      </group>

      {/* Ears */}
      <group position={[0, 1.6, -0.2]}>
        <mesh position={[-1.1, 0, 0]} scale={[1, 1.2, 1]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#C19A6B" />
        </mesh>
        <mesh position={[1.1, 0, 0]} scale={[1, 1.2, 1]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#C19A6B" />
        </mesh>
      </group>

      {/* Body - main */}
      <mesh position={[0, -1, 0]} scale={[0.9, 0.9, 0.9]}>
        <capsuleGeometry args={[1.1, 1.5, 32, 32]} />
        <meshStandardMaterial color="#C19A6B" />
      </mesh>

      {/* Belly */}
      <mesh position={[0, -1, 0.6]} scale={[0.9, 0.9, 0.9]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>

      {/* Arms */}
      <group position={[0, -0.7, 0]} scale={[0.9, 0.9, 0.9]}>
        <mesh position={[-1.3, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <capsuleGeometry args={[0.3, 0.8, 32, 32]} />
          <meshStandardMaterial color="#C19A6B" />
        </mesh>
        <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <capsuleGeometry args={[0.3, 0.8, 32, 32]} />
          <meshStandardMaterial color="#C19A6B" />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[0, -2.2, 0]} scale={[0.9, 0.9, 0.9]}>
        <group position={[-0.5, 0, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.25, 0.4, 32, 32]} />
            <meshStandardMaterial color="#C19A6B" />
          </mesh>
          <mesh position={[0, -0.4, 0.1]} rotation={[0.3, 0, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#C19A6B" />
          </mesh>
        </group>
        <group position={[0.5, 0, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.25, 0.4, 32, 32]} />
            <meshStandardMaterial color="#C19A6B" />
          </mesh>
          <mesh position={[0, -0.4, 0.1]} rotation={[0.3, 0, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#C19A6B" />
          </mesh>
        </group>
      </group>
    </animated.group>
  )
}
