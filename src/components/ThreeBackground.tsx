import { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

const ThreeBackground = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const icosahedronsRef = useRef<THREE.Mesh[]>([]);
  const orbsRef = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetCameraRef = useRef({ x: 0, y: 0 });
  const scrollDepthRef = useRef(0);
  const frameIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020202, 10, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020202, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Wireframe icosahedrons
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xa1a1aa,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < 5; i++) {
      const icosahedron = new THREE.Mesh(icosahedronGeometry, wireframeMaterial);
      icosahedron.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      icosahedron.scale.setScalar(Math.random() * 2 + 1);
      scene.add(icosahedron);
      icosahedronsRef.current.push(icosahedron);
    }

    // Glowing orbs
    const orbGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });

    for (let i = 0; i < 8; i++) {
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      orb.scale.setScalar(Math.random() * 1.5 + 0.5);
      
      // Add glow
      const glowGeometry = new THREE.SphereGeometry(0.6, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      orb.add(glow);
      
      scene.add(orb);
      orbsRef.current.push(orb);
    }

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Scroll handler for depth movement
    const handleScroll = () => {
      scrollDepthRef.current = window.scrollY * 0.001;
    };

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera movement based on mouse
      targetCameraRef.current.x = mouseRef.current.x * 2;
      targetCameraRef.current.y = mouseRef.current.y * 2;
      
      if (cameraRef.current) {
        cameraRef.current.position.x += (targetCameraRef.current.x - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetCameraRef.current.y - cameraRef.current.position.y) * 0.05;
        cameraRef.current.position.z = 30 - scrollDepthRef.current * 10;
      }

      // Rotate particles slowly
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0002;
        particlesRef.current.rotation.x += 0.0001;
      }

      // Rotate icosahedrons
      icosahedronsRef.current.forEach((icosahedron, index) => {
        icosahedron.rotation.x += 0.001 * (index + 1);
        icosahedron.rotation.y += 0.002 * (index + 1);
      });

      // Animate orbs
      orbsRef.current.forEach((orb, index) => {
        const time = Date.now() * 0.001;
        orb.position.y += Math.sin(time + index) * 0.01;
        orb.rotation.x += 0.001;
        orb.rotation.y += 0.002;
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      icosahedronGeometry.dispose();
      wireframeMaterial.dispose();
      orbGeometry.dispose();
      orbMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
});

ThreeBackground.displayName = 'ThreeBackground';

export default ThreeBackground;
