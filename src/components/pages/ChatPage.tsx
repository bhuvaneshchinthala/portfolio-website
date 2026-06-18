import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Cpu, Activity, HardDrive, Terminal, Bot, Sparkles, Download, Briefcase, GraduationCap, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import { KNOWLEDGE_BASE } from '../../data/knowledgeBase';

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

const STARTER_QUESTIONS = [
  { label: '👤 About Bhuvanesh', query: 'Tell me about Bhuvanesh' },
  { label: '📂 Selected Projects', query: 'What projects has he built?' },
  { label: '🛠️ AI & Tech Skills', query: 'What are his AI skills?' },
  { label: '💼 Work Experience', query: 'Show his experience' },
  { label: '📨 Initialize Contact', query: 'How can I contact him?' },
  { label: '📄 Download Resume', query: '/resume' }
];

const MOCK_CONSOLE_LOGS = [
  "SYS > Booting GL thread... [OK]",
  "NET > Establishing sub-routines...",
  "AI > Loading neural weights: [|||||||||| 100%]",
  "SYS > Memory allocation optimized.",
  "USR > Bhuvanesh initialized.",
  "NET > Secure connection established.",
  "AI > Ready for input.",
  "RAG > Local cache sync: SUCCESS",
  "SYS > Telemetry gateway active on port 4321",
  "AI > Context token budget allocated: 1M tokens",
  "DB > Loaded 14 knowledge segments"
];

// ─────────────────────────────────────────────
// Sub-Component: Particle Starfield Canvas
// ─────────────────────────────────────────────
function ParticleBackground() {
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

    const particleCount = 120;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.5
    }));

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        ctx.fillStyle = `rgba(255, 40, 0, ${p.opacity})`;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}

