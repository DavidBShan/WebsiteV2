"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const getInitialBgColor = () => {
  if (typeof window === "undefined") return "#87ceeb";
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = savedTheme === "dark";
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
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.01) * 0.2;

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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
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

// Sun component with corona effect
function Sun({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const [coronaGeometry] = useState(() => new THREE.IcosahedronGeometry(0.98, 12));
  
  // Create corona noise effect
  useEffect(() => {
    if (coronaGeometry) {
      const positions = coronaGeometry.attributes.position as THREE.BufferAttribute;
      positions.usage = THREE.DynamicDrawUsage;
    }
  }, [coronaGeometry]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -state.clock.elapsedTime * 0.1;
    }
    
    if (coronaRef.current && coronaGeometry) {
      const positions = coronaGeometry.attributes.position;
      const len = positions.count;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < len; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        const noise = Math.sin(x * 3 + time) * Math.cos(y * 3 + time) * Math.sin(z * 3 + time);
        const scale = 1 + noise * 0.08;
        
        const length = Math.sqrt(x * x + y * y + z * z);
        positions.setXYZ(
          i,
          (x / length) * scale,
          (y / length) * scale,
          (z / length) * scale
        );
      }
      positions.needsUpdate = true;
    }
    
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Main sun body */}
      <mesh ref={sunMeshRef}>
        <icosahedronGeometry args={[1, 12]} />
        <meshBasicMaterial 
          color="#ffd700"
        />
      </mesh>
      
      {/* Sun rim effect */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <icosahedronGeometry args={[1, 12]} />
        <shaderMaterial
          uniforms={{
            color1: { value: new THREE.Color(0xffff99) },
            color2: { value: new THREE.Color(0x000000) },
            fresnelBias: { value: 0.2 },
            fresnelScale: { value: 1.5 },
            fresnelPower: { value: 4.0 },
          }}
          vertexShader={`
            uniform float fresnelBias;
            uniform float fresnelScale;
            uniform float fresnelPower;
            varying float vReflectionFactor;
            
            void main() {
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
              vec3 I = worldPosition.xyz - cameraPosition;
              vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 color1;
            uniform vec3 color2;
            varying float vReflectionFactor;
            
            void main() {
              float f = clamp(vReflectionFactor, 0.0, 1.0);
              gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
            }
          `}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Corona (pulsing effect) */}
      <mesh ref={coronaRef} geometry={coronaGeometry}>
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={isHovered ? [1.15, 1.15, 1.15] : [1.1, 1.1, 1.1]}>
        <icosahedronGeometry args={[1, 12]} />
        <shaderMaterial
          uniforms={{
            color1: { value: new THREE.Color(0x000000) },
            color2: { value: new THREE.Color(0xff0000) },
            fresnelBias: { value: 0.2 },
            fresnelScale: { value: 1.5 },
            fresnelPower: { value: 4.0 },
          }}
          vertexShader={`
            uniform float fresnelBias;
            uniform float fresnelScale;
            uniform float fresnelPower;
            varying float vReflectionFactor;
            
            void main() {
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
              vec3 I = worldPosition.xyz - cameraPosition;
              vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 color1;
            uniform vec3 color2;
            varying float vReflectionFactor;
            
            void main() {
              float f = clamp(vReflectionFactor, 0.0, 1.0);
              gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
            }
          `}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Point light from sun */}
      <pointLight
        color="#ffff99"
        intensity={2}
        distance={10}
        decay={2}
      />
    </group>
  );
}

