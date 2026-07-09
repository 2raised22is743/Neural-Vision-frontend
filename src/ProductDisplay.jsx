import React, { useRef, useState, useMemo, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// Subcomponent to load texture dynamically inside Suspense with cursor parallax shift
function HolographicImage({ url, mouseRef }) {
  const texture = useLoader(THREE.TextureLoader, url);
  const imageMeshRef = useRef();
  
  // Set texture settings for best rendering
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  useFrame(() => {
    if (imageMeshRef.current && mouseRef?.current) {
      // Parallax shift offsets: texture shifts slightly in direction of cursor
      const targetX = mouseRef.current.x * 0.22;
      const targetY = mouseRef.current.y * 0.18;
      
      imageMeshRef.current.position.x += (targetX - imageMeshRef.current.position.x) * 0.1;
      imageMeshRef.current.position.y += (targetY - imageMeshRef.current.position.y) * 0.1;
      
      // Slight independent 3D rotation of the image plane
      imageMeshRef.current.rotation.y = imageMeshRef.current.position.x * 0.2;
      imageMeshRef.current.rotation.x = -imageMeshRef.current.position.y * 0.2;
    }
  });

  return (
    <mesh ref={imageMeshRef} position={[0, 0, 0.035]}>
      <planeGeometry args={[2.5, 1.9]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.88}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function ProductDisplay({ imageUrl, category, confidence, mouseRef, hoveredTag }) {
  const containerRef = useRef();
  const glowRef = useRef();
  
  // Interactivity states: scale/pop on click/hover + drag to spin in 3D
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);
  const posZRef = useRef(0);
  
  const isPointerDown = useRef(false);
  const prevPointerX = useRef(0);
  const dragRotationY = useRef(0);
  const smoothedMouse = useRef({ x: 0, y: 0 });

  // Dynamic targeting box calculations based on currently hovered feature
  const targetBoxPoints = useMemo(() => {
    if (!hoveredTag) return null;
    
    let xMin = -0.8, xMax = 0.8, yMin = -0.4, yMax = 0.4;
    const tag = hoveredTag.toLowerCase();
    
    if (tag === 'sneaker') {
      xMin = -0.9; xMax = 0.8; yMin = -0.6; yMax = 0.2;
    } else if (tag === 'shoe') {
      xMin = -1.1; xMax = 1.0; yMin = -0.7; yMax = 0.4;
    } else if (tag === 'laces' || tag === 'lace') {
      xMin = -0.3; xMax = 0.3; yMin = 0.1; yMax = 0.6;
    } else if (tag === 'sole') {
      xMin = -0.95; xMax = 0.85; yMin = -0.7; yMax = -0.35;
    }
    
    return [
      [xMin, yMin, 0.05], [xMax, yMin, 0.05],
      [xMax, yMax, 0.05], [xMin, yMax, 0.05],
      [xMin, yMin, 0.05]
    ];
  }, [hoveredTag]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smoothly interpolate scale and position Z on click or hover
    const targetScale = clicked ? 1.35 : (hovered ? 1.16 : 1.0);
    const targetPosZ = clicked ? 0.7 : (hovered ? 0.35 : 0.0);
    
    scaleRef.current += (targetScale - scaleRef.current) * 0.12;
    posZRef.current += (targetPosZ - posZRef.current) * 0.12;

    // Slow drift & levitation
    if (containerRef.current) {
      containerRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
      containerRef.current.position.z = posZRef.current;
      containerRef.current.position.y = Math.sin(t * 1.2) * 0.15;
      
      // Smooth out mouse cursor offsets to prevent instant tilt snaps
      if (mouseRef?.current) {
        smoothedMouse.current.x += (mouseRef.current.x - smoothedMouse.current.x) * 0.08;
        smoothedMouse.current.y += (mouseRef.current.y - smoothedMouse.current.y) * 0.08;
      }

      // Combine manual drag rotation offset with slow orbital drift & smoothed mouse parallax
      containerRef.current.rotation.y = dragRotationY.current + Math.sin(t * 0.4) * 0.08 + smoothedMouse.current.x * 0.16;
      containerRef.current.rotation.x = Math.cos(t * 0.3) * 0.04 + smoothedMouse.current.y * -0.08;
    }

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.opacity = (hovered ? 0.28 : 0.15) + Math.sin(t * 3.0) * 0.06;
    }
  });

  // Dynamic box bounds for decorative lines
  const framePoints = [
    [-1.4, 1.1, 0], [1.4, 1.1, 0],
    [1.4, -1.1, 0], [-1.4, -1.1, 0],
    [-1.4, 1.1, 0]
  ];

  // Dynamic bracket offset on hover
  const bracketOffset = hovered ? 0.08 : 0.0;

  return (
    <group
      ref={containerRef}
      scale={[scaleRef.current, scaleRef.current, scaleRef.current]}
      position={[0, 0, posZRef.current]}
      rotation={[0, dragRotationY.current, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(!clicked);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        isPointerDown.current = true;
        prevPointerX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        isPointerDown.current = false;
      }}
      onPointerLeave={() => {
        isPointerDown.current = false;
        setHovered(false);
      }}
      onPointerMove={(e) => {
        if (isPointerDown.current) {
          e.stopPropagation();
          const deltaX = e.clientX - prevPointerX.current;
          dragRotationY.current += deltaX * 0.008;
          prevPointerX.current = e.clientX;
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Glass Backplate (Premium Smoked Ice Glass Plate) */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[2.8, 2.2]} />
        <meshPhysicalMaterial
          color="#0a1215" // dark slate base
          roughness={0.08}
          metalness={0.9}
          transmission={0.7}
          thickness={1.6}
          ior={1.5}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Holographic Image Loader with Cursor Parallax */}
      {imageUrl && (
        <Suspense fallback={
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[2.6, 2.0]} />
            <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.3} />
          </mesh>
        }>
          <HolographicImage url={imageUrl} mouseRef={mouseRef} />
        </Suspense>
      )}

      {/* 3. Floating Holographic Ice Blue Border */}
      <Line
        points={framePoints}
        color="#3b82f6" // Cobalt Blue frame line
        lineWidth={1.5}
        transparent
        opacity={0.6}
      />

      {/* Outer corner brackets that expand outward when hovered */}
      <Line points={[[-1.5 - bracketOffset, 0.8, 0], [-1.5 - bracketOffset, 1.2 + bracketOffset, 0], [-1.1, 1.2 + bracketOffset, 0]]} color="#93c5fd" lineWidth={3} />
      <Line points={[[1.5 + bracketOffset, 0.8, 0], [1.5 + bracketOffset, 1.2 + bracketOffset, 0], [1.1, 1.2 + bracketOffset, 0]]} color="#93c5fd" lineWidth={3} />
      <Line points={[[-1.5 - bracketOffset, -0.8, 0], [-1.5 - bracketOffset, -1.2 - bracketOffset, 0], [-1.1, -1.2 - bracketOffset, 0]]} color="#93c5fd" lineWidth={3} />
      <Line points={[[1.5 + bracketOffset, -0.8, 0], [1.5 + bracketOffset, -1.2 - bracketOffset, 0], [1.1, -1.2 - bracketOffset, 0]]} color="#93c5fd" lineWidth={3} />

      {/* 4. Emissive Mesh Glow behind the panel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3.2, 2.6]} />
        <meshBasicMaterial
          ref={glowRef}
          color="#3b82f6"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4.5. Dynamic Computer Vision scan target outline */}
      {hoveredTag && targetBoxPoints && (
        <group position={[0, 0, 0.05]}>
          <Line
            points={targetBoxPoints}
            color="#ef4444" // Crimson Red targeting box
            lineWidth={2.2}
            transparent
            opacity={0.85}
          />
          <Text
            position={[targetBoxPoints[0][0], targetBoxPoints[2][1] + 0.08, 0.015]}
            fontSize={0.095}
            color="#fca5a5"
            font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFJVnZa3F2yCx2.woff"
            anchorX="left"
            anchorY="middle"
          >
            {`[ TARGET: ${hoveredTag.toUpperCase()} ]`}
          </Text>
        </group>
      )}

      {/* 5. Floating 3D Text Details */}
      {category && (
        <group position={[0, -1.5, 0.1]}>
          <Text
            fontSize={0.22}
            color="#ffffff"
            font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFJVnZa3F2yCx2.woff"
            anchorX="center"
            anchorY="middle"
          >
            {category.toUpperCase()}
          </Text>
          {confidence && (
            <Text
              position={[0, -0.25, 0]}
              fontSize={0.12}
              color="#93c5fd"
              font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFJVnZa3F2yCx2.woff"
              anchorX="center"
              anchorY="middle"
            >
              {`CONFIDENCE: ${Math.round(confidence * 100)}%`}
            </Text>
          )}
        </group>
      )}
    </group>
  );
}
