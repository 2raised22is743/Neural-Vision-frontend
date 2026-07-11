import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ScannerBeam Component
 * Renders a glowing, animated horizontal laser scanning plane
 * that continuously sweeps up and down in 3D space.
 */
export default function ScannerBeam({ active = true, speed = 1.6, range = 1.8 }) {
  const beamRef = useRef();

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();
    if (beamRef.current) {
      // Sweeps smoothly between -range and +range on the Y-axis
      beamRef.current.position.y = Math.sin(t * speed) * range;
    }
  });

  return (
    <group ref={beamRef}>
      {/* Primary Laser Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
        <planeGeometry args={[3.8, 0.03]} />
        <meshBasicMaterial
          color="#3b82f6" // Neon Cobalt Blue laser line
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Volumetric Scan Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
        <planeGeometry args={[3.8, 0.18]} />
        <meshBasicMaterial
          color="#8b5cf6" // Purple volumetric spread
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
