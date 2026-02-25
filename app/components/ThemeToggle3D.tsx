"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const getInitialBgColor = () => {
  if (typeof window === "undefined") return "#BFDAF7";
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = savedTheme === "dark";
  return prefersDark ? "#050510" : "#BFDAF7";
};

interface ParticlesProps {
  isDark: boolean;
  mousePosition: { x: number; y: number };
}

const Particles = React.memo(function Particles({ isDark, mousePosition }: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = isDark ? 120 : 60;
  const originalColorsRef = useRef<Float32Array | null>(null);
  const twinkleSpeedsRef = useRef<Float32Array>(new Float32Array(0));

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    originalColorsRef.current = null; // reset so we re-copy on next frame

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      speeds[i] = 0.5 + Math.random() * 2.5;

      if (isDark) {
        // Stars: varied blue-white, warm white, yellow-white tones
        const starType = Math.random();
        if (starType < 0.3) {
          colors[i3] = 0.7; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1.0; // blue-white
        } else if (starType < 0.6) {
          colors[i3] = 1.0; colors[i3 + 1] = 1.0; colors[i3 + 2] = 0.9; // warm white
        } else {
          colors[i3] = 1.0; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.6; // yellow
        }
      } else {
        // Sun motes: warm golden sparkles
        colors[i3]     = 1.0;
        colors[i3 + 1] = 0.85 + Math.random() * 0.15;
        colors[i3 + 2] = 0.1  + Math.random() * 0.3;
      }
    }

    twinkleSpeedsRef.current = speeds;
    return [positions, colors];
  }, [particleCount, isDark]);

  const frameCountRef = useRef(0);

  useFrame((state) => {
    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;

    if (!meshRef.current) return;

    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.2;

    const targetX = mousePosition.x * 0.2;
    const targetY = -mousePosition.y * 0.2;
    meshRef.current.rotation.x += targetY * 0.1;
    meshRef.current.rotation.y += targetX * 0.1;

    // Twinkling effect for dark-mode stars
    if (isDark) {
      if (!originalColorsRef.current) {
        originalColorsRef.current = new Float32Array(colors);
      }
      const colorAttr = meshRef.current.geometry.attributes.color as THREE.BufferAttribute;
      const t = state.clock.elapsedTime;
      const speeds = twinkleSpeedsRef.current;
      const orig = originalColorsRef.current;
      for (let i = 0; i < particleCount; i++) {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * speeds[i] + i * 1.7));
        const i3 = i * 3;
        colorAttr.setXYZ(i, orig[i3] * twinkle, orig[i3 + 1] * twinkle, orig[i3 + 2] * twinkle);
      }
      colorAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.06 : 0.04}
        sizeAttenuation={true}
        transparent={true}
        opacity={isDark ? 0.95 : 0.6}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Rotating sun rays
const SunRays = React.memo(function SunRays({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const rayCount = 12;

  const rays = useMemo(() =>
    Array.from({ length: rayCount }, (_, i) => {
      const angle = (i / rayCount) * Math.PI * 2;
      const length = 0.25 + (i % 3 === 0 ? 0.25 : 0.1);
      const width = 0.025 + (i % 3 === 0 ? 0.015 : 0.005);
      return { angle, length, width };
    }), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(ray.angle) * (1.12 + ray.length / 2),
            Math.sin(ray.angle) * (1.12 + ray.length / 2),
            0,
          ]}
          rotation={[0, 0, ray.angle + Math.PI / 2]}
        >
          <planeGeometry args={[ray.width, ray.length]} />
          <meshBasicMaterial
            color="#ffe566"
            transparent
            opacity={isHovered ? 0.85 : 0.55}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
});

