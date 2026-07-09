import React from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

export default function Effects() {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0003, 0.0003)}
        radialModulation={false}
      />
      <Vignette
        eskil={false}
        offset={0.45}
        darkness={0.75}
      />
    </EffectComposer>
  );
}
