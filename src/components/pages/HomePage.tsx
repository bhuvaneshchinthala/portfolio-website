// HPI 1.7-G
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'; // Not installed, must use raw three.js
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Globe, 
  Github, 
  ExternalLink, 
  ChevronDown, 
  Layers, 
  Zap, 
  LayoutGrid,
  User,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

// --- CANONICAL DATA SOURCES ---
// Derived from entities/index.ts to ensure strict adherence to data structures.

interface Project {
  _id: string;
  projectTitle: string;
  shortDescription: string;
  techStackTags: string[];
  liveUrl: string;
  gitHubUrl: string;
  projectThumbnail: string;
  featured?: boolean;
}

interface Skill {
  _id: string;
  skillName: string;
  category: 'Frontend' | 'Backend' | 'Design' | 'Tools';
  proficiencyLevel: number;
  icon: React.ReactNode;
}

const CANONICAL_PROJECTS: Project[] = [
  {
    _id: 'p1',
    projectTitle: 'Nebula OS',
    shortDescription: 'A web-based operating system simulating a futuristic interface with window management and file systems.',
    techStackTags: ['React', 'TypeScript', 'Three.js', 'Zustand'],
    liveUrl: 'https://example.com',
    gitHubUrl: 'https://github.com',
    projectThumbnail: 'https://static.wixstatic.com/media/13c41c_c68cb43721844de7a17963bfec8aec82~mv2.png?originWidth=448&originHeight=448',
    featured: true
  },
  {
    _id: 'p2',
    projectTitle: 'HyperGrid',
    shortDescription: 'High-performance data visualization dashboard for real-time financial analytics.',
    techStackTags: ['Next.js', 'D3.js', 'Tailwind', 'WebSockets'],
    liveUrl: 'https://example.com',
    gitHubUrl: 'https://github.com',
    projectThumbnail: 'https://static.wixstatic.com/media/13c41c_95adcc590ef84d1b88a7b1a5e99237f2~mv2.png?originWidth=448&originHeight=448',
    featured: true
  },
  {
    _id: 'p3',
    projectTitle: 'Aether Commerce',
    shortDescription: 'Headless e-commerce solution with 3D product configurators and AI recommendations.',
    techStackTags: ['Shopify', 'React Three Fiber', 'Node.js'],
    liveUrl: 'https://example.com',
    gitHubUrl: 'https://github.com',
    projectThumbnail: 'https://static.wixstatic.com/media/13c41c_1597d4af6fda4cbc9fa4d7c90403acab~mv2.png?originWidth=448&originHeight=448',
    featured: false
  },
  {
    _id: 'p4',
    projectTitle: 'Quantum Chat',
    shortDescription: 'End-to-end encrypted messaging platform with ephemeral messages and quantum-resistant keys.',
    techStackTags: ['Rust', 'WebAssembly', 'Socket.io'],
    liveUrl: 'https://example.com',
    gitHubUrl: 'https://github.com',
    projectThumbnail: 'https://static.wixstatic.com/media/13c41c_e95f7130edd14c58a1130204326f15a5~mv2.png?originWidth=448&originHeight=448',
    featured: false
  }
];

const CANONICAL_SKILLS: Skill[] = [
  { _id: 's1', skillName: 'React / Next.js', category: 'Frontend', proficiencyLevel: 98, icon: <Code2 className="w-5 h-5" /> },
  { _id: 's2', skillName: 'TypeScript', category: 'Frontend', proficiencyLevel: 95, icon: <Terminal className="w-5 h-5" /> },
  { _id: 's3', skillName: 'Three.js / WebGL', category: 'Frontend', proficiencyLevel: 85, icon: <Globe className="w-5 h-5" /> },
  { _id: 's4', skillName: 'Node.js', category: 'Backend', proficiencyLevel: 90, icon: <Cpu className="w-5 h-5" /> },
  { _id: 's5', skillName: 'UI/UX Design', category: 'Design', proficiencyLevel: 88, icon: <LayoutGrid className="w-5 h-5" /> },
];

// --- UTILITY COMPONENTS ---

