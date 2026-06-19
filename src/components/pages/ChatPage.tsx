import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Bot, Cpu, Terminal, Sparkles, Mail, Github, 
  Layers, Sliders, Settings, X, Search, Globe, FileText, 
  Code, Eye, Volume2, VolumeX, HelpCircle, Activity,
  Mic, MicOff, Share2, Info, Compass
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string[];
  toolCall?: string;
  timestamp: string;
  showProjects?: boolean;
  showSkills?: boolean;
  showExperience?: boolean;
  showContact?: boolean;
}

// Sidebar links and mapping to query strings
const SIDEBAR_MENU = [
  { label: 'OVERVIEW', sub: 'Who is Bhuvanesh?', query: 'Give me a 10-second introduction.' },
  { label: 'PROJECTS', sub: '10+ Completed', query: 'What projects has he built?' },
  { label: 'SKILLS', sub: 'AI • ML • Full Stack', query: 'What are his AI & tech skills?' },
  { label: 'EXPERIENCE', sub: 'Work Journey', query: 'Show his experience' },
  { label: 'EDUCATION', sub: 'Academic Background', query: 'Show his education details' },
  { label: 'RESEARCH', sub: 'Papers & Publications', query: 'Tell me about Bhuvanesh\'s research or publications.' },
  { label: 'RESUME', sub: 'Download / View', query: '/resume' },
  { label: 'CONTACT', sub: 'Get in Touch', query: 'How can I contact him?' }
];

const STARTER_QUERIES = [
  { label: 'Tell me about Bhuvanesh', query: 'Give me a 10-second introduction.' },
  { label: 'Show his projects', query: 'What projects has he built?' },
  { label: 'What are his skills?', query: 'What are his AI & tech skills?' },
  { label: 'Experience & background', query: 'Show his experience' },
  { label: 'How can I contact him?', query: 'How can I contact him?' }
];

// Tri-color styles dictionary
const ACCENT_STYLES = {
  red: {
    color: '#ff2800',
    bgClass: 'bg-[#ff2800]',
    borderClass: 'border-red-500/30',
    borderHoverClass: 'hover:border-red-500/50',
    textClass: 'text-[#ff2800]',
    textMutedClass: 'text-red-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,40,0,0.15)]',
    pulseClass: 'bg-red-500 shadow-[0_0_8px_#ff2800]',
    radialGradient: 'from-orange-500/10 via-red-600/5 to-transparent',
    gradientClass: 'from-orange-500 to-red-600',
    gradientHoverClass: 'hover:from-orange-600 hover:to-red-700',
    chartStroke: 'rgba(255, 40, 0, 0.6)',
    activeMenuClass: 'bg-red-500/10 border-red-500/25 text-red-400',
    loaderGlow: 'shadow-[0_0_8px_rgba(255,61,0,0.8)]',
    fillColor: 'rgba(255, 40, 0, 0.15)'
  },
  blue: {
    color: '#00d2ff',
    bgClass: 'bg-[#00d2ff]',
    borderClass: 'border-blue-500/30',
    borderHoverClass: 'hover:border-blue-500/50',
    textClass: 'text-[#00d2ff]',
    textMutedClass: 'text-blue-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,210,255,0.15)]',
    pulseClass: 'bg-blue-500 shadow-[0_0_8px_#00d2ff]',
    radialGradient: 'from-cyan-500/10 via-blue-600/5 to-transparent',
    gradientClass: 'from-cyan-400 to-blue-600',
    gradientHoverClass: 'hover:from-cyan-500 hover:to-blue-700',
    chartStroke: 'rgba(0, 210, 255, 0.6)',
    activeMenuClass: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
    loaderGlow: 'shadow-[0_0_8px_rgba(0,210,255,0.8)]',
    fillColor: 'rgba(0, 210, 255, 0.15)'
  },
  green: {
    color: '#00ff66',
    bgClass: 'bg-[#00ff66]',
    borderClass: 'border-emerald-500/30',
    borderHoverClass: 'hover:border-emerald-500/50',
    textClass: 'text-[#00ff66]',
    textMutedClass: 'text-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,255,102,0.15)]',
    pulseClass: 'bg-emerald-500 shadow-[0_0_8px_#00ff66]',
    radialGradient: 'from-lime-500/10 via-emerald-600/5 to-transparent',
    gradientClass: 'from-lime-400 to-emerald-600',
    gradientHoverClass: 'hover:from-lime-500 hover:to-emerald-700',
    chartStroke: 'rgba(0, 255, 102, 0.6)',
    activeMenuClass: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    loaderGlow: 'shadow-[0_0_8px_rgba(0,255,102,0.8)]',
    fillColor: 'rgba(0, 255, 102, 0.15)'
  }
};

// Interactive Node Coordinates for Knowledge Graph
const GRAPH_NODES = [
  { id: 'bio', label: 'About', x: 220, y: 150, category: 'Personal', desc: 'Bhuvanesh Chinthala, an elite Machine Learning & Computer Vision Engineer study at Amrita Coimbatore.' },
  { id: 'spar3d', label: 'SPAR3D Model', x: 380, y: 100, category: 'Project', desc: 'Single-view mesh reconstruction model with <120ms latency and 98.4% IoU.' },
  { id: 'voltai', label: 'VoltAI Grid', x: 350, y: 250, category: 'Project', desc: 'AI-powered smart grid control system utilizing multi-agent LLM reasoning (Mistral).' },
  { id: 'rag', label: 'Agentic RAG', x: 500, y: 170, category: 'Project', desc: 'Semantic search engine supporting complex PDFs and images using 6 specialized cognitive agents.' },
  { id: 'skills', label: 'Tech Stack', x: 200, y: 300, category: 'Technical', desc: 'Expertise in PyTorch, TensorFlow, OpenCV, Astro 5.0, React 19, Tailwind, and GSAP.' },
  { id: 'exp', label: 'Experience', x: 530, y: 280, category: 'Career', desc: 'Lead ML Engineer (SPAR3D), System Architect (VOLTAI), and Backend Developer (RAG AI).' },
  { id: 'contact', label: 'Get in Touch', x: 380, y: 380, category: 'Communications', desc: 'Email: bhuvaneshchinthala0@gmail.com | GitHub: github.com/bhuvaneshchinthala | LinkedIn: linkedin.com/in/bhuvanesh-chinthala' }
];

const GRAPH_EDGES = [
  { from: 'bio', to: 'skills' },
  { from: 'bio', to: 'exp' },
  { from: 'skills', to: 'spar3d' },
  { from: 'skills', to: 'voltai' },
  { from: 'skills', to: 'rag' },
  { from: 'exp', to: 'spar3d' },
  { from: 'exp', to: 'voltai' },
  { from: 'exp', to: 'rag' },
  { from: 'contact', to: 'bio' }
];