// ─────────────────────────────────────────────
// Sub-Component: Inline Style Parser
// ─────────────────────────────────────────────
function parseInlineStyles(text: string): React.ReactNode[] {
  const tokens: { type: 'text' | 'link' | 'bold' | 'code'; content: string; url?: string }[] = [];
  let lastIdx = 0;
  
  const inlineRegex = /(\*\*([^*]+)\*\*)|(\`([^`]+)\`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let match;
  
  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      tokens.push({ type: 'text', content: text.slice(lastIdx, match.index) });
    }
    
    const [full, boldFull, boldText, codeFull, codeText, linkFull, linkText, linkUrl] = match;
    
    if (boldFull) {
      tokens.push({ type: 'bold', content: boldText });
    } else if (codeFull) {
      tokens.push({ type: 'code', content: codeText });
    } else if (linkFull) {
      tokens.push({ type: 'link', content: linkText, url: linkUrl });
    }
    
    lastIdx = inlineRegex.lastIndex;
  }
  
  if (lastIdx < text.length) {
    tokens.push({ type: 'text', content: text.slice(lastIdx) });
  }
  
  return tokens.map((token, idx) => {
    if (token.type === 'bold') {
      return <strong key={idx} className="font-bold text-red-500">{token.content}</strong>;
    }
    if (token.type === 'code') {
      return <code key={idx} className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-red-400 border border-white/5">{token.content}</code>;
    }
    if (token.type === 'link') {
      return (
        <a 
          key={idx} 
          href={token.url} 
          target={token.url?.startsWith('http') ? '_blank' : undefined} 
          rel={token.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-[#ff2800] hover:text-red-400 underline font-semibold transition-colors duration-150"
        >
          {token.content}
        </a>
      );
    }
    return token.content;
  });
}

function parseMarkdown(text: string) {
  return text.split('\n\n').map((para, pIdx) => {
    if (para.startsWith('### ')) {
      return (
        <h4 key={pIdx} className="text-xs font-mono font-bold tracking-[0.1em] text-red-500 mt-3 mb-1 uppercase">
          {para.slice(4).trim()}
        </h4>
      );
    }
    if (para.startsWith('## ')) {
      return (
        <h3 key={pIdx} className="text-sm font-mono font-bold tracking-[0.1em] text-red-500 mt-4 mb-2 uppercase">
          {para.slice(3).trim()}
        </h3>
      );
    }

    if (para.startsWith('* ') || para.startsWith('- ') || para.includes('\n* ') || para.includes('\n- ')) {
      const items = para.split(/\n[\*\-]\s+/);
      let firstItem = items[0];
      let listItems = items.slice(1);
      
      if (firstItem.startsWith('* ') || firstItem.startsWith('- ')) {
        firstItem = firstItem.replace(/^[\*\-]\s+/, '');
        listItems = [firstItem, ...listItems];
        firstItem = '';
      }

      return (
        <div key={pIdx} className="mb-2">
          {firstItem && <p className="font-mono font-light tracking-wide mb-1 text-white/95 text-xs">{parseInlineStyles(firstItem)}</p>}
          <ul className="list-disc pl-5 font-mono font-light tracking-wide text-white/80 space-y-1 my-1 text-[11px] md:text-xs">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineStyles(item)}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <p key={pIdx} className="whitespace-pre-line font-mono font-light tracking-wide mb-2 text-white/90 text-xs md:text-sm">
        {parseInlineStyles(para)}
      </p>
    );
  });
}

// ─────────────────────────────────────────────
// Custom UI RAG blocks matching Akash's design
// ─────────────────────────────────────────────

function ProjectGrid() {
  const projects = [
    { name: 'SPAR3D', desc: 'Single-view mesh reconstruction model in PyTorch. <120ms latency with 98.4% IoU.', stack: ['Python', 'PyTorch', '3D Vision'] },
    { name: 'VoltAI', desc: 'AI-powered smart grid control system utilizing multi-agent LLM reasoning (Mistral via Ollama).', stack: ['Python', 'TensorFlow', 'Mistral'] },
    { name: 'Multi-Agent RAG', desc: 'Semantic search engine supporting complex PDFs and images using 6 specialized AI agents.', stack: ['Mistral', 'ChromaDB', 'NLP'] },
    { name: 'RoboPick System', desc: 'Real-time pick-and-place robotics localizer using YOLOv5 and industrial arm mapping.', stack: ['PyTorch', 'OpenCV', 'XArm'] }
  ];

  return (
    <div className="mt-4 border border-white/5 rounded-lg p-4 bg-zinc-950/40 backdrop-blur-sm">
      <div className="text-[10px] font-mono text-white/40 tracking-wider mb-3 uppercase">RAG RESOURCE // OPEN SOURCE PROJECTS</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((proj, i) => (
          <div key={i} className="p-3 bg-white/[0.02] border border-white/5 hover:border-red-500/30 rounded-lg transition-colors flex flex-col justify-between">
            <div>
              <h5 className="text-white text-xs font-mono font-bold">{proj.name}</h5>
              <p className="text-[10px] text-white/50 font-mono font-light mt-1.5 leading-relaxed">{proj.desc}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {proj.stack.map((s, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[8px] font-mono text-red-400">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsBlock() {
  const skillGroups = [
    { title: 'Core Competency', list: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'System Design'] },
    { title: 'AI Engineering', list: ['PyTorch', 'TensorFlow', 'OpenCV', 'Hugging Face', 'Python'] },
    { title: 'Front-End Stack', list: ['Astro 5.0', 'React 19', 'Tailwind v4', 'GSAP', 'Framer Motion'] }
  ];

  return (
    <div className="mt-4 border border-white/5 rounded-lg p-4 bg-zinc-950/40 backdrop-blur-sm">
      <div className="text-[10px] font-mono text-white/40 tracking-wider mb-3 uppercase">RAG RESOURCE // SKILL MATRIX MAP</div>
      <div className="space-y-3">
        {skillGroups.map((group, i) => (
          <div key={i}>
            <div className="text-[9px] font-mono text-red-500/80 mb-1">{group.title}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.list.map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white/[0.02] border border-white/5 text-[9px] font-mono text-white/70 rounded">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceTimeline() {
  const experiences = [
    { role: 'Lead ML Engineer', duration: 'May, 2026 - Present', company: 'SPAR3D', desc: 'Vision pipeline, 3D mesh modeling' },
    { role: 'System Architect', duration: 'Aug, 2025 - May, 2026', company: 'VOLTAI', desc: 'Mistral multi-agent smart grid orchestrator' },
    { role: 'Backend Developer', duration: 'Oct, 2024 - Aug, 2025', company: 'RAG AI Systems', desc: 'Semantic vectors, document indexing, ChromaDB' }
  ];

  return (
    <div className="mt-4 border border-white/5 rounded-lg p-4 bg-zinc-950/40 backdrop-blur-sm">
      <div className="text-[10px] font-mono text-white/40 tracking-wider mb-3 uppercase">RAG RESOURCE // EXPERIENCE TIMELINE</div>
      <div className="relative pl-4 border-l border-white/10 space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-black shadow-[0_0_8px_#ff2800]" />
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-mono font-bold">{exp.role}</span>
              <span className="text-[9px] font-mono text-white/40">{exp.duration}</span>
            </div>
            <div className="text-[10px] font-mono text-red-400">{exp.company}</div>
            <p className="text-[9px] font-mono text-white/50 mt-1">{exp.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPanel() {
  return (
    <div className="mt-4 border border-white/5 rounded-lg p-4 bg-zinc-950/40 backdrop-blur-sm">
      <div className="text-[10px] font-mono text-white/40 tracking-wider mb-3 uppercase">RAG RESOURCE // COMMUNICATION PATHWAYS</div>
      <div className="grid grid-cols-2 gap-2.5">
        <a href="mailto:hello@bhuvanesh.dev" className="flex items-center gap-2 p-2 bg-white/[0.01] border border-white/5 hover:border-red-500/30 rounded-lg text-white/70 hover:text-white transition-all">
          <Mail size={12} className="text-red-500" />
          <span className="text-[10px] font-mono">hello@bhuvanesh.dev</span>
        </a>
        <a href="https://github.com/chinthalasathwik" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white/[0.01] border border-white/5 hover:border-red-500/30 rounded-lg text-white/70 hover:text-white transition-all">
          <Github size={12} className="text-red-500" />
          <span className="text-[10px] font-mono">GitHub Profile</span>
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page Export
// ─────────────────────────────────────────────
export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "System initialized. I am ARES, Bhuvanesh's AI Representative. Ask me about his biography, machine learning projects, skills, education, experience, or type `/resume` to download his dossier.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(MOCK_CONSOLE_LOGS);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Telemetry HUD Logs append interval
  useEffect(() => {
    const extraLogs = [
      "NET > Ping check: 24ms [STABLE]",
      "SYS > Memory compaction check: COMPLETE",
      "AI > Local vector cache sync: READY",
      "SYS > Temperature limits check: 42°C [OK]",
      "RAG > Chunk embeddings read from warm cache",
      "AI > Subagent validator handshaking complete"
    ];

    const interval = setInterval(() => {
      const randomLog = extraLogs[Math.floor(Math.random() * extraLogs.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setConsoleLogs(prev => [...prev.slice(-14), `${timestamp} // ${randomLog}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async (customQuery?: string) => {
    const queryText = customQuery || input;
    if (!queryText.trim() || isLoading) return;

    const userMessage = queryText.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: currentTime }]);
    setIsLoading(true);

    // Dynamic UI blocks check
    const queryLower = userMessage.toLowerCase();
    const triggerProjects = queryLower.includes('project');
    const triggerSkills = queryLower.includes('skill') || queryLower.includes('tech') || queryLower.includes('stack');
    const triggerExperience = queryLower.includes('experience') || queryLower.includes('work') || queryLower.includes('job');
    const triggerContact = queryLower.includes('contact') || queryLower.includes('email');

    // Intercept Resume download
    if (queryLower === '/resume' || queryLower.includes('download resume')) {
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
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }
        ]);
        setIsLoading(false);
      }, 700);
      return;
    }

    try {
      const allMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
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
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* starfield canvas */}
      <ParticleBackground />

      {/* header */}
      <header className="relative z-10 w-full px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 border border-white/10 hover:border-red-500/40 rounded bg-white/[0.02] text-white/50 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-red-500/5 border border-red-500/20 flex items-center justify-center">
              <Bot size={14} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold tracking-[0.15em] text-white uppercase">ARES // COGNITIVE_NODE</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-mono text-emerald-500/80 tracking-widest uppercase">SECURE PORTAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* telemetry */}
        <div className="hidden sm:flex items-center gap-3 text-[8px] font-mono text-white/40 tracking-wider">
          <div className="flex items-center gap-1 bg-white/[0.01] px-2.5 py-1 rounded border border-white/[0.02]">
            <Activity size={8} className="text-red-500 animate-pulse" />
            <span>LATENCY: 224ms</span>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.01] px-2.5 py-1 rounded border border-white/[0.02]">
            <HardDrive size={8} className="text-red-500" />
            <span>COMPUTE: EDGE</span>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.01] px-2.5 py-1 rounded border border-white/[0.02]">
            <Terminal size={8} className="text-red-500" />
            <span>RAG INDEX: ACTIVE</span>
          </div>
        </div>
      </header>

      {/* split layout body */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex min-h-0 relative z-10">
        
        {/* Left Side HUD terminal */}
        <aside className="hidden lg:flex flex-col w-[340px] border-r border-white/5 p-6 space-y-6 bg-black/10">
          
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono font-bold tracking-widest text-red-500/80 uppercase">Cognitive Node Details</h4>
            <div className="p-4 rounded border border-white/5 bg-white/[0.01] space-y-2.5 font-mono text-[9px] text-white/60">
              <div className="flex justify-between">
                <span>MODEL ENG:</span>
                <span className="text-white">GEMINI-2.5-FLASH</span>
              </div>
              <div className="flex justify-between">
                <span>VECTORS:</span>
                <span className="text-white">GEMINI-EMBEDDING-2</span>
              </div>
              <div className="flex justify-between">
                <span>RAG INDEX:</span>
                <span className="text-emerald-500">14 SEGMENTS LOADED</span>
              </div>
              <div className="flex justify-between">
                <span>COGNITIVE AGENTS:</span>
                <span className="text-white">6 / 6 CONNECTED</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 space-y-2">
            <h4 className="text-[10px] font-mono font-bold tracking-widest text-red-500/80 uppercase shrink-0">System Log Terminal</h4>
            <div className="flex-1 overflow-y-auto p-4 rounded border border-white/5 bg-black/45 font-mono text-[8px] text-red-500/50 space-y-2 leading-relaxed scrollbar-hide">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-line border-b border-white/[0.02] pb-1.5 last:border-b-0">
                  <span className="text-red-500/30">❯</span> {log}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right side Main chat stream */}
        <main className="flex-1 flex flex-col min-h-0 bg-black/20">
          
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
            
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Sparkles className="text-red-500/40 w-10 h-10 mb-4 animate-pulse" />
                <h4 className="text-sm font-mono tracking-widest text-white/50 uppercase">Initialize Cognitive Session</h4>
                <p className="text-[10px] font-mono text-white/30 max-w-[280px] mt-2">Select a starter node or formulate your customized query below.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Cognitive RAG logs trajectory */}
                  {msg.thinking && msg.thinking.length > 0 && (
                    <div className="w-full mb-2.5 max-w-[85%] sm:max-w-[70%]">
                      <details className="group border border-white/[0.03] rounded bg-black/40 overflow-hidden">
                        <summary className="flex items-center gap-2 px-3 py-2 text-[9px] font-mono text-white/30 cursor-pointer select-none hover:text-white/50 transition-colors">
                          <Cpu size={10} className="text-red-500/70 group-open:rotate-90 transition-transform" />
                          <span>Cognitive Trace Logs</span>
                        </summary>
                        <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-white/[0.02]">
                          {msg.thinking.map((step, sIdx) => (
                            <div key={sIdx} className="text-[8px] font-mono text-red-500/50 leading-normal flex items-start gap-1.5">
                              <span className="text-red-500/30">❯</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}

                  {/* Tool execution logs */}
                  {msg.toolCall && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded border border-red-500/10 bg-red-500/[0.02] text-[8px] font-mono text-red-400">
                      <Terminal size={9} />
                      <span>EXEC: {msg.toolCall}</span>
                    </div>
                  )}

                  {/* Message Bubble wrapper */}
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white'
                        : 'border border-white/[0.04] text-white/95'
                    }`}
                    style={{
                      background: msg.role === 'user' ? '#ff2800' : 'rgba(12, 12, 12, 0.45)',
                      boxShadow: msg.role === 'user' ? '0 4px 10px rgba(255, 40, 0, 0.12)' : 'none'
                    }}
                  >
                    <div className="prose prose-invert max-w-none text-white">
                      {msg.role === 'assistant' ? (
                        <div className="space-y-1 leading-relaxed">
                          {parseMarkdown(msg.content)}
                        </div>
                      ) : (
                        <p className="font-sans whitespace-pre-line text-xs">{msg.content}</p>
                      )}
                    </div>
                    <span className="block text-right text-[8px] font-mono text-white/30 mt-2">{msg.timestamp}</span>
                  </div>

                  {/* Custom render blocks inline matching RAG tags */}
                  {msg.role === 'assistant' && msg.showProjects && <div className="w-full max-w-[85%] sm:max-w-[70%]"><ProjectGrid /></div>}
                  {msg.role === 'assistant' && msg.showSkills && <div className="w-full max-w-[85%] sm:max-w-[70%]"><SkillsBlock /></div>}
                  {msg.role === 'assistant' && msg.showExperience && <div className="w-full max-w-[85%] sm:max-w-[70%]"><ExperienceTimeline /></div>}
                  {msg.role === 'assistant' && msg.showContact && <div className="w-full max-w-[85%] sm:max-w-[70%]"><ContactPanel /></div>}

                </div>
              ))
            )}

            {/* Typing status spinner loader */}
            {isLoading && (
              <div className="flex items-center gap-2 text-white/30 text-[9px] font-mono pl-1 mt-1">
                <Cpu size={10} className="animate-spin text-red-500" />
                <span>Resolving cognitive graph</span>
                <div className="flex gap-0.5 items-center">
                  <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 bg-red-500 rounded-full" />
                  <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-red-500 rounded-full" />
                  <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-red-500 rounded-full" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick chips suggested starter questions */}
          <div className="px-6 py-2 border-t border-white/[0.03] bg-black/10 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
            {STARTER_QUESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="text-[9px] font-mono whitespace-nowrap bg-white/[0.01] border border-white/[0.05] hover:border-red-500/40 hover:bg-red-500/[0.02] text-white/50 hover:text-white px-2.5 py-1 rounded transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Capsule input text box */}
          <div className="p-6 border-t border-white/5 bg-black/30 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative w-full flex items-center bg-white/[0.02] border border-white/[0.08] hover:border-white/15 focus-within:border-red-500/40 rounded-full px-5 py-2.5 transition-all duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.4)]"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Query agent subroutines..."
                className="flex-1 bg-transparent text-white placeholder-white/25 focus:outline-none text-xs font-mono pr-10"
              />
              <button
                type="submit"
                className="absolute right-2.5 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,40,0,0.3)] cursor-pointer"
              >
                <Send size={11} />
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
