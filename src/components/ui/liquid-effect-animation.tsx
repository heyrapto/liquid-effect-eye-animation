"use client"

import { useEffect, useRef, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { Bear } from "./bear"

interface LiquidEffectAnimationProps {
  backgroundColor?: string
  textColor?: string
}

export function LiquidEffectAnimation({
  backgroundColor = "#fafafa",
  textColor = "#1d1d1f",
}: LiquidEffectAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateTextImage = useCallback(() => {
    const dpr = window.devicePixelRatio || 1
    const offscreen = document.createElement("canvas")
    const w = window.innerWidth
    const h = window.innerHeight
    offscreen.width = w * dpr
    offscreen.height = h * dpr
    const ctx = offscreen.getContext("2d")
    if (!ctx) return null

    ctx.scale(dpr, dpr)

    // Background — clean white like Apple
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, w, h)

    // Soft ambient light — very subtle, gives liquid something to reflect
    ctx.globalCompositeOperation = "multiply"

    const glow1 = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.1, w * 0.6)
    glow1.addColorStop(0, "rgba(220, 225, 240, 0.6)")
    glow1.addColorStop(1, "rgba(250, 250, 250, 1)")
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, w, h)

    const glow2 = ctx.createRadialGradient(w * 0.5, h * 0.95, 0, w * 0.5, h * 0.95, w * 0.5)
    glow2.addColorStop(0, "rgba(240, 230, 220, 0.4)")
    glow2.addColorStop(1, "rgba(250, 250, 250, 1)")
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, w, h)

    ctx.globalCompositeOperation = "source-over"

    // Add very subtle noise to make liquid effect visible
    for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.02})`
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
    }

    return offscreen.toDataURL("image/png")
  }, [backgroundColor])

  useEffect(() => {
    if (!canvasRef.current) return

    const dataUrl = generateTextImage()
    if (!dataUrl) return

    const script = document.createElement("script")
    script.type = "module"
    script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.30/build/backgrounds/liquid1.min.js';

      const canvas = document.getElementById('liquid-canvas');
      if (canvas) {
        console.log('Initializing LiquidBackground...');
        const app = LiquidBackground(canvas);
        app.loadImage('${dataUrl}');
        app.liquidPlane.material.metalness = 0.35;
        app.liquidPlane.material.roughness = 0.45;
        app.liquidPlane.uniforms.displacementScale.value = 4; // Increased for visibility
        app.setRain(true); // Added rain to see if anything moves
        window.__liquidApp = app;
      }
    `
    document.body.appendChild(script)

    return () => {
      if (window.__liquidApp && window.__liquidApp.dispose) {
        window.__liquidApp.dispose()
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [generateTextImage])

  return (
    <div className="fixed inset-0 m-0 w-full h-full touch-none overflow-hidden">
      <canvas
        ref={canvasRef}
        id="liquid-canvas"
        className="fixed inset-0 w-full h-full"
      />
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 25 }}
          style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Bear />
        </Canvas>
      </div>
    </div>
  )
}


declare global {
  interface Window {
    __liquidApp?: any
  }
}
