import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Torus, Box, Icosahedron, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import Particles from './Particles';
import ProductDisplay from './ProductDisplay';

/**
 * Highly stylized low-poly holographic objects.
 * Renders carrots, pizza slices, umbrellas, cars, chocolates, phones, and laptops.
 */
function CosmicObject({ type, color = "#93c5fd" }) {
  const materialProps = {
    color: color,
    roughness: 0.15,
    metalness: 0.25,
    transmission: 0.86,
    thickness: 1.0,
    ior: 1.4,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  };

  if (type === 'laptop') {
    return (
      <group>
        <mesh><boxGeometry args={[1.0, 0.04, 0.7]} /><meshPhysicalMaterial {...materialProps} /></mesh>
        <mesh position={[0, 0.35, -0.32]} rotation={[0.4, 0, 0]}><boxGeometry args={[1.0, 0.7, 0.04]} /><meshPhysicalMaterial {...materialProps} /></mesh>
      </group>
    );
  }
  if (type === 'pizza') {
    return (
      <group>
        <mesh><cylinderGeometry args={[0.55, 0.55, 0.08, 8]} /><meshPhysicalMaterial {...materialProps} color="#f59e0b" /></mesh>
        <mesh position={[0.15, 0.05, 0.15]}><cylinderGeometry args={[0.08, 0.08, 0.02, 6]} /><meshBasicMaterial color="#ef4444" /></mesh>
        <mesh position={[-0.15, 0.05, -0.1]}><cylinderGeometry args={[0.08, 0.08, 0.02, 6]} /><meshBasicMaterial color="#ef4444" /></mesh>
      </group>
    );
  }
  if (type === 'phone') {
    return (
      <group>
        <mesh><boxGeometry args={[0.45, 0.9, 0.06]} /><meshPhysicalMaterial {...materialProps} /></mesh>
      </group>
    );
  }
  if (type === 'car') {
    return (
      <group>
        <mesh><boxGeometry args={[1.2, 0.28, 0.55]} /><meshPhysicalMaterial {...materialProps} /></mesh>
        <mesh position={[-0.05, 0.26, 0]}><boxGeometry args={[0.65, 0.28, 0.45]} /><meshPhysicalMaterial {...materialProps} /></mesh>
        {/* Wheels */}
        <mesh position={[-0.35, -0.15, 0.25]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.15, 0.15, 0.1, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[0.35, -0.15, 0.25]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.15, 0.15, 0.1, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>
    );
  }
  if (type === 'umbrella') {
    return (
      <group>
        <mesh position={[0, 0.2, 0]}><coneGeometry args={[0.6, 0.45, 8]} /><meshPhysicalMaterial {...materialProps} color="#ec4899" /></mesh>
        <mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.02, 0.02, 0.5]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>
    );
  }
  if (type === 'vegetable') {
    return (
      <group>
        <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.18, 0.7, 6]} /><meshPhysicalMaterial {...materialProps} color="#f97316" /></mesh>
      </group>
    );
  }
  if (type === 'chocolate') {
    return (
      <group>
        <mesh><boxGeometry args={[0.7, 0.14, 0.45]} /><meshPhysicalMaterial {...materialProps} color="#78350f" /></mesh>
      </group>
    );
  }

  return (
    <mesh><icosahedronGeometry args={[0.5]} /><meshPhysicalMaterial {...materialProps} /></mesh>
  );
}