// Moon component with craters
function Moon({ isHovered }: { isHovered: boolean }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const [moonGeometry] = useState(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 16);
    const positions = geometry.attributes.position;
    const len = positions.count;
    
    // Create multiple crater-like deformations for realistic lunar surface
    for (let i = 0; i < len; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Normalize to get surface position
      const length = Math.sqrt(x * x + y * y + z * z);
      const nx = x / length;
      const ny = y / length;
      const nz = z / length;
      
      // Add surface noise for roughness
      const noise = 
        Math.sin(nx * 15) * Math.cos(ny * 15) * Math.sin(nz * 15) * 0.02 +
        Math.sin(nx * 30) * Math.cos(ny * 30) * Math.sin(nz * 30) * 0.01;
      
      // Create multiple crater depressions of varying sizes
      let craterDepth = 0;
      
      // Large craters
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.5) ** 2 + (ny - 0.3) ** 2 + (nz - 0.1) ** 2) * 4) * 0.12;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.4) ** 2 + (ny + 0.2) ** 2 + (nz - 0.3) ** 2) * 5) * 0.1;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.1) ** 2 + (ny - 0.6) ** 2 + (nz + 0.2) ** 2) * 5) * 0.08;
      
      // Medium craters
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.3) ** 2 + (ny - 0.5) ** 2 + (nz + 0.4) ** 2) * 8) * 0.05;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.6) ** 2 + (ny + 0.1) ** 2 + (nz - 0.2) ** 2) * 9) * 0.04;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.2) ** 2 + (ny + 0.4) ** 2 + (nz + 0.5) ** 2) * 10) * 0.04;
      
      // Small craters
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.3) ** 2 + (ny + 0.5) ** 2 + (nz - 0.4) ** 2) * 15) * 0.03;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.6) ** 2 + (ny - 0.3) ** 2 + (nz + 0.1) ** 2) * 18) * 0.025;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.4) ** 2 + (ny - 0.2) ** 2 + (nz + 0.6) ** 2) * 20) * 0.02;
      
      // Apply deformation (1 is normal surface, less than 1 creates depressions)
      const deformation = 1 - craterDepth + noise;
      
      positions.setXYZ(
        i,
        nx * deformation,
        ny * deformation,
        nz * deformation
      );
    }
    
    geometry.computeVertexNormals();
    return geometry;
  });
  
  useFrame((state) => {
    if (moonRef.current) {
      // Slow rotation to show off the craters
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      moonRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
    }
  });
  
  return (
    <group>
      {/* Main moon body with craters - realistic gray color */}
      <mesh ref={moonRef} geometry={moonGeometry}>
        <meshStandardMaterial
          color="#c0c0c0"  // Light gray (like real moon)
          roughness={0.9}   // Rough but not completely matte
          metalness={0.1}   // Tiny bit of reflection
          emissive="#a0a0b0"  // Self-illuminated gray-blue
          emissiveIntensity={0.4}  // Strong enough to be visible in dark
        />
      </mesh>
      
      {/* Moon glow for visibility */}
      <mesh scale={isHovered ? [1.08, 1.08, 1.08] : [1.05, 1.05, 1.05]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#9999cc"  // Soft blue-gray glow
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

interface CelestialBodyProps {
  isDark: boolean;
  isTransitioning: boolean;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

function CelestialBody({
  isDark,
  isTransitioning,
  isHovered,
  mousePosition,
}: CelestialBodyProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      // Animate the transition
      gsap.to(groupRef.current.scale, {
        x: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        y: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        z: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        duration: 0.3,
        ease: "power2.inOut",
      });

      // Rotate during transition
      if (isTransitioning) {
        gsap.to(groupRef.current.rotation, {
          y: groupRef.current.rotation.y + Math.PI * 2,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }
    }
  }, [isTransitioning, isHovered]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // React to mouse movement when hovered
      if (isHovered) {
        groupRef.current.position.x = mousePosition.x * 0.3;
        groupRef.current.position.y += mousePosition.y * 0.3;
      } else {
        groupRef.current.position.x *= 0.95; // Smoothly return to center
      }
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.3}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={groupRef}>
        {isDark ? <Moon isHovered={isHovered} /> : <Sun isHovered={isHovered} />}
      </group>
    </Float>
  );
}

interface SceneProps {
  isDark: boolean;
  isTransitioning: boolean;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

function Scene({
  isDark,
  isTransitioning,
  isHovered,
  mousePosition,
}: SceneProps) {
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
      <ambientLight intensity={isDark ? 0.15 : 0.2} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 0.3 : 0.3}
        color={isDark ? "#b0b0ff" : "#ffffff"}
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

export default function ThemeToggle3D({
  isDarkMode,
  toggleTheme,
}: ThemeToggle3DProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLButtonElement>(null);
  const initialBgColor = getInitialBgColor();

  useEffect(() => {
    // Check if device might struggle with 3D
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency <= 2
      : false;

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
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = (-(e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    }
  };

  if (!showCanvas) {
    return null;
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
          transform: isHovered
            ? `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg) scale(1.1)`
            : "scale(1)",
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
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "exclude",
            maskComposite: "exclude",
          }}
        />

        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{
            width: "100%",
            height: "100%",
            background: initialBgColor,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
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
          <span
            className={`text-[8px] font-bold tracking-wider animate-pulse ${
              isDarkMode ? "text-white/70" : "text-gray-700/80"
            }`}
          >
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
