'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, AdaptiveDpr } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';

interface ModelProps {
  url: string;
  onLoad: () => void;
}

function Model({ url, onLoad }: ModelProps) {
  const geometry = useLoader(STLLoader, url);
  
  useMemo(() => {
    if (geometry) {
        geometry.computeVertexNormals();
        geometry.center();
    }
  }, [geometry]);

  useEffect(() => {
    onLoad();
  }, [url, onLoad]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#007bff" roughness={0.5} metalness={0.1} />
    </mesh>
  );
}

interface ViewerProps {
  url: string | null;
  onLoadComplete: (duration: number) => void;
}

const Viewer = React.memo(({ url, onLoadComplete }: ViewerProps) => {
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (url) {
      startTime.current = performance.now();
    }
  }, [url]);

  const handleLoad = () => {
    const duration = performance.now() - startTime.current;
    onLoadComplete(duration);
  };

  if (!url) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f0f0f0',
        color: '#666'
      }}>
        No model selected
      </div>
    );
  }

  return (
    <Canvas 
      frameloop="demand"
      dpr={[1, 2]} 
      camera={{ position: [0, 0, 100], fov: 50 }}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
    >
      <AdaptiveDpr pixelated />
      <React.Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
            <Model url={url} onLoad={handleLoad} />
        </Stage>
      </React.Suspense>
      <OrbitControls 
        makeDefault 
        enableDamping={true}
        dampingFactor={0.1}
        rotateSpeed={0.8}
        zoomSpeed={0.8}
        panSpeed={0.8}
        regress={true}
      />
    </Canvas>
  );
});

Viewer.displayName = 'Viewer';

export default Viewer;
