import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlobalBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Subtle Starfield
        const starsGeometry = new THREE.BufferGeometry();
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count); // Random sizes

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 40; // X
            positions[i + 1] = (Math.random() - 0.5) * 40; // Y
            positions[i + 2] = (Math.random() - 0.5) * 40; // Z
        }
        for (let i = 0; i < count; i++) {
            sizes[i] = Math.random();
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const starsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0xffffff) }
            },
            vertexShader: `
                uniform float uTime;
                attribute float size;
                void main() {
                    vec3 pos = position;
                    // Subtle movement
                    pos.y += sin(uTime * 0.1 + pos.x) * 0.05;
                    pos.x += cos(uTime * 0.1 + pos.y) * 0.05;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * 0.15; // Small stars
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                void main() {
                    // Circular soft particle
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    gl_FragColor = vec4(uColor, alpha * 0.5); // Low opacity
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Digital Grid (Floor) - Optional hint of structure
        const gridHelper = new THREE.GridHelper(60, 60, 0x222222, 0x111111);
        gridHelper.position.y = -10;
        gridHelper.rotation.x = 0; // Flat
        // Actually, let's keep it purely stars for now to match "Studio Mode" minimalism
        // scene.add(gridHelper); 

        // Animation Loop
        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            starsMaterial.uniforms.uTime.value = time;

            // Slow rotation
            starField.rotation.y = time * 0.02;
            starField.rotation.x = Math.sin(time * 0.05) * 0.02;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) containerRef.current.innerHTML = '';
            starsGeometry.dispose();
            starsMaterial.dispose();
        };

    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] pointer-events-none bg-black" />
    );
}
