import React, { useRef, useMemo } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const meshRef = useRef(); // ✅ Fix: Reference for Decal

  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));

  // ✅ Fix: Ensure texture exists before applying anisotropy
  useMemo(() => {
    if (logoTexture) logoTexture.anisotropy = 16;
    if (fullTexture) fullTexture.anisotropy = 16;
  }, [logoTexture, fullTexture]);

  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        ref={meshRef} // ✅ Fix: Provide ref to the mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && fullTexture && (
          <Decal 
            mesh={meshRef.current} // ✅ Fix: Ensure Decal has a valid mesh
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && logoTexture && (
          <Decal 
            mesh={meshRef.current} // ✅ Fix: Ensure Decal has a valid mesh
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
