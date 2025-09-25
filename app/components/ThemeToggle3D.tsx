"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const getInitialBgColor = () => {
  if (typeof window === 'undefined') return "#050510";
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = !savedTheme || savedTheme === "dark";
  return prefersDark ? "#050510" : "#87ceeb";
};

interface ParticlesProps {
  isDark: boolean;
  mousePosition: { x: number; y: number };
}

function Particles({ isDark, mousePosition }: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = isDark ? 200 : 80;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Create a sphere distribution
      const radius = 3 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Colors
      if (isDark) {
        colors[i3] = 0.8 + Math.random() * 0.2; // R
        colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
        colors[i3 + 2] = 1; // B
      } else {
        colors[i3] = 1; // R
        colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
        colors[i3 + 2] = 0.2 + Math.random() * 0.3; // B
      }
    }

    return [positions, colors];
  }, [particleCount, isDark]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.2;
      
      // React to mouse position
      const targetX = mousePosition.x * 0.2;
      const targetY = -mousePosition.y * 0.2;
      meshRef.current.rotation.x += targetY * 0.1;
      meshRef.current.rotation.y += targetX * 0.1;
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
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.05 : 0.04}
        sizeAttenuation={true}
        transparent={true}
        opacity={isDark ? 0.9 : 0.6}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface CelestialBodyProps {
  isDark: boolean;
  isTransitioning: boolean;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

function CelestialBody({ isDark, isTransitioning, isHovered, mousePosition }: CelestialBodyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create sun material with emissive properties
  const sunMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffd700",
        emissive: "#ff8800",
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.4,
      }),
    []
  );

  // Create moon material with bumps
  const moonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e8e8e8",
        emissive: "#4444ff",
        emissiveIntensity: 0.1,
        metalness: 0.1,
        roughness: 0.9,
      }),
    []
  );

  useEffect(() => {
    if (meshRef.current) {
      // Animate the transition
      gsap.to(meshRef.current.scale, {
        x: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        y: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        z: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        duration: 0.3,
        ease: "power2.inOut",
      });

      // Rotate during transition
      if (isTransitioning) {
        gsap.to(meshRef.current.rotation, {
          y: meshRef.current.rotation.y + Math.PI * 2,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }
    }
  }, [isTransitioning, isHovered]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // React to mouse movement when hovered
      if (isHovered) {
        meshRef.current.position.x = mousePosition.x * 0.3;
        meshRef.current.position.y += mousePosition.y * 0.3;
      } else {
        meshRef.current.position.x *= 0.95; // Smoothly return to center
      }
      
      // Slow rotation
      if (!isTransitioning) {
        meshRef.current.rotation.y += 0.005;
      }
    }

    if (glowRef.current) {
      glowRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      if (isHovered) {
        glowRef.current.scale.setScalar(1.8);
      } else {
        glowRef.current.scale.setScalar(1.5);
      }
    }
  });

  return (
    <>
      {/* Main celestial body */}
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.3}
        floatingRange={[-0.1, 0.1]}
      >
        <mesh ref={meshRef} material={isDark ? moonMaterial : sunMaterial}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
      </Float>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={isDark ? "#6666ff" : "#ffaa00"}
          transparent={true}
          opacity={isHovered ? 0.2 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Additional glow layer */}
      <mesh scale={isHovered ? [2.5, 2.5, 2.5] : [2, 2, 2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={isDark ? "#4444ff" : "#ff8800"}
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

interface SceneProps {
  isDark: boolean;
  isTransitioning: boolean;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

function Scene({ isDark, isTransitioning, isHovered, mousePosition }: SceneProps) {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Set the scene background color immediately
    const targetColor = isDark ? "#050510" : "#87ceeb";
    scene.background = new THREE.Color(targetColor);
    
    // Also animate the parent element background for smooth transition
    if (gl.domElement.parentElement) {
      gl.domElement.parentElement.style.backgroundColor = targetColor;
    }
  }, [isDark, gl, scene]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      {/* Lighting */}
      <ambientLight intensity={isDark ? 0.1 : 0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 0.2 : 0.8}
        color={isDark ? "#9999ff" : "#ffffff"}
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={isDark ? 0.5 : 1.5}
        color={isDark ? "#8888ff" : "#ffdd00"}
      />

      {/* Celestial body (Sun/Moon) */}
      <CelestialBody 
        isDark={isDark} 
        isTransitioning={isTransitioning} 
        isHovered={isHovered}
        mousePosition={mousePosition}
      />
      
      {/* Particle system */}
      <Particles isDark={isDark} mousePosition={mousePosition} />
    </>
  );
}

interface ThemeToggle3DProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ThemeToggle3D({ isDarkMode, toggleTheme }: ThemeToggle3DProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLButtonElement>(null);
  const initialBgColor = getInitialBgColor();

  useEffect(() => {
    // Check if device might struggle with 3D
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 2 : false;
    
    if (isMobile || isLowEnd) {
      setShowCanvas(false);
    }
  }, []);

  const handleClick = () => {
    setIsTransitioning(true);
    toggleTheme();
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      setMousePosition({ x, y });
    }
  };

  // Fallback to simple toggle for mobile/low-end devices
  if (!showCanvas) {
    return (
      <div className="inline-block fadeIn">
        <button
          type="button"
          onClick={toggleTheme}
          className="relative w-16 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-indigo-600 dark:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-purple-600 shadow-lg transform transition-transform hover:scale-110"
          aria-label="Toggle theme"
        >
          <div
            className={`absolute top-1 transition-transform duration-500 ease-in-out ${
              isDarkMode ? "translate-x-8" : "translate-x-1"
            }`}
          >
            <div className="relative w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
              <svg
                className={`absolute w-4 h-4 transition-all duration-500 ${
                  isDarkMode ? "opacity-0 rotate-180 text-yellow-500" : "opacity-100 rotate-0 text-yellow-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
              
              <svg
                className={`absolute w-4 h-4 transition-all duration-500 ${
                  isDarkMode ? "opacity-100 rotate-0 text-indigo-500" : "opacity-0 -rotate-180 text-indigo-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="inline-block group">
      <button
        ref={containerRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-110 transform-origin-center"
        style={{ 
          backgroundColor: initialBgColor,
          boxShadow: isHovered 
            ? isDarkMode 
              ? "0 0 40px rgba(136, 136, 255, 0.5), 0 0 80px rgba(136, 136, 255, 0.2)" 
              : "0 0 40px rgba(255, 221, 0, 0.5), 0 0 80px rgba(255, 136, 0, 0.2)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: `2px solid ${isDarkMode ? "rgba(136, 136, 255, 0.3)" : "rgba(255, 221, 0, 0.3)"}`,
          transform: isHovered ? `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg) scale(1.1)` : "scale(1)",
        }}
        aria-label="Toggle theme"
      >
        {/* Animated border gradient */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isDarkMode 
              ? "conic-gradient(from 0deg, #4444ff, #8888ff, #aaaaff, #8888ff, #4444ff)"
              : "conic-gradient(from 0deg, #ffdd00, #ffaa00, #ff8800, #ffaa00, #ffdd00)",
            animation: isHovered ? "spin 3s linear infinite" : "none",
            padding: "2px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "exclude",
            maskComposite: "exclude",
          }}
        />
        
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ 
            width: "100%", 
            height: "100%",
            background: initialBgColor
          }}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance"
          }}
          onCreated={({ gl, scene }) => {
            // Set initial clear color and scene background immediately
            const color = new THREE.Color(initialBgColor);
            gl.setClearColor(color, 1);
            scene.background = color;
          }}
        >
          <Scene 
            isDark={isDarkMode} 
            isTransitioning={isTransitioning} 
            isHovered={isHovered}
            mousePosition={mousePosition}
          />
        </Canvas>
        
        {/* Subtle hint text */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-1 pointer-events-none">
          <span className={`text-[8px] font-bold tracking-wider animate-pulse ${
            isDarkMode ? "text-white/70" : "text-gray-700/80"
          }`}>
            {isDarkMode ? "NIGHT" : "DAY"}
          </span>
        </div>
      </button>
      
      {/* Add spinning animation to globals.css if needed */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}