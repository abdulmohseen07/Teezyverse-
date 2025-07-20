import React, { useRef } from 'react';
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';

const Backdrop = () => {
  const shadows = useRef();

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}  // Smooth shadow transition
      alphaTest={0.9}  // Keeps shadows soft
      scale={15}  // Balanced shadow coverage
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.2]}  // Slightly lifted for a natural effect
    >
      <RandomizedLight 
        amount={4}  // Not too many lights (keeps shadows moderate)
        radius={10} // Light spread for softer shadows
        intensity={0.5}  // Moderate brightness
        ambient={0.4}  // Balanced ambient light
        position={[6, 6, -12]}
      />
      <RandomizedLight 
        amount={4}
        radius={8}  
        intensity={0.4}  // Softer lighting
        ambient={0.5}
        position={[-6, 6, -10]}
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;