const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.1, y: y * 0.1 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const RevealText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
};

// --- 3D BACKGROUND COMPONENT ---

const NebulaBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Icosahedrons
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0x52525b, wireframe: true, transparent: true, opacity: 0.1 });
    
    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20);
      mesh.scale.setScalar(Math.random() * 2 + 1);
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      targetX = mouseX * 2;
      targetY = mouseY * 2;

      // Smooth camera movement
      camera.rotation.y += 0.05 * (targetX - camera.rotation.y);
      camera.rotation.x += 0.05 * (targetY - camera.rotation.x);

      // Particle drift
      particlesMesh.rotation.y = elapsedTime * 0.02;
      particlesMesh.rotation.x = elapsedTime * 0.01;

      // Shape animation
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.002 * (i + 1);
        shape.rotation.y += 0.003 * (i + 1);
        shape.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.01;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// --- SECTIONS ---

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      <motion.div 
        style={{ y: y1, opacity }} 
        className="z-10 text-center max-w-[100rem] mx-auto w-full"
      >
        <div className="mb-6 flex justify-center">
          <Badge variant="outline" className="px-4 py-1 border-white/10 bg-white/5 text-light-gray backdrop-blur-sm rounded-full text-xs uppercase tracking-widest">
            Available for Hire
          </Badge>
        </div>
        
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-8 leading-[0.9]">
          <RevealText text="NEBULA" />
          <br />
          <RevealText text="DIGITAL" delay={0.1} />
        </h1>

        <p className="font-paragraph text-lg md:text-xl text-muted-gray max-w-2xl mx-auto mb-12 leading-relaxed">
          Architecting immersive digital experiences at the intersection of design, technology, and human interaction.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <MagneticButton className="group relative px-8 py-4 bg-white text-deep-black font-bold rounded-full overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-light-gray scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </MagneticButton>
          
          <MagneticButton className="px-8 py-4 border border-white/10 text-white rounded-full hover:bg-white/5 transition-colors backdrop-blur-sm">
            Contact Me
          </MagneticButton>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-gray">Scroll to Explore</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const CodeTerminal = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={containerRef} className="py-32 px-6 relative z-10 perspective-1000">
      <div className="max-w-[100rem] mx-auto w-full">
        <div className="mb-16 md:mb-24">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-muted-gray opacity-50">01.</span> The Engine
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <motion.div 
          style={{ rotateX, scale }}
          className="w-full max-w-5xl mx-auto bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-xs font-mono text-muted-gray flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              developer@nebula:~/portfolio
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 font-mono text-sm md:text-base overflow-x-auto">
            <div className="flex gap-8 mb-6 text-xs text-muted-gray border-b border-white/5 pb-2">
              <span className="text-white border-b border-white pb-2 -mb-2.5">index.tsx</span>
              <span>styles.css</span>
              <span>package.json</span>
            </div>

            <div className="space-y-2">
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">1</span>
                <span className="text-[#c678dd]">import</span> <span className="text-[#e06c75]">{`{ Future }`}</span> <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'@nebula/core'</span>;
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">2</span>
                <span className="text-[#c678dd]">import</span> <span className="text-[#e06c75]">{`{ Innovation }`}</span> <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'@nebula/design'</span>;
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">3</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">4</span>
                <span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">Portfolio</span> = <span className="text-[#56b6c2]">()</span> <span className="text-[#c678dd]">{`=>`}</span> <span className="text-[#abb2bf]">{`{`}</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">5</span>
                <span className="pl-4 text-[#c678dd]">return</span> <span className="text-[#abb2bf]">(</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">6</span>
                <span className="pl-8 text-[#e06c75]">{`<Experience`}</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">7</span>
                <span className="pl-12 text-[#d19a66]">immersive</span>=<span className="text-[#56b6c2]">{`{true}`}</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">8</span>
                <span className="pl-12 text-[#d19a66]">performance</span>=<span className="text-[#98c379]">"maximum"</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">9</span>
                <span className="pl-8 text-[#e06c75]">{`/>`}</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">10</span>
                <span className="pl-4 text-[#abb2bf]">);</span>
              </div>
              <div className="flex">
                <span className="text-muted-gray w-8 select-none">11</span>
                <span className="text-[#abb2bf]">{`}`}</span>
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2.5 h-5 bg-white ml-1 inline-block align-middle"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-32 px-6 relative z-10">
      <div className="max-w-[100rem] mx-auto w-full">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-muted-gray opacity-50">02.</span> Selected Works
            </h2>
            <div className="h-px w-full md:w-[500px] bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          <p className="font-paragraph text-muted-gray max-w-md text-right hidden md:block">
            A curation of digital products, experimental interfaces, and system architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[500px]">
          {CANONICAL_PROJECTS.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 transition-colors duration-500 ${project.featured ? 'md:col-span-2' : 'md:col-span-1'}`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={project.projectThumbnail} 
                  alt={project.projectTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStackTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                    {project.projectTitle}
                  </h3>
                  
                  <p className="font-paragraph text-light-gray mb-6 line-clamp-2 max-w-xl group-hover:text-white transition-colors">
                    {project.shortDescription}
                  </p>

                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <Button variant="outline" size="sm" className="rounded-full border-white/20 hover:bg-white hover:text-black transition-colors gap-2" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/10 text-white gap-2" asChild>
                      <a href={project.gitHubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" /> Source Code
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-6 relative z-10 bg-gradient-to-b from-transparent to-black/50">
      <div className="max-w-[100rem] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Text Content */}
          <div>
            <div className="mb-12">
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">
                <span className="text-muted-gray opacity-50">03.</span> The Architect
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div className="space-y-8 font-paragraph text-lg text-light-gray leading-relaxed">
              <p>
                I operate at the edge of what's possible on the web. My philosophy is simple: code is not just functional; it is an artistic medium. Every line I write is dedicated to performance, accessibility, and creating a visceral connection with the user.
              </p>
              <p>
                With a background in both computational logic and visual arts, I bridge the gap between engineering and design. I don't just build websites; I architect digital ecosystems that feel alive.
              </p>
              
              <div className="pt-8">
                <h3 className="text-white font-heading text-xl mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" /> Core Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CANONICAL_SKILLS.map((skill) => (
                    <div key={skill._id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
                      <div className="p-2 bg-white/10 rounded-md text-white">
                        {skill.icon}
                      </div>
                      <div>
                        <div className="text-white font-medium">{skill.skillName}</div>
                        <div className="text-xs text-muted-gray">{skill.category} • {skill.proficiencyLevel}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual/Stats Column */}
          <div className="relative lg:h-full min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-2 gap-6 w-full max-w-md">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center aspect-square">
                <div className="text-5xl font-heading font-bold text-white mb-2">5+</div>
                <div className="text-sm text-muted-gray uppercase tracking-wider">Years Exp.</div>
              </Card>
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center aspect-square mt-12">
                <div className="text-5xl font-heading font-bold text-white mb-2">50+</div>
                <div className="text-sm text-muted-gray uppercase tracking-wider">Projects</div>
              </Card>
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center aspect-square -mt-12">
                <div className="text-5xl font-heading font-bold text-white mb-2">100%</div>
                <div className="text-sm text-muted-gray uppercase tracking-wider">Commitment</div>
              </Card>
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center aspect-square">
                <Globe className="w-12 h-12 text-white mb-4" />
                <div className="text-sm text-muted-gray uppercase tracking-wider">Worldwide</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="py-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-8">
          Ready to Launch?
        </h2>
        <p className="font-paragraph text-xl text-muted-gray mb-12 max-w-2xl mx-auto">
          Let's collaborate to build something that defies expectations. Whether it's a new venture or a complex system overhaul, I'm ready.
        </p>
        <MagneticButton className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors">
          <Mail className="w-5 h-5" /> Start a Project
        </MagneticButton>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-deep-black text-foreground overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Fixed 3D Background */}
      <NebulaBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="flex flex-col gap-0">
          <HeroSection />
          <CodeTerminal />
          <ProjectsSection />
          <AboutSection />
          <ContactSection />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}