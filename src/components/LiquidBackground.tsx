import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Vertex Shader: Standard Full-Screen Plane
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader: Liquid Distortion
const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

// Simplex Noise (or simple sine wave approximation for performance)
float noise(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  
  // Aspect Ratio Correction (Cover)
  vec2 s = uResolution; // Screen resolution
  vec2 i = vec2(1.0, 1.0); // Image resolution (assuming square or handled by texture loader)
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 coverUv = uv * s / new + offset;

  // Liquid Effect Logic
  float dist = distance(uv, uMouse);
  float decay = clamp(1.0 - dist * 1.5, 0.0, 1.0);
  
  // Wave ripple
  float wave = sin(uv.y * 10.0 + uTime) * 0.005;
  
  // Mouse interaction ripple
  float interaction = sin(dist * 20.0 - uTime * 2.0) * 0.02 * decay;
  
  // Combine distortions
  vec2 distortedUv = coverUv + vec2(interaction + wave, interaction + wave);

  // RGB Shift (Chromatic Aberration) based on distortion intensity
  float shift = (interaction + wave) * 0.5;
  float r = texture2D(uTexture, distortedUv + vec2(shift, 0.0)).r;
  float g = texture2D(uTexture, distortedUv).g;
  float b = texture2D(uTexture, distortedUv - vec2(shift, 0.0)).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

const BackgroundPlane = () => {
    const mesh = useRef<THREE.Mesh>(null);
    const { viewport, size } = useThree();
    const texture = useTexture('/ferrari-hero.png'); // Ensure this matches existing asset
    // Or fallback to existing cinematic one: '/ferrari_garage_cinematic.png'
    // Using 'ferrari-hero.png' as per plan, assuming it exists or acts as key visual.
    // Actually, let's use the most versatile one from file list: 'ferrari-hero.png' (56KB) or 'ferrari_garage_cinematic.png' (65KB).
    // I will use 'ferrari_garage_cinematic.png' as it sounds more "premium" for the background.
    const visualTexture = useTexture('/ferrari-hero.png');

    const uniforms = useMemo(
        () => ({
            uTexture: { value: visualTexture },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
        }),
        [visualTexture, size]
    );

    useFrame((state) => {
        if (mesh.current) {
            const { mouse, clock } = state;
            // Mouse is -1 to 1, convert to 0 to 1
            const x = (mouse.x + 1) / 2;
            const y = (mouse.y + 1) / 2;

            // Smooth lerp for mouse interaction
            uniforms.uMouse.value.lerp(new THREE.Vector2(x, y), 0.1);
            uniforms.uTime.value = clock.getElapsedTime();
            uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

export default function LiquidBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas 
                style={{ background: '#000' }}
                dpr={[1, 1.5]}
                gl={{ powerPreference: 'high-performance', antialias: false, alpha: false, depth: false }}
            >
                <Suspense fallback={null}>
                    <BackgroundPlane />
                </Suspense>
            </Canvas>
        </div>
    );
}
