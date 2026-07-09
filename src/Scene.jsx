import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Torus, Box, Icosahedron, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import Particles from './Particles';
import ProductDisplay from './ProductDisplay';

export default function Scene({ scrollRef, mouseRef, result, loading, preview, hoveredTag }) {
  const { camera } = useThree();

  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const gridRef = useRef();
  const productGroupRef = useRef();
  
  const lightsRef = useRef([]);
  const smoothedMouse = useRef({ x: 0, y: 0 });

  // Generate 32 falling glass needles/shards that drop from the sky and recycle
  const fallingShards = useMemo(() => {
    const shards = [];
    for (let i = 0; i < 32; i++) {
      shards.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 24 - 2, // Distributed between Y = -14 and Y = 10
          (Math.random() - 0.5) * 4 - 2.5
        ),
        speed: Math.random() * 1.6 + 0.8,
        length: Math.random() * 0.9 + 0.3,
        rotSpeedX: Math.random() * 0.6 + 0.2,
        rotSpeedY: Math.random() * 0.6 + 0.2
      });
    }
    return shards;
  }, []);

  // Generate random positions for floating ice-glass shapes in Zone 2
  const floatingShapes = useMemo(() => {
    const shapes = [];
    for (let i = 0; i < 18; i++) {
      shapes.push({
        position: [
          (Math.random() - 0.5) * 12,
          -4 - Math.random() * 6, // Between Y = -4 and Y = -10
          (Math.random() - 0.5) * 6
        ],
        scale: Math.random() * 0.45 + 0.15,
        speed: Math.random() * 0.4 + 0.2,
        type: Math.random() > 0.6 ? 'box' : (Math.random() > 0.3 ? 'sphere' : 'icosahedron')
      });
    }
    return shapes;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef.current || 0;

    // ═══════════════════════════════════════════════════════════
    // 1. UPDATE FALLING SHARDS (Matrix rain effect)
    // ═══════════════════════════════════════════════════════════
    fallingShards.forEach((shard) => {
      shard.position.y -= delta * shard.speed * 2.2;
      // Loop back to top if fallen past the camera viewport
      if (shard.position.y < -17.0) {
        shard.position.y = 12.0;
        shard.position.x = (Math.random() - 0.5) * 14;
        shard.position.z = (Math.random() - 0.5) * 6;
      }
    });

    // ═══════════════════════════════════════════════════════════
    // 2. CAMERA RIG (Scroll & Mouse Interpolation)
    // ═══════════════════════════════════════════════════════════
    let targetX = 0;
    let targetY = THREE.MathUtils.lerp(0, -12.0, scroll);
    let targetZ = THREE.MathUtils.lerp(7.5, 4.8, scroll);
    let lookTarget = new THREE.Vector3(0, targetY, 0);

    // Smooth out mouse input coordinates to prevent camera jump/jitter
    if (mouseRef.current) {
      smoothedMouse.current.x += (mouseRef.current.x - smoothedMouse.current.x) * 0.08;
      smoothedMouse.current.y += (mouseRef.current.y - smoothedMouse.current.y) * 0.08;
    }

    // Add mouse parallax displacement to camera position using smoothed coordinates
    const mouseX = smoothedMouse.current.x * 0.6;
    const mouseY = smoothedMouse.current.y * 0.4;

    // Smooth Intro Fly-in over the first 2.4 seconds
    const introDuration = 2.4;
    if (t < introDuration) {
      const progress = t / introDuration;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      camera.position.x = THREE.MathUtils.lerp(0, targetX + mouseX, easeProgress);
      camera.position.y = THREE.MathUtils.lerp(14.0, targetY + mouseY, easeProgress);
      camera.position.z = THREE.MathUtils.lerp(2.5, targetZ, easeProgress);
      
      const introLook = new THREE.Vector3(0, 0, 0);
      const lookAtTarget = lookTarget.clone().lerp(introLook, 1.0 - easeProgress);
      camera.lookAt(lookAtTarget);
    } else {
      camera.position.x += (targetX + mouseX - camera.position.x) * 0.05;
      camera.position.y += (targetY + mouseY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      currentLook.lerp(lookTarget, 0.08);
      camera.lookAt(currentLook);
    }

    // ═══════════════════════════════════════════════════════════
    // 3. HERO CORE ROTATIONS
    // ═══════════════════════════════════════════════════════════
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.12;
      coreRef.current.rotation.z = t * 0.06;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.3;
      ring1Ref.current.rotation.y = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.25;
      ring2Ref.current.rotation.z = t * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.15;
      ring3Ref.current.rotation.z = -t * 0.35;
    }

    // ═══════════════════════════════════════════════════════════
    // 4. LIGHTING ANIMATIONS
    // ═══════════════════════════════════════════════════════════
    lightsRef.current.forEach((light, idx) => {
      if (light) {
        const offset = idx * Math.PI * 0.5;
        light.position.x = Math.sin(t * 0.5 + offset) * 4;
        light.position.z = Math.cos(t * 0.3 + offset) * 3;
      }
    });

    // ═══════════════════════════════════════════════════════════
    // 5. SCROLL PATTERNS (Grid rotation based on scroll)
    // ═══════════════════════════════════════════════════════════
    if (gridRef.current) {
      gridRef.current.rotation.y = scroll * Math.PI * 0.35;
    }

    // ═══════════════════════════════════════════════════════════
    // 6. DYNAMIC SLIDEOUT ON CLASSIFIED RESULT
    // ═══════════════════════════════════════════════════════════
    if (productGroupRef.current) {
      const isMobile = state.size.width < 768;
      const targetPos = (result && !isMobile) ? -1.65 : 0;
      productGroupRef.current.position.x += (targetPos - productGroupRef.current.position.x) * 0.08;
    }
  });

  return (
    <>
      {/* Volumetric Fog */}
      <fogExp2 attach="fog" color="#050608" density={0.045} />

      {/* Red, Blue, Green (RGB Spectrum) Point Lights */}
      <pointLight
        ref={(el) => (lightsRef.current[0] = el)}
        color="#ef4444" // Crimson Red
        intensity={5.0}
        distance={12}
        position={[0, 0, 3]}
      />
      <pointLight
        ref={(el) => (lightsRef.current[1] = el)}
        color="#3b82f6" // Cobalt Blue
        intensity={4.5}
        distance={12}
        position={[0, -6, 3]}
      />
      <pointLight
        ref={(el) => (lightsRef.current[2] = el)}
        color="#10b981" // Emerald Green
        intensity={4.0}
        distance={12}
        position={[0, -12, 3]}
      />
      
      {/* Soft Fill Lights */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* ═══════════════════════════════════════════════════════════
         PARTICLE FIELD (Increased to 6000 stars, handles shader colors)
         ═══════════════════════════════════════════════════════════ */}
      <Particles count={3000} scrollRef={scrollRef} mouseRef={mouseRef} />

      {/* ═══════════════════════════════════════════════════════════
         FALLING GLASS MATRIX NEEDLES (3D Rain effect)
         ═══════════════════════════════════════════════════════════ */}
      {fallingShards.map((shard, idx) => (
        <mesh
          key={`shard-${idx}`}
          position={shard.position}
          rotation={[idx * shard.rotSpeedX, idx * shard.rotSpeedY, 0]}
        >
          <cylinderGeometry args={[0.012, 0.012, shard.length, 5]} />
          <meshPhysicalMaterial
            color="#93c5fd" // soft blue refraction
            roughness={0.06}
            metalness={0.1}
            transmission={0.92}
            thickness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════════════════
         ZONE 1: HERO DEFORMING CORE (Y = 0)
         ═══════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0]}>
        {/* Holographic Containment Bounding Cage */}
        <Box args={[3.2, 3.2, 3.2]}>
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.08} />
        </Box>

        {/* Morphing Liquid Glass Sphere */}
        <Sphere ref={coreRef} args={[1.5, 64, 64]} castShadow>
          <MeshDistortMaterial
            color="#081015" // dark indigo base
            roughness={0.08}
            metalness={0.3}
            transmission={0.95}
            thickness={1.8}
            clearcoat={1.0}
            distort={0.38}
            speed={2.2}
          />
        </Sphere>

        {/* Emissive inner core light source */}
        <Sphere args={[0.25, 16, 16]}>
          <meshBasicMaterial color="#93c5fd" />
        </Sphere>

        {/* Tri-color Refractive Glass Halos */}
        <Torus ref={ring1Ref} args={[2.2, 0.03, 16, 100]}>
          <meshPhysicalMaterial color="#ef4444" roughness={0.1} transmission={0.9} thickness={0.5} transparent opacity={0.6} />
        </Torus>
        <Torus ref={ring2Ref} args={[2.6, 0.02, 16, 100]}>
          <meshPhysicalMaterial color="#3b82f6" roughness={0.15} transmission={0.95} thickness={0.3} transparent opacity={0.5} />
        </Torus>
        <Torus ref={ring3Ref} args={[3.0, 0.015, 16, 100]}>
          <meshPhysicalMaterial color="#10b981" roughness={0.2} transmission={0.9} thickness={0.2} transparent opacity={0.4} />
        </Torus>
      </group>

      {/* ═══════════════════════════════════════════════════════════
         ZONE 2: DRIFTING SCULPTURES & 3D ROTATING TUNNEL (Y = -6)
         ═══════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0]}>
        {/* Horizontal floor grid */}
        <gridHelper
          ref={gridRef}
          args={[30, 20, '#3b82f6', '#0f1217']}
          position={[0, -6.5, -2.5]}
          rotation={[0, 0, 0]}
        />

        {/* Interactive 3D Wireframe Tunnel Rings */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <Torus
            key={idx}
            args={[3.5, 0.012, 8, 64]}
            position={[0, -3.2 - idx * 0.9, -2.0]}
            rotation={[Math.PI / 2, 0, (scrollRef.current || 0) * Math.PI * 0.5 + idx * 0.25]}
          >
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.14 - idx * 0.015} />
          </Torus>
        ))}
        
        {/* Drifting ice-glass chunks */}
        {floatingShapes.map((shape, idx) => {
          let ShapeComponent;
          let shapeArgs;
          if (shape.type === 'box') {
            ShapeComponent = Box;
            shapeArgs = [1, 1, 1];
          } else if (shape.type === 'sphere') {
            ShapeComponent = Sphere;
            shapeArgs = [0.5, 32, 32];
          } else {
            ShapeComponent = Icosahedron;
            shapeArgs = [0.6];
          }

          return (
            <Float
              key={idx}
              speed={shape.speed * 2}
              rotationIntensity={1.8}
              floatIntensity={1.2}
              position={shape.position}
            >
              <ShapeComponent args={shapeArgs} scale={shape.scale}>
                <meshPhysicalMaterial
                  color="#93c5fd"
                  roughness={0.05}
                  metalness={0.1}
                  transmission={0.92}
                  thickness={0.8}
                  ior={1.45}
                  transparent
                  opacity={0.85}
                />
              </ShapeComponent>
            </Float>
          );
        })}
      </group>

      {/* ═══════════════════════════════════════════════════════════
         ZONE 3: HOLOGRAPHIC SCANNER & PRODUCT SHOWCASE (Y = -12)
         ═══════════════════════════════════════════════════════════ */}
      <group position={[0, -12, 0]}>
        {/* Scanner Base platform */}
        <group position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Torus args={[2.0, 0.03, 8, 64]}>
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} />
          </Torus>
          <Torus args={[1.2, 0.015, 8, 64]}>
            <meshBasicMaterial color="#ef4444" transparent opacity={0.15} />
          </Torus>
          <gridHelper args={[4, 8, '#3b82f6', '#0f1217']} position={[0, 0, 0.01]} />
        </group>

        {/* 3D Holographic Display Panel with Dynamic horizontal displacement */}
        <group ref={productGroupRef}>
          <ProductDisplay
            imageUrl={preview || result?.imageUrl}
            category={result?.category}
            confidence={result?.confidence}
            mouseRef={mouseRef}
            hoveredTag={hoveredTag}
          />
        </group>

        {/* If scanning/loading, display an active holographic scanner beam */}
        {loading && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.8, 1.8, 4.0, 32, 1, true]} />
            <meshBasicMaterial
              color="#93c5fd"
              transparent
              opacity={0.06}
              wireframe
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </>
  );
}