export default function Scene({ scrollRef, mouseRef, result, loading, preview, hoveredTag }) {
  const { camera } = useThree();

  const coreRef = useRef();
  const coreGroupRef = useRef();
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

  // Generate random positions and types for cosmic drifting items (increased scale for visibility)
  const floatingShapes = useMemo(() => {
    const types = ['car', 'vegetable', 'laptop', 'pizza', 'umbrella', 'phone', 'chocolate'];
    const shapes = [];
    for (let i = 0; i < 36; i++) {
      shapes.push({
        position: [
          (Math.random() - 0.5) * 16,
          -1 - Math.random() * 11, // Between Y = -1 and Y = -12
          (Math.random() - 0.5) * 10 // Widen Z bounds to cross camera path
        ],
        scale: Math.random() * 0.45 + 0.35,
        speed: Math.random() * 0.5 + 0.2,
        type: types[i % types.length]
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
    // Curved S-flight path: camera orbits core coordinates on scroll
    let targetX = Math.sin(scroll * Math.PI) * 2.2;
    let targetY = THREE.MathUtils.lerp(0, -12.0, scroll);
    let targetZ = THREE.MathUtils.lerp(7.5, 4.8, scroll);
    let lookTarget = new THREE.Vector3(
      Math.sin(scroll * Math.PI) * 0.8,
      targetY,
      0
    );

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

      // Spin Core rapidly and scale up on mount (Intro roll-in animation)
      if (coreGroupRef.current) {
        coreGroupRef.current.rotation.y = t * 6.0;
        coreGroupRef.current.rotation.z = t * 3.0;
        coreGroupRef.current.scale.setScalar(easeProgress);
      }
    } else {
      camera.position.x += (targetX + mouseX - camera.position.x) * 0.05;
      camera.position.y += (targetY + mouseY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      currentLook.lerp(lookTarget, 0.08);
      camera.lookAt(currentLook);
    }

    // Interpolate Core position and scale based on scroll progress & results view state
    let targetCoreX = 1.8;
    let targetCoreY = 0;
    let targetCoreZ = 0;

    if (scroll < 0.5) {
      // Zone 1 to Zone 2: drifts from right to left [1.8, 0, 0] -> [-2.0, -4.0, -2]
      const scrollPct = scroll / 0.5;
      targetCoreX = THREE.MathUtils.lerp(1.8, -2.0, scrollPct);
      targetCoreY = THREE.MathUtils.lerp(0, -4.0, scrollPct);
      targetCoreZ = THREE.MathUtils.lerp(0, -2.0, scrollPct);
    } else {
      // Zone 2 to Zone 3: drifts from left to behind upload card [-2.0, -4.0, -2] -> [0.0, -12.0, -4]
      const scrollPct = (scroll - 0.5) / 0.5;
      targetCoreX = THREE.MathUtils.lerp(-2.0, 0.0, scrollPct);
      targetCoreY = THREE.MathUtils.lerp(-4.0, -12.0, scrollPct);
      targetCoreZ = THREE.MathUtils.lerp(-2.0, -4.0, scrollPct);
    }

    if (coreGroupRef.current) {
      coreGroupRef.current.position.x += (targetCoreX - coreGroupRef.current.position.x) * 0.08;
      coreGroupRef.current.position.y += (targetCoreY - coreGroupRef.current.position.y) * 0.08;
      coreGroupRef.current.position.z += (targetCoreZ - coreGroupRef.current.position.z) * 0.08;

      // Shrink core when result screen is active to prevent overlapping visual clutter
      const targetScale = result ? 0.001 : 1.0;
      coreGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(coreGroupRef.current.scale.x, targetScale, 0.1)
      );
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

      {/* Cosmic Violet, Blue, Cyan Point Lights */}
      <pointLight
        ref={(el) => (lightsRef.current[0] = el)}
        color="#8b5cf6" // Cosmic Violet
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
        color="#06b6d4" // Cosmic Cyan
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

      {/* ONLY RENDER LANDING SCENE GEOMETRIES IF NO RESULT ACTIVE */}
      {!result && (
        <>
          {/* ═══════════════════════════════════════════════════════════
             ZONE 1: HERO DEFORMING CORE (Y = 0)
             ═══════════════════════════════════════════════════════════ */}
          <group ref={coreGroupRef} position={[1.8, 0, 0]}>
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

            {/* Tri-color Refractive Glass Halos (Cosmic Palette) */}
            <Torus ref={ring1Ref} args={[2.2, 0.03, 16, 100]}>
              <meshPhysicalMaterial color="#8b5cf6" roughness={0.1} transmission={0.9} thickness={0.5} transparent opacity={0.6} />
            </Torus>
            <Torus ref={ring2Ref} args={[2.6, 0.02, 16, 100]}>
              <meshPhysicalMaterial color="#3b82f6" roughness={0.15} transmission={0.95} thickness={0.3} transparent opacity={0.5} />
            </Torus>
            <Torus ref={ring3Ref} args={[3.0, 0.015, 16, 100]}>
              <meshPhysicalMaterial color="#06b6d4" roughness={0.2} transmission={0.9} thickness={0.2} transparent opacity={0.4} />
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
            
            {/* Drifting space items (low poly pizzas, laptops, cars, etc.) */}
            {floatingShapes.map((shape, idx) => {
              return (
                <Float
                  key={idx}
                  speed={shape.speed * 2}
                  rotationIntensity={1.8}
                  floatIntensity={1.2}
                  position={shape.position}
                >
                  <group scale={shape.scale}>
                    <CosmicObject
                      type={shape.type}
                      color={idx % 3 === 0 ? "#8b5cf6" : (idx % 3 === 1 ? "#3b82f6" : "#06b6d4")}
                    />
                  </group>
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
      )}
    </>
  );
}