// ─────────────────────────────────────────────
// Sub-Component: Particle Starfield Background
// ─────────────────────────────────────────────
function ParticleBackground({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: 0.8 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.4
    }));

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const colorMap = {
        red: 'rgba(255, 40, 0, ',
        blue: 'rgba(0, 210, 255, ',
        green: 'rgba(0, 255, 102, '
      };

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        ctx.fillStyle = `${colorMap[accent]}${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.25 }}
    />
  );
}

// Cyborg Glowing Face Icon
function RobotHeadIcon({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const color = ACCENT_STYLES[accent].color;
  return (
    <svg className="w-8 h-8" style={{ color }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M 30,25 L 70,25 L 82,50 L 70,80 L 30,80 L 18,50 Z" strokeWidth="3" />
      <line x1="38" y1="45" x2="48" y2="45" strokeWidth="4" strokeLinecap="round" />
      <line x1="52" y1="45" x2="62" y2="45" strokeWidth="4" strokeLinecap="round" />
      <path d="M 50,25 L 50,37" />
      <path d="M 22,48 L 32,48" />
      <path d="M 78,48 L 68,48" />
      <path d="M 38,65 L 62,65" strokeWidth="2.5" />
    </svg>
  );
}

// 3D Concentric Holographic Sphere Globe Animation
function HologramGlobe({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const style = ACCENT_STYLES[accent];
  return (
    <div className="relative w-64 h-64 flex items-center justify-center select-none">
      {/* Outer spinning ring */}
      <svg className="absolute w-full h-full animate-spin-slow opacity-30" style={{ color: style.color }} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="10 20 40 10 5 15" />
      </svg>
      {/* Counter spinning middle ring */}
      <svg className="absolute w-[85%] h-[85%] animate-spin-reverse-slow opacity-40" style={{ color: style.color }} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="30 15 10 30" />
      </svg>
      {/* Internal coordinate grid axes */}
      <svg className="absolute w-[70%] h-[70%] text-white/5 opacity-50" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      {/* Centered Glowing Sphere Core */}
      <div 
        className="absolute w-36 h-36 rounded-full border flex items-center justify-center shadow-[0_0_40px_rgba(255,40,0,0.15)] animate-pulse-slow"
        style={{ borderColor: `${style.color}33`, background: `radial-gradient(circle, ${style.color}1c 0%, transparent 70%)` }}
      >
        {/* Core center node */}
        <div 
          className="w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center"
          style={{ backgroundImage: `linear-gradient(135deg, ${style.color}dd, ${style.color}44)`, boxShadow: `0 0 20px ${style.color}` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </div>
        
        {/* Revolving electrons */}
        <div className="absolute inset-2 border rounded-full animate-spin-slow" style={{ animationDuration: '4s', borderColor: `${style.color}22` }}>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#ff7800]" style={{ backgroundColor: style.color }} />
        </div>
        <div className="absolute inset-4 border rounded-full animate-spin-reverse-slow" style={{ animationDuration: '6s', borderColor: `${style.color}22` }}>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#ff2800]" style={{ backgroundColor: style.color }} />
        </div>
      </div>
    </div>
  );
}

// Real-time Neural Waveform SVG Chart
function NeuralWaveform({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const style = ACCENT_STYLES[accent];
  const [points, setPoints] = useState<number[]>([15, 22, 18, 30, 25, 42, 38, 50, 42, 55, 45, 60, 48, 65, 55, 70]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const nextVal = Math.max(10, Math.min(80, prev[prev.length - 1] + (Math.random() - 0.5) * 20));
        return [...prev.slice(1), nextVal];
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 260} ${90 - p}`).join(' ');

  return (
    <div className="space-y-1 select-none font-mono">
      <div className="flex justify-between text-[7px] text-white/30 tracking-wider">
        <span>NEURAL PROCESSING LOAD</span>
        <span className="font-bold animate-pulse" style={{ color: style.color }}>{(points[points.length - 1] + 25).toFixed(0)} FLOPS</span>
      </div>
      <div className="h-10 w-full border border-white/5 bg-black/40 rounded p-1.5 relative overflow-hidden flex items-end">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 260 90">
          <path d={pathD} fill="none" stroke={style.chartStroke} strokeWidth="1.5" className="transition-all duration-150" />
        </svg>
      </div>
    </div>
  );
}