// Sun component with gradient body shader, rays, and corona
const Sun = React.memo(function Sun({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const sunBodyRef = useRef<THREE.Mesh>(null);
  const [coronaGeometry] = useState(() => new THREE.IcosahedronGeometry(0.98, 6));

  useEffect(() => {
    if (coronaGeometry) {
      const positions = coronaGeometry.attributes.position as THREE.BufferAttribute;
      positions.usage = THREE.DynamicDrawUsage;
    }
  }, [coronaGeometry]);

  const sunBodyUniforms = useMemo(() => ({ time: { value: 0 } }), []);

  const frameCountRef = useRef(0);

  useFrame((state) => {
    frameCountRef.current++;
    const shouldUpdateCorona = frameCountRef.current % 3 === 0;

    if (groupRef.current) {
      groupRef.current.rotation.y = -state.clock.elapsedTime * 0.1;
    }

    // Update time uniform for body gradient animation
    sunBodyUniforms.time.value = state.clock.elapsedTime;

    // Corona noise — all vertices for smoother result
    if (shouldUpdateCorona && coronaRef.current && coronaGeometry) {
      const positions = coronaGeometry.attributes.position;
      const len = positions.count;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < len; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const noise =
          Math.sin(x * 4 + time * 1.5) * Math.cos(y * 4 + time) * 0.07 +
          Math.sin(y * 6 + time * 0.8) * Math.cos(z * 6 + time * 1.2) * 0.04;
        const scale = 1 + noise;

        const length = Math.sqrt(x * x + y * y + z * z);
        positions.setXYZ(i, (x / length) * scale, (y / length) * scale, (z / length) * scale);
      }
      positions.needsUpdate = true;
    }
  });

  const fresnelVert = `
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
  `;
  const fresnelFrag = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float alpha;
    varying float vReflectionFactor;
    void main() {
      float f = clamp(vReflectionFactor, 0.0, 1.0);
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f * alpha);
    }
  `;

  return (
    <group ref={groupRef}>
      {/* Main sun body — hot white centre → yellow → orange edge */}
      <mesh ref={sunBodyRef}>
        <icosahedronGeometry args={[1, 6]} />
        <shaderMaterial
          uniforms={sunBodyUniforms}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            void main() {
              float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
              vec3 centerColor = vec3(1.0,  1.0,  0.95);
              vec3 midColor    = vec3(1.0,  0.85, 0.1);
              vec3 edgeColor   = vec3(1.0,  0.38, 0.04);
              vec3 color = mix(centerColor, midColor, rim);
              color = mix(color, edgeColor, rim * rim);
              // Subtle animated surface variation
              float v = sin(vPosition.x * 9.0 + time) * cos(vPosition.y * 9.0 + time * 0.7) * 0.04;
              color = clamp(color + v, 0.0, 1.0);
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* Rotating rays */}
      <SunRays isHovered={isHovered} />

      {/* Rim / edge brightening */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <icosahedronGeometry args={[1, 6]} />
        <shaderMaterial
          uniforms={{
            color1: { value: new THREE.Color(0xffff99) },
            color2: { value: new THREE.Color(0x000000) },
            fresnelBias: { value: 0.2 },
            fresnelScale: { value: 1.5 },
            fresnelPower: { value: 4.0 },
            alpha: { value: 1.0 },
          }}
          vertexShader={fresnelVert}
          fragmentShader={fresnelFrag}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Corona (animated pulsing shell) */}
      <mesh ref={coronaRef} geometry={coronaGeometry}>
        <meshBasicMaterial color="#ff6600" transparent opacity={0.35} side={THREE.BackSide} />
      </mesh>

      {/* Outer glow */}
      <mesh scale={isHovered ? [1.32, 1.32, 1.32] : [1.22, 1.22, 1.22]}>
        <icosahedronGeometry args={[1, 4]} />
        <shaderMaterial
          uniforms={{
            color1: { value: new THREE.Color(0x000000) },
            color2: { value: new THREE.Color(0xff7700) },
            fresnelBias: { value: 0.1 },
            fresnelScale: { value: 1.2 },
            fresnelPower: { value: 3.5 },
            alpha: { value: 0.7 },
          }}
          vertexShader={fresnelVert}
          fragmentShader={fresnelFrag}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight color="#ffff99" intensity={2} distance={10} decay={2} />
    </group>
  );
});

// Moon component with terminator shader, crater geometry, and atmospheric glow
const Moon = React.memo(function Moon({ isHovered }: { isHovered: boolean }) {
  const moonRef = useRef<THREE.Mesh>(null);

  const [moonGeometry] = useState(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 8);
    const positions = geometry.attributes.position;
    const len = positions.count;

    for (let i = 0; i < len; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      const length = Math.sqrt(x * x + y * y + z * z);
      const nx = x / length;
      const ny = y / length;
      const nz = z / length;

      const noise =
        Math.sin(nx * 15) * Math.cos(ny * 15) * Math.sin(nz * 15) * 0.02 +
        Math.sin(nx * 30) * Math.cos(ny * 30) * Math.sin(nz * 30) * 0.01;

      let craterDepth = 0;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.5) ** 2 + (ny - 0.3) ** 2 + (nz - 0.1) ** 2) * 4) * 0.12;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.4) ** 2 + (ny + 0.2) ** 2 + (nz - 0.3) ** 2) * 5) * 0.1;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.1) ** 2 + (ny - 0.6) ** 2 + (nz + 0.2) ** 2) * 5) * 0.08;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.3) ** 2 + (ny - 0.5) ** 2 + (nz + 0.4) ** 2) * 8) * 0.05;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.6) ** 2 + (ny + 0.1) ** 2 + (nz - 0.2) ** 2) * 9) * 0.04;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.2) ** 2 + (ny + 0.4) ** 2 + (nz + 0.5) ** 2) * 10) * 0.04;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.3) ** 2 + (ny + 0.5) ** 2 + (nz - 0.4) ** 2) * 15) * 0.03;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx + 0.6) ** 2 + (ny - 0.3) ** 2 + (nz + 0.1) ** 2) * 18) * 0.025;
      craterDepth += Math.max(0, 1 - Math.sqrt((nx - 0.4) ** 2 + (ny - 0.2) ** 2 + (nz + 0.6) ** 2) * 20) * 0.02;

      const deformation = 1 - craterDepth + noise;
      positions.setXYZ(i, nx * deformation, ny * deformation, nz * deformation);
    }

    geometry.computeVertexNormals();
    return geometry;
  });

  const moonUniforms = useMemo(() => ({
    lightDir: { value: new THREE.Vector3(1.5, 0.8, 1.0).normalize() },
  }), []);

  const frameCountRef = useRef(0);

  useFrame((state) => {
    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;

    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      moonRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
    }
  });

  const fresnelVert = `
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
  `;

  return (
    <group>
      {/* Moon body with terminator + earthshine rim */}
      <mesh ref={moonRef} geometry={moonGeometry}>
        <shaderMaterial
          uniforms={moonUniforms}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 lightDir;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              float diffuse = max(0.0, dot(vNormal, lightDir));

              // Sharp terminator line between lit and dark hemisphere
              float terminator = smoothstep(-0.12, 0.18, dot(vNormal, lightDir));

              vec3 darkSide  = vec3(0.05, 0.05, 0.09);
              vec3 lightSide = vec3(0.72, 0.69, 0.65);
              vec3 highlight = vec3(0.92, 0.90, 0.86);

              vec3 color = mix(darkSide, lightSide, terminator);
              // Specular-ish highlight on lit side
              color = mix(color, highlight, diffuse * diffuse * 0.28);

              // Micro surface noise to hint at craters
              float noise = sin(vPosition.x * 22.0) * cos(vPosition.y * 22.0) * sin(vPosition.z * 22.0) * 0.025;
              color += noise;

              // Earthshine: blue-gray rim glow on the dark limb
              float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
              vec3 rimColor = vec3(0.25, 0.32, 0.55);
              color += rimColor * pow(rim, 3.5) * 0.3 * (1.0 - terminator);

              gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
            }
          `}
        />
      </mesh>

      {/* Atmospheric glow — Fresnel blue-purple haze */}
      <mesh scale={isHovered ? [1.11, 1.11, 1.11] : [1.07, 1.07, 1.07]}>
        <sphereGeometry args={[1, 16, 16]} />
        <shaderMaterial
          uniforms={{
            color1: { value: new THREE.Color(0x000000) },
            color2: { value: new THREE.Color(0x3344aa) },
            fresnelBias: { value: 0.05 },
            fresnelScale: { value: 1.0 },
            fresnelPower: { value: 3.0 },
          }}
          vertexShader={fresnelVert}
          fragmentShader={`
            uniform vec3 color1;
            uniform vec3 color2;
            varying float vReflectionFactor;
            void main() {
              float f = clamp(vReflectionFactor, 0.0, 1.0);
              gl_FragColor = vec4(mix(color2, color1, vec3(f)), f * 0.5);
            }
          `}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Directional light from the "sun" side to illuminate craters */}
      <directionalLight position={[3, 1.5, 2]} intensity={1.4} color="#e8e0d0" />
    </group>
  );
});

