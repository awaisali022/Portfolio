import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Moving Particles Component
const ParticleField = () => {
  const ref = useRef();
  
  // Create coordinate array for 1200 floating points
  const [positions] = useState(() => {
    const coords = new Float32Array(1200 * 3);
    for (let i = 0; i < coords.length; i++) {
      coords[i] = (Math.random() - 0.5) * 12; // spread points in space
    }
    return coords;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#6366f1"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// Morphing glowing shape that reacts to mouse positions
const InteractiveBlob = () => {
  const meshRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse coordinates to [-1, 1] range
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly interpolate rotation and position towards mouse direction
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 1.5, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 1.5, 0.05);
    }
  });

  return (
    <Float speed={3.5} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2.2}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
};

const CanvasContainer = () => {
  const [webglSupported, setWebglSupported] = useState(true);

  // Perform a runtime verification of WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebglSupported(supported);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    // Elegant fallback background if WebGL is unavailable
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full opacity-65 dark:opacity-80"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
        <Suspense fallback={null}>
          <ParticleField />
          <InteractiveBlob />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CanvasContainer;
