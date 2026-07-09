import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Camera position controller that handles GSAP/state fly-throughs
const CameraController = ({ scene, mouseOffset }) => {
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const { camera } = state;

    // Define camera coordinates for different immersive environments
    switch (scene) {
      case 'intro': // Front face view of rotating geometric crystal
        targetPos.current.set(0, 0, 8);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'tunnel': // Close-up warp inside the crystal structure
        targetPos.current.set(0, 0, 0.5);
        targetLookAt.current.set(0, 0, -2);
        break;
      case 'workspace': // Panned back slightly, looking down at central floating glass bay
        targetPos.current.set(0, 1.2, 5.5);
        targetLookAt.current.set(0, 0, -1);
        break;
      case 'result': // Side view creating perspective depth for the telemetry dashboard
        targetPos.current.set(-1.8, 0.8, 4.5);
        targetLookAt.current.set(0.8, 0, 0);
        break;
      default:
        targetPos.current.set(0, 0, 8);
        targetLookAt.current.set(0, 0, 0);
    }

    // Add subtle mouse-parallax lag
    const parallaxX = mouseOffset.x * 1.5;
    const parallaxY = mouseOffset.y * 1.2;

    const currentTargetX = targetPos.current.x + parallaxX;
    const currentTargetY = targetPos.current.y + parallaxY;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, currentTargetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, currentTargetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPos.current.z, 0.04);

    // Damped lookAt transition
    const tempLookAt = new THREE.Vector3(
      THREE.MathUtils.lerp(camera.position.x, targetLookAt.current.x, 0.05),
      THREE.MathUtils.lerp(camera.position.y, targetLookAt.current.y, 0.05),
      THREE.MathUtils.lerp(camera.position.z, targetLookAt.current.z, 0.05)
    );
    camera.lookAt(tempLookAt);
  });

  return null;
};

// Crystal geometric sculpture at center
const CentralSculpture = ({ scene }) => {
  const meshRef = useRef(null);
  const rotationSpeed = useRef({ x: 0.003, y: 0.005 });

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.x += rotationSpeed.current.x;
    mesh.rotation.y += rotationSpeed.current.y;

    if (scene === 'tunnel') {
      // Explode and scale up crystal when camera zooms inside
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, 5, 0.03));
    } else if (scene === 'workspace' || scene === 'result') {
      // Push back and compress
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, 0.8, 0.05));
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, -1.8, 0.05); // Push down
    } else {
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, 1.2, 0.05));
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, 0, 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshPhysicalMaterial
        color="#2a2a35"
        roughness={0.05}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.8} // High transparency crystal glass
        thickness={1.5}
        ior={1.65}
      />
    </mesh>
  );
};

// Shards of crystal glass floating in space
const FloatingShards = ({ scene }) => {
  const shardsRef = useRef(null);
  const count = 35;

  const [positions, rotations, scales] = useMemo(() => {
    const pos = [];
    const rot = [];
    const sc = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ]);
      rot.push([
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ]);
      sc.push(Math.random() * 0.4 + 0.1);
    }
    return [pos, rot, sc];
  }, []);

  useFrame(() => {
    if (shardsRef.current) {
      shardsRef.current.rotation.y += 0.0008;
      shardsRef.current.rotation.x += 0.0004;
    }
  });

  return (
    <group ref={shardsRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={rotations[i]} scale={scales[i]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#d97706" // Warm amber glints in shards
            roughness={0.0}
            transmission={0.9}
            thickness={0.5}
            ior={1.5}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
};

// Space Warp Tunnel Rings
const TunnelRings = ({ scene }) => {
  const ringsRef = useRef([]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      
      // Floating motion
      ring.position.z = -i * 1.5 + (elapsed % 1.5);
      
      if (scene === 'intro') {
        ring.scale.setScalar(0.01); // Hide in intro
      } else if (scene === 'tunnel') {
        ring.scale.setScalar(THREE.MathUtils.lerp(ring.scale.x, 1.5, 0.04));
      } else {
        // Fade out/shrink
        ring.scale.setScalar(THREE.MathUtils.lerp(ring.scale.x, 0, 0.05));
      }
    });
  });

  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} ref={(el) => (ringsRef.current[i] = el)}>
          <torusGeometry args={[2.5, 0.015, 8, 48]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
};

// Ambient space dust particles
const DustParticles = () => {
  const pointsRef = useRef(null);
  const count = 300;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.015}
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

export const Core3D = ({ scene, mouseOffset }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.15} />
        {/* Warm amber keylight reflecting off crystals */}
        <pointLight position={[6, 6, 6]} intensity={2.0} color="#f59e0b" />
        <pointLight position={[-6, -6, -6]} intensity={0.4} color="#ffffff" />
        
        <CentralSculpture scene={scene} />
        <FloatingShards scene={scene} />
        <TunnelRings scene={scene} />
        <DustParticles />
        
        <CameraController scene={scene} mouseOffset={mouseOffset} />
      </Canvas>
    </div>
  );
};
export default Core3D;