interface CelestialBodyProps {
  isDark: boolean;
  isTransitioning: boolean;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

const CelestialBody = React.memo(function CelestialBody({
  isDark,
  isTransitioning,
  isHovered,
  mousePosition,
}: CelestialBodyProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        y: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        z: isTransitioning ? 0.8 : isHovered ? 1.1 : 1,
        duration: 0.3,
        ease: "power2.inOut",
      });

      if (isTransitioning) {
        gsap.to(groupRef.current.rotation, {
          y: groupRef.current.rotation.y + Math.PI * 2,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }
    }
  }, [isTransitioning, isHovered]);

  const frameCountRef = useRef(0);

  useFrame((state) => {
    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      if (isHovered) {
        groupRef.current.position.x = mousePosition.x * 0.3;
        groupRef.current.position.y += mousePosition.y * 0.3;
      } else {
        groupRef.current.position.x *= 0.95;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3} floatingRange={[-0.1, 0.1]}>
      <group ref={groupRef}>
        {isDark ? <Moon isHovered={isHovered} /> : <Sun isHovered={isHovered} />}
      </group>
    </Float>
  );
});

interface SceneProps {
  isDark: boolean;
  isTransitioning: boolean;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

const Scene = React.memo(function Scene({
  isDark,
  isTransitioning,
  isHovered,
  mousePosition,
}: SceneProps) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const targetColor = isDark ? "#050510" : "#BFDAF7";
    scene.background = new THREE.Color(targetColor);
    if (gl.domElement.parentElement) {
      gl.domElement.parentElement.style.backgroundColor = targetColor;
    }
  }, [isDark, gl, scene]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />

      <ambientLight intensity={isDark ? 0.15 : 0.2} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 0.3 : 0.3}
        color={isDark ? "#b0b0ff" : "#ffffff"}
      />

      <CelestialBody
        isDark={isDark}
        isTransitioning={isTransitioning}
        isHovered={isHovered}
        mousePosition={mousePosition}
      />

      <Particles isDark={isDark} mousePosition={mousePosition} />
    </>
  );
});

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
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency <= 2
      : false;
    if (isMobile || isLowEnd) setShowCanvas(false);
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

  if (!showCanvas) return null;

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
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "exclude",
            maskComposite: "exclude",
          }}
        />

        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: "100%", height: "100%", background: initialBgColor }}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          onCreated={({ gl, scene }) => {
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

        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-1 pointer-events-none">
        </div>
      </button>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
