import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  
  attribute float aSize;
  attribute float aSpeed;
  attribute vec3 aRandom;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec3 pos = position;

    // 1. Slow drift/orbital animation based on time and individual speed
    pos.x += sin(uTime * 0.1 * aSpeed + aRandom.x * 6.28) * 0.5;
    pos.y += cos(uTime * 0.15 * aSpeed + aRandom.y * 6.28) * 0.5;
    pos.z += sin(uTime * 0.08 * aSpeed + aRandom.z * 6.28) * 0.3;

    // 2. Scroll-driven vertical movement (infinite scrolling waterfall feel)
    pos.y -= uScroll * 15.0;
    // Wrap particles vertically so they reappear at the top
    pos.y = mod(pos.y + 15.0, 30.0) - 15.0;

    // 3. Mouse influence (subtle interactive push)
    // Convert uMouse (-1 to 1) to world scale (approximate screen size of view)
    vec3 mouseWorld = vec3(uMouse.x * 12.0, uMouse.y * 8.0, 0.0);
    float dist = distance(pos.xy, mouseWorld.xy);
    if (dist < 4.0) {
      float force = (1.0 - (dist / 4.0)) * uMouseStrength * 0.8;
      vec2 dir = normalize(pos.xy - mouseWorld.xy);
      pos.xy += dir * force;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation (smaller when further away)
    gl_PointSize = aSize * (300.0 / -mvPosition.z);

    // Color gradient based on coordinates and random offset
    vec3 colorA = vec3(0.95, 0.25, 0.25); // crimson red
    vec3 colorB = vec3(0.25, 0.55, 0.95); // cobalt blue
    vec3 colorC = vec3(0.25, 0.85, 0.45); // emerald green
    
    float mixFactor = sin(pos.x * 0.1 + pos.y * 0.1 + uTime * 0.1) * 0.5 + 0.5;
    vec3 color = mix(colorA, colorB, mixFactor);
    if (aRandom.x > 0.6) {
      color = mix(color, colorC, aRandom.y);
    }
    
    vColor = color;
    
    // Fade out particles near limits
    float fadeEdge = smoothstep(15.0, 10.0, abs(pos.y)) * smoothstep(15.0, 10.0, abs(pos.x));
    vOpacity = fadeEdge * (0.3 + 0.7 * sin(uTime * 0.5 * aSpeed + aRandom.z * 10.0) * 0.5 + 0.5);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    // Make circular particles with soft edges
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) {
      discard;
    }
    
    float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
    gl_FragColor = vec4(vColor, alpha * 0.6);
  }
`;

export default function Particles({ count = 1800, scrollRef, mouseRef }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  const { size, viewport } = useThree();

  const [positions, sizes, speeds, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sp = new Float32Array(count);
    const rnd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Wide volume distribution
      pos[i * 3 + 0] = (Math.random() - 0.5) * 30; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5; // Z

      sz[i] = Math.random() * 0.08 + 0.02;
      sp[i] = Math.random() * 0.8 + 0.2;

      rnd[i * 3 + 0] = Math.random();
      rnd[i * 3 + 1] = Math.random();
      rnd[i * 3 + 2] = Math.random();
    }

    return [pos, sz, sp, rnd];
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseStrength: { value: 0 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Update scroll uniform from ref
      if (scrollRef && scrollRef.current !== undefined) {
        // Interpolate/lerp scroll to make it super smooth in WebGL
        materialRef.current.uniforms.uScroll.value += (scrollRef.current - materialRef.current.uniforms.uScroll.value) * 0.08;
      }

      // Update mouse position from ref
      if (mouseRef && mouseRef.current) {
        const targetX = mouseRef.current.x;
        const targetY = mouseRef.current.y;
        
        materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.1;
        materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.1;
        
        // Calculate velocity or change to increase interactive push strength on movement
        materialRef.current.uniforms.uMouseStrength.value = 1.0;
      }
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          args={[speeds, 1]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