// RAG Custom Cards
function ProjectGrid({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const style = ACCENT_STYLES[accent];
  const projects = [
    { name: 'SPAR3D', desc: 'Single-view mesh reconstruction model in PyTorch. <120ms latency with 98.4% IoU.', stack: ['Python', 'PyTorch', '3D Vision'] },
    { name: 'VoltAI', desc: 'AI-powered smart grid control system utilizing multi-agent LLM reasoning (Mistral via Ollama).', stack: ['Python', 'TensorFlow', 'Mistral'] },
    { name: 'Multi-Agent RAG', desc: 'Semantic search engine supporting complex PDFs and images using 6 specialized AI agents.', stack: ['Mistral', 'ChromaDB', 'NLP'] },
    { name: 'RoboPick System', desc: 'Real-time pick-and-place robotics localizer using YOLOv5 and industrial arm mapping.', stack: ['PyTorch', 'OpenCV', 'XArm'] }
  ];

  return (
    <div className="mt-2.5 border border-white/5 rounded p-3 bg-black/40 backdrop-blur-sm shadow-[0_0_10px_rgba(255,40,0,0.01)] w-full">
      <div className="text-[8.5px] font-mono text-white/35 tracking-wider mb-2 uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }} />
        <span>RAG CORE // SELECTED PROJECTS</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {projects.map((proj, i) => (
          <div key={i} className="p-2.5 bg-[#080808] border border-white/5 rounded transition-colors flex flex-col justify-between group" style={{ contentVisibility: 'auto' }}>
            <div>
              <h5 className="text-white text-xs font-mono font-bold transition-colors group-hover:text-red-500" style={{ color: style.color }}>{proj.name}</h5>
              <p className="text-[9.5px] text-white/40 font-mono font-light mt-1 leading-normal">{proj.desc}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {proj.stack.map((s, idx) => (
                <span key={idx} className="px-1 py-0.5 bg-black border border-white/5 rounded text-[8px] font-mono text-red-400">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsBlock({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const style = ACCENT_STYLES[accent];
  const skillGroups = [
    { title: 'Core Competency', list: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'System Design'] },
    { title: 'AI Engineering', list: ['PyTorch', 'TensorFlow', 'OpenCV', 'Hugging Face', 'Python'] },
    { title: 'Front-End Stack', list: ['Astro 5.0', 'React 19', 'Tailwind v4', 'GSAP', 'Framer Motion'] }
  ];

  return (
    <div className="mt-2.5 border border-white/5 rounded p-3 bg-black/40 backdrop-blur-sm shadow-[0_0_10px_rgba(255,40,0,0.01)] w-full">
      <div className="text-[8.5px] font-mono text-white/35 tracking-wider mb-2 uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }} />
        <span>RAG CORE // SKILL MATRIX MAP</span>
      </div>
      <div className="space-y-2">
        {skillGroups.map((group, i) => (
          <div key={i}>
            <div className="text-[8px] font-mono mb-0.5 uppercase tracking-wide" style={{ color: style.color }}>{group.title}</div>
            <div className="flex flex-wrap gap-1">
              {group.list.map((skill, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-[#080808] border border-white/5 text-[8.5px] font-mono text-white/60 rounded hover:border-red-500/25 transition-colors">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceTimeline({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const style = ACCENT_STYLES[accent];
  const experiences = [
    { role: 'Lead ML Engineer', duration: 'May, 2026 - Present', company: 'SPAR3D', desc: 'Vision pipeline, 3D mesh modeling' },
    { role: 'System Architect', duration: 'Aug, 2025 - May, 2026', company: 'VOLTAI', desc: 'Mistral multi-agent smart grid orchestrator' },
    { role: 'Backend Developer', duration: 'Oct, 2024 - Aug, 2025', company: 'RAG AI Systems', desc: 'Semantic vectors, document indexing, ChromaDB' }
  ];

  return (
    <div className="mt-2.5 border border-white/5 rounded p-3 bg-black/40 backdrop-blur-sm shadow-[0_0_10px_rgba(255,40,0,0.01)] w-full">
      <div className="text-[8.5px] font-mono text-white/35 tracking-wider mb-2 uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }} />
        <span>RAG CORE // EXPERIENCE TIMELINE</span>
      </div>
      <div className="relative pl-3 border-l border-white/10 space-y-3">
        {experiences.map((exp, i) => (
          <div key={i} className="relative group">
            <span 
              className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full border border-black shadow-[0_0_6px_#ff2800] transition-transform group-hover:scale-125" 
              style={{ backgroundColor: style.color, boxShadow: `0 0 6px ${style.color}` }}
            />
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-mono font-bold group-hover:text-red-500 transition-colors">{exp.role}</span>
              <span className="text-[8.5px] font-mono text-white/40">{exp.duration}</span>
            </div>
            <div className="text-[9px] font-mono leading-none mt-0.5" style={{ color: style.color }}>{exp.company}</div>
            <p className="text-[9px] font-mono text-white/50 mt-1 leading-normal">{exp.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPanel({ accent }: { accent: 'red' | 'blue' | 'green' }) {
  const style = ACCENT_STYLES[accent];
  return (
    <div className="mt-2.5 border border-white/5 rounded p-3 bg-black/40 backdrop-blur-sm shadow-[0_0_10px_rgba(255,40,0,0.01)] w-full">
      <div className="text-[8.5px] font-mono text-white/35 tracking-wider mb-2 uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }} />
        <span>RAG CORE // COMMUNICATION PATHWAYS</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a href="mailto:bhuvaneshchinthala0@gmail.com" className="flex items-center gap-2 p-2 bg-[#080808] border border-white/5 hover:border-red-500/30 rounded text-white/60 hover:text-white transition-all group">
          <Mail size={11} style={{ color: style.color }} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9.5px] font-mono">bhuvaneshchinthala0@gmail.com</span>
        </a>
        <a href="https://github.com/bhuvaneshchinthala" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-[#080808] border border-white/5 hover:border-red-500/30 rounded text-white/60 hover:text-white transition-all group">
          <Github size={11} style={{ color: style.color }} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9.5px] font-mono">GitHub Profile</span>
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Markdown Parser Utility
// ─────────────────────────────────────────────
function parseInlineStyles(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Regex handles: **bold**, *italic*, `code`, [link](url)
  const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Push text before the match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      nodes.push(<strong key={`b-${match.index}`} className="font-bold text-white">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      nodes.push(<em key={`i-${match.index}`} className="italic text-white/80">{match[3]}</em>);
    } else if (match[4]) {
      // `inline code`
      nodes.push(
        <code key={`c-${match.index}`} className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/80">
          {match[4]}
        </code>
      );
    } else if (match[5] && match[6]) {
      // [link text](url)
      nodes.push(
        <a key={`a-${match.index}`} href={match[6]} target="_blank" rel="noreferrer" className="underline underline-offset-2 text-blue-400 hover:text-blue-300 transition-colors">
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function parseMarkdown(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code blocks ```
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={`code-${i}`} className="my-2 rounded border border-white/10 bg-black/60 overflow-hidden">
          {lang && (
            <div className="px-3 py-1 text-[7px] font-mono text-white/30 border-b border-white/5 uppercase tracking-widest bg-white/[0.02]">
              {lang}
            </div>
          )}
          <pre className="px-3 py-2.5 text-[10px] font-mono text-white/75 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {codeLines.join('\n')}
          </pre>
        </div>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-[11px] font-bold text-white tracking-wider uppercase mt-2 mb-1 font-mono">
          {parseInlineStyles(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xs font-bold text-white tracking-wider uppercase mt-2 mb-1 font-mono">
          {parseInlineStyles(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-sm font-bold text-white tracking-wider uppercase mt-2 mb-1 font-mono">
          {parseInlineStyles(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Unordered list items (* or -)
    if (/^\s*[\*\-]\s+/.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^\s*[\*\-]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*[\*\-]\s+/, '');
        listItems.push(
          <li key={`li-${i}`} className="flex items-start gap-1.5 text-[11px] text-white/80 leading-relaxed">
            <span className="text-white/30 mt-0.5 shrink-0">•</span>
            <span>{parseInlineStyles(itemText)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-0.5 my-1 pl-1">
          {listItems}
        </ul>
      );
      continue;
    }

    // Ordered list items (1. 2. etc.)
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*\d+\.\s+/, '');
        listItems.push(
          <li key={`oli-${i}`} className="flex items-start gap-1.5 text-[11px] text-white/80 leading-relaxed">
            <span className="text-white/30 mt-0.5 shrink-0 font-mono text-[9px]">{num}.</span>
            <span>{parseInlineStyles(itemText)}</span>
          </li>
        );
        i++;
        num++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-0.5 my-1 pl-1">
          {listItems}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-[11px] text-white/80 leading-relaxed">
        {parseInlineStyles(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// ─────────────────────────────────────────────
// Main Page Export
// ─────────────────────────────────────────────
export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm **BHUV AI**. I'm your AI assistant and digital twin. I can answer anything about Bhuvanesh, his projects, skills, experience and more. How can I help you today?",
      timestamp: ""
    }
  ]);

  // Avoid SSR hydration time mismatch
  useEffect(() => {
    setMessages(prev => {
      if (prev.length > 0 && prev[0].timestamp === "") {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updated = [...prev];
        updated[0] = { ...updated[0], timestamp: time };
        return updated;
      }
      return prev;
    });
  }, []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // IMMERSIVE UPGRADE STATES
  const [accent, setAccent] = useState<'red' | 'blue' | 'green'>('red');
  const [isMuted, setIsMuted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(GRAPH_NODES[0]);
  const [isListening, setIsListening] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const [uptime, setUptime] = useState({ days: 42, hours: 17, minutes: 26, seconds: 13 });
  const [logs, setLogs] = useState<string[]>([
    "00:39:53 // BHUV AI initialized & loaded successfully.",
    "00:39:54 // Index cached loaded: 127 documents synced.",
    "00:40:01 // Server socket pipeline: SECURE ESTABLISHED."
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentAccentStyle = ACCENT_STYLES[accent];

  // Web Audio API Synthesizer (Zero asset loading)
  const playBeep = (freq = 800, duration = 0.05, type = 'sine') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type as OscillatorType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked");
    }
  };

  const playSendSweep = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  };

  const playReceiveChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(650, ctx.currentTime);
      gain1.gain.setValueAtTime(0.02, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);

      setTimeout(() => {
        const AudioCtxInner = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxInner) return;
        const ctx2 = new AudioCtxInner();
        const osc2 = ctx2.createOscillator();
        const gain2 = ctx2.createGain();
        osc2.frequency.setValueAtTime(950, ctx2.currentTime);
        gain2.gain.setValueAtTime(0.02, ctx2.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx2.currentTime + 0.2);
        osc2.connect(gain2);
        gain2.connect(ctx2.destination);
        osc2.start();
        osc2.stop(ctx2.currentTime + 0.2);
      }, 70);
    } catch (e) {}
  };

  // Increment Uptime clock
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => {
        let s = prev.seconds + 1;
        let m = prev.minutes;
        let h = prev.hours;
        let d = prev.days;
        if (s >= 60) {
          s = 0;
          m += 1;
        }
        if (m >= 60) {
          m = 0;
          h += 1;
        }
        if (h >= 24) {
          h = 0;
          d += 1;
        }
        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Voice recognition simulation loop
  useEffect(() => {
    if (!isListening) return;
    
    // Play active beep
    playBeep(440, 0.2, 'triangle');
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`${timestampStr} // VOICE RECOGNITION PIPELINE ACTIVE - RECORDING INPUT...`, ...prev.slice(0, 10)]);

    const timeout = setTimeout(() => {
      setIsListening(false);
      const randomQueries = [
        "What projects has Bhuvanesh built?",
        "What are his AI & tech skills?",
        "Show Bhuvanesh's work experience.",
        "How can I contact him?"
      ];
      const selectedQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      handleSend(selectedQuery);
    }, 3200);

    return () => clearTimeout(timeout);
  }, [isListening]);

  // Audio tone response on message updates
  useEffect(() => {
    if (messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        playReceiveChime();
      }
    }
    // Auto-scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customQuery?: string) => {
    const queryText = customQuery || input;
    if (!queryText.trim() || isLoading) return;

    const userMessage = queryText.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: currentTime }]);
    setIsLoading(true);
    playSendSweep();

    // Append log event
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      `${timestampStr} // Query matches cognitive vector space.`,
      `${timestampStr} // Retrieving Bhuvanesh's documents...`,
      ...prev.slice(0, 8)
    ]);

    const queryLower = userMessage.toLowerCase();
    const triggerProjects = queryLower.includes('project');
    const triggerSkills = queryLower.includes('skill') || queryLower.includes('tech') || queryLower.includes('stack');
    const triggerExperience = queryLower.includes('experience') || queryLower.includes('work') || queryLower.includes('job');
    const triggerContact = queryLower.includes('contact') || queryLower.includes('email');

    // Intercept Resume download
    if (queryLower === '/resume' || queryLower.includes('download resume') || queryLower.includes('get cv')) {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '/bhuvanesh_resume.pdf';
        link.download = 'Bhuvanesh_Chinthala_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: "### Resume Download Triggered\n\nI have successfully initiated the secure local download pipeline for Bhuvanesh's resume.\n\n*   **Filename**: `Bhuvanesh_Chinthala_Resume.pdf`\n*   **Format**: `PDF (Scientific & Research Format)`\n*   **Status**: `Completed`\n\nIf the download did not start automatically, you can [click here to download directly](/bhuvanesh_resume.pdf).",
            thinking: [
              "Cognitive Router: Detected resume trigger token '/resume'.",
              "Tool Executor: Invoked system.download('bhuvanesh_resume.pdf') [Latency: 12ms].",
              "Verification Node: Decrypting document token packets."
            ],
            toolCall: "system.download('bhuvanesh_resume.pdf')",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
        setIsLoading(false);
      }, 700);
      return;
    }

    try {
      // Sliding window: send only the last 20 messages to avoid Gemini token limits
      // Full history is preserved in the UI state — only the API payload is trimmed
      const recentMessages = messages.slice(-20);
      const allMessages = [
        ...recentMessages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.content,
              thinking: data.thinking || [
                "Cognitive Router: Directing query to Gemini core routing node.",
                "Model Engine: Processing context graph via gemini-2.5-flash.",
                "Verification Node: Decrypting response token packets."
              ],
              toolCall: data.toolCall || "gemini.generateContent()",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              showProjects: triggerProjects,
              showSkills: triggerSkills,
              showExperience: triggerExperience,
              showContact: triggerContact
            }
          ]);
          setIsLoading(false);
          return;
        }
      }

      throw new Error("API call failed");
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "### Subroutine Network Failure\n\nCould not establish connection to the backend cognitive routing pipeline. Running offline diagnostic fallback.",
          thinking: ["Network Router: Failed to handshake with backend server.", "Diagnostic Node: Connection timed out."],
          toolCall: "network.handshake_fail()",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#030303] text-white flex flex-col font-sans overflow-hidden select-none">
      
      {/* CSS Keyframe Animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.8; }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 24s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background Starfield */}
      <ParticleBackground accent={accent} />

      {/* Background Image (Batman) with radial mask blend and vertical rotation */}
      <div 
        className="fixed pointer-events-none z-0 bg-cover bg-center opacity-[0.12]" 
        style={{ 
          backgroundImage: 'url("/batman-bg.png")',
          width: '150vmax',
          height: '150vmax',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          maskImage: 'radial-gradient(circle, black 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 85%)'
        }}
      />

      {/* Cyber Grid background scanlines */}
      <div className="fixed inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-[1] opacity-40" />

      {/* ─────────────────────────────────────────────
          TOP PANEL / STATUS BAR
          ───────────────────────────────────────────── */}
      <header className="relative z-10 w-full px-6 py-3 border-b border-white/[0.06] flex items-center justify-between bg-black/45 backdrop-blur-xl shadow-md shrink-0">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start leading-none font-mono">
            <span className="text-sm font-extrabold tracking-widest transition-colors duration-300" style={{ color: currentAccentStyle.color }}>BHUV AI</span>
            <span className="text-[7.5px] tracking-[0.25em] text-white/30 uppercase mt-0.5">NEURAL COMMAND CENTER</span>
          </div>
        </div>

        {/* Center Diagnostics Stats */}
        <div className="hidden md:flex items-center gap-7 text-[8.5px] font-mono text-white/45 tracking-widest uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white/30">NEURAL STATUS:</span>
            <span className="text-emerald-500 font-bold">ONLINE</span>
          </div>
          <div className="h-3.5 w-[1px] bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-white/30">KNOWLEDGE BASE:</span>
            <span className="text-white font-bold">127 DOCUMENTS</span>
          </div>
          <div className="h-3.5 w-[1px] bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-white/30">PROJECTS INDEXED:</span>
            <span className="text-white font-bold">34</span>
          </div>
        </div>

        {/* Right Menu Controls (Settings, Mute, Exit) */}
        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              setIsMuted(prev => !prev);
              playBeep(600, 0.05);
            }}
            className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-colors cursor-pointer text-white/50 hover:text-white"
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>

          {/* Accent Color Trigger Panel */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSettingsPanel(prev => !prev);
                playBeep(700, 0.04);
              }}
              className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-colors cursor-pointer text-white/50 hover:text-white"
            >
              <Settings size={12} />
            </button>
            
            {/* Hover/Click theme panel */}
            <AnimatePresence>
              {showSettingsPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2.5 w-32 p-2 bg-[#0c0c0c]/95 border border-white/10 rounded shadow-xl z-50 font-mono text-[9px] space-y-1.5"
                >
                  <div className="text-white/40 tracking-wider text-[8px] uppercase px-1">COLOR ACCENT</div>
                  {(['red', 'blue', 'green'] as const).map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setAccent(color);
                        setShowSettingsPanel(false);
                        playBeep(900, 0.04);
                      }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-white/5 flex items-center justify-between text-white/70 hover:text-white cursor-pointer uppercase"
                    >
                      <span>{color}</span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT_STYLES[color].color }} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Exit Button */}
          <button
            onClick={() => {
              playBeep(500, 0.08);
              navigate('/');
            }}
            className="px-3.5 py-1.5 rounded bg-red-950/20 hover:bg-red-500/20 border border-red-500/40 text-red-400 hover:text-white text-[9.5px] font-mono tracking-widest transition-all cursor-pointer flex items-center gap-1"
          >
            <X size={10} className="stroke-[2.5]" />
            <span>CLOSE AI</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          MAIN BODY LAYOUT
          ───────────────────────────────────────────── */}
      <div className="flex-1 w-full flex min-h-0 relative z-10">
        
        {/* LEFT COLUMN: BRANDING & REMOTE COMMAND CONTROLLER */}
        <aside className="hidden xl:flex flex-col w-[240px] border-r border-white/[0.06] p-4.5 gap-4 bg-black/15 backdrop-blur-sm select-none shrink-0 font-mono">
          
          {/* Circular Hologram Character profile */}
          <div className="p-4 rounded border border-white/[0.05] bg-black/45 flex flex-col items-center text-center shadow-md relative group">
            {/* Target scoping SVG */}
            <div className="absolute inset-0 border border-white/[0.02] pointer-events-none rounded" />
            <div className="relative w-20 h-20 flex items-center justify-center mb-3">
              {/* Spinning scope outer */}
              <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-60" style={{ color: currentAccentStyle.color }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="10 15 30 10" fill="none" />
              </svg>
              {/* Inner container */}
              <div className="w-14 h-14 rounded-full border bg-black/80 flex items-center justify-center shadow-[0_0_15px_rgba(255,40,0,0.15)]" style={{ borderColor: `${currentAccentStyle.color}4d`, boxShadow: `0 0 15px ${currentAccentStyle.color}26` }}>
                <RobotHeadIcon accent={accent} />
              </div>
            </div>
            <h4 className="text-xs font-bold tracking-wider text-white">BHUV AI <span className="text-[7.5px] px-1 py-0.2 border rounded font-bold ml-1" style={{ backgroundColor: `${currentAccentStyle.color}1a`, borderColor: `${currentAccentStyle.color}40`, color: currentAccentStyle.color }}>v2.5</span></h4>
            <p className="text-[8px] text-white/35 mt-1 tracking-widest uppercase">Your AI Digital Twin</p>
          </div>

          {/* Interactive Menu List */}
          <div className="flex-1 flex flex-col min-h-0 space-y-1 overflow-y-auto">
            <h5 className="text-[8px] font-bold tracking-[0.25em] mb-2 uppercase flex items-center gap-1.5 px-2.5" style={{ color: currentAccentStyle.color }}>
              <span>AI ASSISTANT</span>
              <span className="h-[1px] flex-1 bg-white/5" />
            </h5>
            {SIDEBAR_MENU.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleSend(item.query);
                  playBeep(800, 0.03);
                }}
                className="w-full text-left p-2.5 px-3 rounded border bg-white/[0.01] hover:bg-white/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                style={{
                  borderColor: `${currentAccentStyle.color}15`
                }}
              >
                <div>
                  <div className="text-[9.5px] font-bold text-white/60 transition-colors tracking-wide leading-none">{item.label}</div>
                  <div className="text-[7.5px] text-white/30 mt-0.5 tracking-wider font-light leading-none">{item.sub}</div>
                </div>
                <span className="text-white/10 group-hover:translate-x-0.5 transition-all text-xxs font-light">→</span>
              </button>
            ))}
          </div>

          {/* System Uptime Widget */}
          <div className="p-3 bg-black/45 border border-white/[0.05] rounded text-[8.5px] text-white/45 space-y-1.5 shadow-sm shrink-0">
            <div className="flex justify-between items-center tracking-wider">
              <span>SYSTEM UPTIME:</span>
              <span className="text-emerald-500 font-bold tracking-normal">
                {uptime.days}d {uptime.hours}h {uptime.minutes}m {uptime.seconds}s
              </span>
            </div>
            <div className="w-full h-[1.5px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full shadow-[0_0_6px_#ff2800]" 
                style={{ width: `${(uptime.seconds / 60) * 100}%`, backgroundColor: currentAccentStyle.color }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

        </aside>

        {/* MIDDLE SECTION: HOLOGRAM CORE + CHAT WINDOW */}
        <main className="flex-1 flex min-h-0 bg-black/5">
          
          {/* Hologram core display sphere panel */}
          <div className="hidden md:flex flex-col w-[300px] border-r border-white/[0.06] p-5.5 justify-between select-none shrink-0 bg-black/10">
            
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-white/50 uppercase">
              <Layers size={10} style={{ color: currentAccentStyle.color }} />
              <span>AI CORE // ACTIVE</span>
            </div>

            {/* Glowing 3D Orb Component */}
            <div className="flex-1 flex items-center justify-center">
              <HologramGlobe accent={accent} />
            </div>

            {/* Neural Load waves */}
            <NeuralWaveform accent={accent} />
          </div>

          {/* Actual Chat Conversation Stream */}
          <div className="flex-1 flex flex-col min-h-0 bg-black/5 relative">
            
            {/* Header info */}
            <div className="px-6 py-3.5 border-b border-white/[0.06] flex items-center justify-between select-none shrink-0 bg-black/25">
              <div className="flex items-center gap-2 font-mono">
                <Sliders size={11} style={{ color: currentAccentStyle.color }} />
                <div>
                  <h4 className="text-[10px] font-bold tracking-wider text-white uppercase">AI CONVERSATION</h4>
                  <p className="text-[7.5px] text-white/35 mt-0.5 font-light uppercase">Ask anything about Bhuvanesh</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setShowGraph(true);
                    playBeep(850, 0.05);
                  }}
                  className="px-2.5 py-1 rounded border border-white/10 hover:border-white/20 bg-white/[0.02] text-[8.5px] font-mono tracking-widest uppercase transition-all cursor-pointer hover:bg-white/5 flex items-center gap-1.5"
                >
                  <Compass size={10} style={{ color: currentAccentStyle.color }} />
                  <span>KNOWLEDGE GRAPH</span>
                </button>
              </div>
            </div>

            {/* Scrollable messages box */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Thinking logs tracing */}
                  {msg.thinking && msg.thinking.length > 0 && (
                    <div className="w-full mb-2 max-w-[85%] sm:max-w-[75%] font-mono">
                      <details className="group border border-white/[0.03] rounded bg-black/60 overflow-hidden shadow-sm">
                        <summary className="flex items-center gap-2 px-3 py-1.5 text-[8.5px] text-white/35 cursor-pointer select-none hover:text-white/55 transition-colors">
                          <Cpu size={9} className="group-open:rotate-90 transition-transform" style={{ color: currentAccentStyle.color }} />
                          <span>Cognitive Trace Logs</span>
                        </summary>
                        <div className="px-3 pb-2 pt-1 space-y-1 border-t border-white/[0.02]">
                          {msg.thinking.map((step, sIdx) => (
                            <div key={sIdx} className="text-[8px] leading-normal flex items-start gap-1 text-white/45">
                              <span style={{ color: currentAccentStyle.color }}>❯</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}

                  {/* Tool executions logs */}
                  {msg.toolCall && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 mb-1.5 rounded border bg-white/[0.01] text-[8px] font-mono shadow-sm" style={{ borderColor: `${currentAccentStyle.color}1a`, color: currentAccentStyle.color }}>
                      <Terminal size={8.5} />
                      <span>EXEC: {msg.toolCall}</span>
                    </div>
                  )}

                  {/* Message Bubble wrapper */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded border px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white font-light'
                        : 'border-white/[0.04] text-white/95 shadow-md bg-zinc-900/40 backdrop-blur-md'
                    }`}
                    style={
                      msg.role === 'user'
                        ? {
                            background: `linear-gradient(135deg, ${currentAccentStyle.color}1a 0%, ${currentAccentStyle.color}2d 100%)`,
                            borderColor: `${currentAccentStyle.color}40`,
                            boxShadow: `0 4px 10px ${currentAccentStyle.color}0d`
                          }
                        : {
                            borderColor: 'rgba(255, 255, 255, 0.05)'
                          }
                    }
                  >
                    <div className="prose prose-invert max-w-none text-white font-sans">
                      {msg.role === 'assistant' ? (
                        <div className="space-y-1.5 leading-relaxed">
                          {parseMarkdown(msg.content)}
                        </div>
                      ) : (
                        <p className="whitespace-pre-line text-[11.5px] font-light">{msg.content}</p>
                      )}
                    </div>
                    <span className="block text-right text-[7.5px] font-mono text-white/20 mt-2">{msg.timestamp}</span>
                  </div>

                  {/* Inline widgets */}
                  {msg.role === 'assistant' && msg.showProjects && <div className="w-full max-w-[85%] sm:max-w-[75%]"><ProjectGrid accent={accent} /></div>}
                  {msg.role === 'assistant' && msg.showSkills && <div className="w-full max-w-[85%] sm:max-w-[75%]"><SkillsBlock accent={accent} /></div>}
                  {msg.role === 'assistant' && msg.showExperience && <div className="w-full max-w-[85%] sm:max-w-[75%]"><ExperienceTimeline accent={accent} /></div>}
                  {msg.role === 'assistant' && msg.showContact && <div className="w-full max-w-[85%] sm:max-w-[75%]"><ContactPanel accent={accent} /></div>}

                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-white/30 text-[9px] font-mono pl-1 mt-1">
                  <Cpu size={9} className="animate-spin" style={{ color: currentAccentStyle.color }} />
                  <span>Resolving cognitive graph</span>
                  <div className="flex gap-0.5 items-center">
                    <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 rounded-full" style={{ backgroundColor: currentAccentStyle.color }} />
                    <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full" style={{ backgroundColor: currentAccentStyle.color }} />
                    <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full" style={{ backgroundColor: currentAccentStyle.color }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick chips suggested queries */}
            <div className="px-6 py-2 border-t border-white/[0.04] bg-black/10 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 select-none">
              {STARTER_QUERIES.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSend(chip.query);
                    playBeep(800, 0.03);
                  }}
                  className="text-[8.5px] font-mono whitespace-nowrap bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.02] text-white/45 hover:text-white px-2.5 py-1 rounded transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                  style={{ borderColor: `${currentAccentStyle.color}25` }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input form capsule */}
            <div className="p-4 border-t border-white/[0.06] bg-[#090909]/45 backdrop-blur-md shrink-0 relative">
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ left: "-30%" }}
                    animate={{ left: "110%" }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    className="absolute top-0 h-[1.5px] w-1/4 bg-gradient-to-r from-transparent via-red-500 to-transparent pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(to right, transparent, ${currentAccentStyle.color}, transparent)`, boxShadow: `0 0 8px ${currentAccentStyle.color}` }}
                  />
                )}
              </AnimatePresence>
              
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative w-full flex items-center bg-black/45 border border-white/10 focus-within:border-red-500/40 rounded px-4 py-2.5 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
                style={{ borderColor: `${currentAccentStyle.color}15` }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything about Bhuvanesh..."
                  className="flex-1 bg-transparent text-white placeholder-white/20 focus:outline-none text-xs font-sans pr-14"
                />
                
                {/* Send arrow button */}
                <button
                  type="submit"
                  className="absolute right-2.5 w-7.5 h-7.5 rounded bg-white/[0.01] border transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  style={{ borderColor: `${currentAccentStyle.color}40`, color: currentAccentStyle.color }}
                >
                  <Send size={10.5} />
                </button>
              </form>
              <div className="text-[7.5px] text-center text-white/20 font-mono tracking-wider mt-2.5 uppercase">
                ⚠️ AI responses may not be 100% accurate.
              </div>
            </div>

          </div>
        </main>

        {/* RIGHT COLUMN: AI STATUS & SUBAGENTS RADAR */}
        <aside className="hidden lg:flex flex-col w-[240px] border-l border-white/[0.06] p-4.5 gap-4 bg-black/15 backdrop-blur-sm select-none shrink-0 font-mono">
          
          {/* Radar Status Tracker */}
          <div className="p-3 bg-black/45 border border-white/[0.05] rounded flex flex-col items-center justify-center text-center gap-3 shadow-md relative">
            <div className="w-full text-left text-[8px] font-bold text-white/30 tracking-widest uppercase">AI STATUS</div>
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Target Grid */}
              <svg className="absolute inset-0 w-full h-full" style={{ color: `${currentAccentStyle.color}1a` }} viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="0.75" fill="none" />
                <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="0.75" fill="none" />
                <line x1="60" y1="10" x2="60" y2="110" stroke="currentColor" strokeWidth="0.75" />
                <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" strokeWidth="0.75" />
              </svg>
              {/* Sweep rotate overlay */}
              <div className="absolute inset-0 w-full h-full rounded-full animate-spin-slow" style={{ animationDuration: '4s', background: `conic-gradient(from 0deg, transparent 50%, ${currentAccentStyle.color}1f)` }} />
              
              {/* Radar center node avatar */}
              <div className="relative z-10 w-9 h-9 rounded-full bg-[#050505] border flex items-center justify-center" style={{ borderColor: `${currentAccentStyle.color}4d` }}>
                <Bot size={14} style={{ color: currentAccentStyle.color }} />
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 justify-center leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE</span>
              </div>
              <p className="text-[7.5px] text-white/35 mt-1 tracking-wider uppercase leading-none">Ready to Assist</p>
            </div>
          </div>

          {/* Capabilities panel */}
          <div className="p-3 bg-black/45 border border-white/[0.05] rounded shadow-md flex-1 flex flex-col min-h-0">
            <div className="text-[8px] font-bold text-white/30 tracking-widest uppercase mb-3.5">CAPABILITIES</div>
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {[
                { label: 'RAG Search', desc: 'Enabled', icon: Search },
                { label: 'Web Search', desc: 'Enabled', icon: Globe },
                { label: 'Document AI', desc: 'Enabled', icon: FileText },
                { label: 'Code Interpreter', desc: 'Enabled', icon: Code },
                { label: 'Vision Analysis', desc: 'Enabled', icon: Eye }
              ].map((cap, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[8.5px]">
                  <div className="w-6 h-6 rounded bg-[#0b0b0b] border border-white/5 flex items-center justify-center shrink-0" style={{ color: currentAccentStyle.color }}>
                    <cap.icon size={10.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/60 font-bold leading-none truncate tracking-wide">{cap.label}</div>
                    <div className="text-emerald-500 text-[7.5px] mt-0.5 leading-none">{cap.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Graph card */}
          <div className="p-3 bg-black/45 border border-white/[0.05] rounded shadow-md text-[8px] space-y-2 shrink-0">
            <div className="flex justify-between items-center text-white/30 tracking-widest uppercase">
              <span>KNOWLEDGE GRAPH</span>
              <span style={{ color: currentAccentStyle.color }} className="text-[6.5px]">●</span>
            </div>
            
            {/* Connected node network nodes simulation SVG */}
            <div className="h-16 border border-white/5 bg-black/60 rounded relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" style={{ color: `${currentAccentStyle.color}40` }} viewBox="0 0 100 50">
                <line x1="20" y1="15" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="25" x2="80" y2="15" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="25" x2="35" y2="38" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="25" x2="65" y2="38" stroke="currentColor" strokeWidth="0.5" />
                <line x1="20" y1="15" x2="35" y2="38" stroke="currentColor" strokeWidth="0.5" />
                <line x1="80" y1="15" x2="65" y2="38" stroke="currentColor" strokeWidth="0.5" />

                <circle cx="20" cy="15" r="3" fill={currentAccentStyle.color} className="animate-pulse" />
                <circle cx="50" cy="50" r="1.5" fill="#fff" />
                <circle cx="50" cy="25" r="4.5" fill={currentAccentStyle.color} />
                <circle cx="80" cy="15" r="3" fill={currentAccentStyle.color} />
                <circle cx="35" cy="38" r="2.5" fill="#fff" />
                <circle cx="65" cy="38" r="2.5" fill={currentAccentStyle.color} />
              </svg>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center text-white/40">
              <div className="bg-[#0b0b0b] border border-white/5 p-1 rounded">
                <span className="text-white font-bold block">127</span>
                <span className="text-[6.5px] uppercase">Documents</span>
              </div>
              <div className="bg-[#0b0b0b] border border-white/5 p-1 rounded">
                <span className="text-white font-bold block">34</span>
                <span className="text-[6.5px] uppercase">Projects</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowGraph(true);
                playBeep(900, 0.05);
              }}
              className="w-full text-center py-1 rounded bg-[#0b0b0b] border border-white/5 text-white/50 hover:text-white text-[7.5px] transition-colors tracking-wider flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>VIEW FULL GRAPH</span>
              <span>→</span>
            </button>
          </div>

        </aside>

      </div>

      {/* ─────────────────────────────────────────────
          BOTTOM FEED PANEL
          ───────────────────────────────────────────── */}
      <footer className="relative z-10 w-full px-6 py-2 border-t border-white/[0.06] flex items-center justify-between bg-black/45 backdrop-blur-xl shadow-inner shrink-0 text-[8px] font-mono select-none">
        
        {/* Left Side: Activity Feed logs */}
        <div className="flex-1 max-w-lg hidden sm:flex items-center gap-3 select-none text-white/35 overflow-hidden">
          <span style={{ color: currentAccentStyle.color }} className="font-bold shrink-0 uppercase tracking-widest">ACTIVITY FEED //</span>
          <div className="h-4.5 w-[1px] bg-white/10 shrink-0" />
          <div className="flex-1 min-w-0 relative h-4 overflow-hidden">
            <div className="absolute inset-0 flex flex-col transition-all duration-300">
              <span className="truncate text-white/50 leading-none py-0.5">{logs[0]}</span>
            </div>
          </div>
        </div>

        {/* Center Credits */}
        <div className="flex items-center gap-1.5 text-white/40 text-[8.5px] select-none mx-auto sm:mx-0 shrink-0 uppercase tracking-widest">
          <span>BHUV AI</span>
          <span className="text-white/20">•</span>
          <span>POWERED BY GEMINI 2.5 FLASH</span>
          <Sparkles size={9.5} style={{ color: currentAccentStyle.color }} className="animate-pulse" />
        </div>

        {/* Right Voice Input widget simulator */}
        <div className="hidden md:flex items-center gap-3 shrink-0 select-none text-white/30">
          <span>VOICE INPUT:</span>
          <span className="font-bold uppercase tracking-wider" style={{ color: isListening ? '#00ff66' : currentAccentStyle.color }}>
            {isListening ? 'LISTENING...' : 'TAP TO SPEAK'}
          </span>
          
          {/* Wave animation simulator bars */}
          <div className="flex items-center gap-0.5 h-3">
            {[4, 10, 6, 8, 5].map((h, i) => (
              <motion.div
                key={i}
                className="w-0.5"
                style={{ backgroundColor: isListening ? '#00ff66' : currentAccentStyle.color }}
                animate={isListening ? { height: [h, h * 3.2, h] } : { height: [h, h * 1.5, h] }}
                transition={{ repeat: Infinity, duration: isListening ? 0.4 : 0.8, delay: i * 0.12 }}
              />
            ))}
          </div>
          
          {/* Circular Microphone button */}
          <button
            onClick={() => {
              if (!isListening) {
                setIsListening(true);
              }
            }}
            disabled={isListening || isLoading}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white cursor-pointer active:scale-95 disabled:cursor-not-allowed"
            style={{ 
              backgroundImage: isListening 
                ? 'linear-gradient(135deg, #00ff66 0%, #008f39 100%)' 
                : `linear-gradient(135deg, ${currentAccentStyle.color}b3, ${currentAccentStyle.color})`,
              boxShadow: isListening 
                ? '0 0 10px rgba(0,255,102,0.4)' 
                : `0 0 8px ${currentAccentStyle.color}40`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>
        </div>

      </footer>

      {/* ─────────────────────────────────────────────
          KNOWLEDGE GRAPH MODAL OVERLAY
          ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showGraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-6"
          >
            <div className="relative w-full max-w-5xl h-[90vh] bg-[#070707] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col font-mono">
              
              {/* Target Scoping Border lines */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: currentAccentStyle.color }} />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: currentAccentStyle.color }} />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: currentAccentStyle.color }} />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: currentAccentStyle.color }} />

              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <Compass size={14} style={{ color: currentAccentStyle.color }} />
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-white uppercase">BHUV AI // INTERACTIVE KNOWLEDGE GRAPH</h3>
                    <p className="text-[7.5px] text-white/30 mt-0.5 tracking-wider uppercase">Query semantic node relationships</p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowGraph(false);
                    playBeep(600, 0.05);
                  }}
                  className="w-7 h-7 rounded border border-white/10 hover:border-red-500/30 bg-white/[0.01] hover:bg-red-500/10 hover:text-red-400 text-white/50 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={12} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-black/20">
                
                {/* Left side: Interactive SVG Viewport */}
                <div className="flex-1 relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/[0.08]">
                  <svg className="w-full h-full max-w-2xl max-h-[50vh] md:max-h-full" viewBox="0 0 700 500">
                    
                    {/* Grid overlay */}
                    <defs>
                      <pattern id="modalGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.75" />
                      </pattern>
                    </defs>
                    <rect width="700" height="500" fill="url(#modalGrid)" />

                    {/* Edge connections lines */}
                    {GRAPH_EDGES.map((edge, idx) => {
                      const fromNode = GRAPH_NODES.find(n => n.id === edge.from);
                      const toNode = GRAPH_NODES.find(n => n.id === edge.to);
                      if (!fromNode || !toNode) return null;
                      const isSelectedEdge = selectedNode?.id === fromNode.id || selectedNode?.id === toNode.id;
                      
                      return (
                        <line
                          key={idx}
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={isSelectedEdge ? currentAccentStyle.color : 'rgba(255,255,255,0.08)'}
                          strokeWidth={isSelectedEdge ? 1.5 : 0.75}
                          className="transition-all duration-300"
                        />
                      );
                    })}

                    {/* Nodes circles */}
                    {GRAPH_NODES.map((node) => {
                      const isFocused = selectedNode?.id === node.id;
                      return (
                        <g 
                          key={node.id} 
                          onClick={() => {
                            setSelectedNode(node);
                            playBeep(950, 0.03);
                          }}
                          className="cursor-pointer group"
                        >
                          {/* Pulsing outer aura on hover / selection */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isFocused ? 18 : 12}
                            fill="transparent"
                            stroke={isFocused ? currentAccentStyle.color : 'transparent'}
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            className="transition-all duration-300"
                          />
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isFocused ? 10 : 7}
                            fill={isFocused ? currentAccentStyle.color : '#111'}
                            stroke={isFocused ? '#fff' : currentAccentStyle.color}
                            strokeWidth={isFocused ? 1.5 : 1}
                            className="transition-all duration-300 shadow-md group-hover:scale-115"
                          />
                          <text
                            x={node.x}
                            y={node.y - (isFocused ? 24 : 16)}
                            textAnchor="middle"
                            fill={isFocused ? '#fff' : 'rgba(255,255,255,0.4)'}
                            fontSize={isFocused ? '9.5' : '8'}
                            fontWeight={isFocused ? 'bold' : 'normal'}
                            className="transition-all duration-300 pointer-events-none select-none"
                          >
                            {node.label}
                          </text>
                        </g>
                      );
                    })}

                  </svg>
                </div>

                {/* Right side: Informational Panel */}
                <div className="w-full md:w-[320px] p-6 flex flex-col justify-between shrink-0 bg-black/30">
                  <div className="space-y-4">
                    
                    {/* Node Metadata header */}
                    <div className="space-y-1">
                      <div className="text-[7.5px] font-bold text-white/30 tracking-widest uppercase">SELECTED COMPONENT</div>
                      <h4 className="text-sm font-bold tracking-wider text-white uppercase">{selectedNode?.label || 'Select a Node'}</h4>
                      <span className="inline-block px-2 py-0.5 rounded text-[7.5px] font-bold tracking-wider uppercase" style={{ backgroundColor: `${currentAccentStyle.color}1a`, color: currentAccentStyle.color, border: `1px solid ${currentAccentStyle.color}26` }}>
                        {selectedNode?.category || 'N/A'}
                      </span>
                    </div>

                    <div className="h-[1px] bg-white/10" />

                    {/* Node description details */}
                    <div className="space-y-2.5">
                      <div className="text-[7.5px] font-bold text-white/30 tracking-widest uppercase">SEMANTIC KNOWLEDGE CONTENT</div>
                      <p className="text-[10px] text-white/70 tracking-wide font-light leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedNode?.desc || 'Select an entity node in the workspace graph viewport to audit technical data and dependencies.'}
                      </p>
                    </div>

                    {/* Network linkages counts */}
                    {selectedNode && (
                      <div className="space-y-2">
                        <div className="text-[7.5px] font-bold text-white/30 tracking-widest uppercase">LINK DATA CONNECTIONS</div>
                        <div className="flex gap-1.5 flex-wrap">
                          {GRAPH_EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, idx) => {
                            const otherId = edge.from === selectedNode.id ? edge.to : edge.from;
                            const otherNode = GRAPH_NODES.find(n => n.id === otherId);
                            return (
                              <span key={idx} className="px-1.5 py-0.5 bg-[#0b0b0b] border border-white/5 rounded text-[7.5px] text-white/50">
                                🔗 {otherNode?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Ask AI button */}
                  {selectedNode && (
                    <button
                      onClick={() => {
                        const targetQuery = selectedNode.id === 'bio' ? 'Give me a 10-second introduction.' :
                                            selectedNode.id === 'spar3d' ? 'What projects has he built?' :
                                            selectedNode.id === 'voltai' ? 'What projects has he built?' :
                                            selectedNode.id === 'rag' ? 'What projects has he built?' :
                                            selectedNode.id === 'skills' ? 'What are his AI & tech skills?' :
                                            selectedNode.id === 'exp' ? 'Show his experience' :
                                            selectedNode.id === 'contact' ? 'How can I contact him?' : 'Tell me about Bhuvanesh';
                        setShowGraph(false);
                        handleSend(targetQuery);
                      }}
                      className="w-full py-2.5 px-3.5 rounded text-[8.5px] font-bold tracking-widest text-white flex items-center justify-center gap-1.5 cursor-pointer uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{ 
                        backgroundImage: `linear-gradient(135deg, ${currentAccentStyle.color}b3, ${currentAccentStyle.color})`,
                        boxShadow: `0 0 12px ${currentAccentStyle.color}40`
                      }}
                    >
                      <Sparkles size={11} />
                      <span>QUERY COMPONENT</span>
                    </button>
                  )}

                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
