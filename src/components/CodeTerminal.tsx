import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Download, FileText, Upload, X } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

// ─── Types ────────────────────────────────────────────────────────────────────
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CODE_TABS = [
  { name: 'app.tsx', language: 'typescript' },
  { name: 'styles.css', language: 'css' },
  { name: 'config.json', language: 'json' },
];

const CODE_SNIPPETS: Record<string, string> = {
  'app.tsx': `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThreeScene from './components/ThreeScene';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / window.innerHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      <ThreeScene progress={scrollProgress} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to My Portfolio</h1>
      </motion.main>
    </div>
  );
}`,
  'styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #020202;
  color: #ffffff;
  font-family: 'Space Grotesk', sans-serif;
  overflow-x: hidden;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.gradient-text {
  background: linear-gradient(to right, #ffffff, #a1a1aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`,
  'config.json': `{
  "name": "visionary-portfolio",
  "version": "1.0.0",
  "theme": {
    "colors": {
      "primary": "#ffffff",
      "secondary": "#a1a1aa",
      "background": "#020202",
      "accent": "#ff2800"
    },
    "fonts": {
      "heading": "Syne",
      "body": "Space Grotesk"
    }
  },
  "features": {
    "3d": true,
    "animations": true,
    "glassmorphism": true,
    "scrollEffects": true
  }
}`,
};

const STATS = [
  { label: 'COMPONENTS', value: '47', unit: 'files' },
  { label: 'LINES', value: '8.2k', unit: 'loc' },
  { label: 'PERF SCORE', value: '98', unit: '/100' },
  { label: 'BUILD TIME', value: '1.4', unit: 'sec' },
];

// ─── Syntax Highlighter ───────────────────────────────────────────────────────
const KEYWORDS = new Set(['import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'useEffect', 'useState']);
const TYPES = new Set(['string', 'number', 'boolean', 'void', 'any']);

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightSyntax(code: string): string {
  const tokenRe = /(\/\/[^\n]*)|(['"`](?:[^'"`\\]|\\.)*['"`])|([A-Za-z_$][\w$]*)|(\d+\.?\d*)|([^\w\s'"`/])/g;
  let result = '';
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = tokenRe.exec(code)) !== null) {
    if (m.index > lastIndex) result += esc(code.slice(lastIndex, m.index));
    const [full, comment, str, word, num] = m;
    if (comment) {
      result += `<span style="color:#ff2800;opacity:0.4;font-style:italic">${esc(comment)}</span>`;
    } else if (str) {
      result += `<span style="color:#e0e0e0;font-weight:600">${esc(str)}</span>`;
    } else if (word) {
      if (KEYWORDS.has(word)) result += `<span style="color:#ff2800;font-weight:700">${esc(word)}</span>`;
      else if (TYPES.has(word)) result += `<span style="color:#ffffff;font-style:italic">${esc(word)}</span>`;
      else result += esc(word);
    } else if (num) {
      result += `<span style="color:#ff6b35">${esc(num)}</span>`;
    } else {
      result += esc(full);
    }
    lastIndex = m.index + full.length;
  }
  if (lastIndex < code.length) result += esc(code.slice(lastIndex));
  return result;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── File Manager Panel ───────────────────────────────────────────────────────
function FileManagerPanel() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: File[]) => {
    const newFiles: UploadedFile[] = incoming.map(f => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
      type: f.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const f = prev.find(x => x.id === id);
      if (f) URL.revokeObjectURL(f.url);
      return prev.filter(x => x.id !== id);
    });
  };

  const download = (f: UploadedFile) => {
    const a = document.createElement('a');
    a.href = f.url;
    a.download = f.name;
    a.click();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const getIcon = (type: string) => {
    if (type === 'application/pdf') return '📄';
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Drop area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 p-6 flex flex-col items-center gap-3 mb-4 group"
        style={{
          borderColor: dragging ? 'rgba(255,40,0,0.7)' : 'rgba(255,255,255,0.08)',
          background: dragging ? 'rgba(255,40,0,0.05)' : 'rgba(0,0,0,0.3)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => { addFiles(Array.from(e.target.files ?? [])); if (inputRef.current) inputRef.current.value = ''; }}
        />
        <motion.div
          animate={{ y: dragging ? -4 : 0 }}
          className="w-10 h-10 rounded-xl border border-red-500/30 flex items-center justify-center"
          style={{ background: 'rgba(255,40,0,0.08)' }}
        >
          <Upload size={18} className="text-red-500" />
        </motion.div>
        <div className="text-center">
          <p className="text-xs font-semibold text-white/60">
            {dragging ? 'Drop files here' : 'Drop files or click to upload'}
          </p>
          <p className="text-[10px] font-mono text-white/25 mt-1">Resume, PDFs, images & more</p>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {files.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 gap-3"
            >
              <FileText size={28} className="text-white/10" />
              <p className="text-[11px] font-mono text-white/20 text-center">No files uploaded yet.<br />Upload your resume or documents above.</p>
            </motion.div>
          ) : (
            files.map(f => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="group flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] hover:border-red-500/30 transition-all duration-200"
                style={{ background: 'rgba(5,5,5,0.7)' }}
              >
                <span className="text-lg shrink-0">{getIcon(f.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate leading-tight">{f.name}</p>
                  <p className="text-[10px] font-mono text-white/30 mt-0.5">{formatBytes(f.size)}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => download(f)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    title="Download"
                  >
                    <Download size={11} className="text-red-400" />
                  </button>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    title="Remove"
                  >
                    <X size={11} className="text-white/30" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* footer count */}
      {files.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-white/25">
          <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
          <span>{formatBytes(files.reduce((s, f) => s + f.size, 0))} total</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function CodeTerminal() {
  const [activeTab, setActiveTab] = useState('app.tsx');
  const [typedCode, setTypedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tick, setTick] = useState(0);
  const typingRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Typing effect
  useEffect(() => {
    setTypedCode('');
    setIsTyping(true);
    const code = CODE_SNIPPETS[activeTab];
    let idx = 0;
    const type = () => {
      if (idx < code.length) {
        setTypedCode(code.substring(0, idx + 1));
        idx++;
        typingRef.current = setTimeout(type, 8);
      } else {
        setIsTyping(false);
      }
    };
    type();
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [activeTab]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], ['40deg', '0deg']);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.6, 1]);

  const lineCount = typedCode.split('\n').length;
  const colCount = typedCode.split('\n').pop()?.length ?? 0;

  return (
    <section
      ref={sectionRef}
      id="terminal"
      className="relative py-32 px-4 md:px-8 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,40,0,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,40,0,0.6) 1px,transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 60%,rgba(255,40,0,0.07) 0%,transparent 70%)' }}
      />

      <div className="max-w-[120rem] mx-auto relative z-10">
        <SectionHeading
          number="04."
          title="SYSTEM"
          titleHighlight="TERMINAL"
          label="INTERACTIVE TERMINAL"
          className="mb-16"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-paragraph text-secondary text-lg max-w-2xl mx-auto text-center mb-16"
        >
          A glimpse into the development environment. Interactive code editor with syntax highlighting.
        </motion.p>

        <motion.div
          style={{ rotateX, scale, opacity, transformStyle: 'preserve-3d' }}
          className="max-w-6xl mx-auto origin-bottom"
        >
          {/* ── Three-column layout: stats | code editor | file manager ── */}
          <div className="flex flex-col lg:flex-row gap-4">

            {/* ── Left Stats Panel ── */}
            <div className="flex flex-col gap-4 lg:w-52 shrink-0">
              {/* System identity */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden border border-white/5"
                style={{ background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(24px)' }}
              >
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#ff2800,#ff6b35,transparent)' }} />
                <div className="p-5">
                  <p className="text-[10px] font-mono tracking-[0.25em] text-red-500 uppercase mb-1">Dev Node</p>
                  <p className="text-white font-bold text-sm tracking-wider">visionary.local</p>
                  <p className="text-white/30 text-xs font-mono mt-1">Node v20.11.0</p>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff2800]" />
                  <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">LIVE</span>
                </div>
              </motion.div>

              {/* Stat cards */}
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-white/5 p-5 relative overflow-hidden group"
                  style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg,rgba(255,40,0,0.05),transparent)' }} />
                  <p className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase mb-2">{s.label}</p>
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {s.value}<span className="text-xs font-mono text-red-500 ml-1">{s.unit}</span>
                  </p>
                  <div className="mt-3 h-0.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '80%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg,#ff2800,#ff6b35)' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Center Code Editor ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex-1 min-w-0 relative group rounded-2xl overflow-hidden"
            >
              <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'linear-gradient(135deg,rgba(255,40,0,0.25),transparent,rgba(255,107,53,0.15))', filter: 'blur(1px)' }} />

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] h-full flex flex-col"
                style={{ background: 'rgba(4,4,4,0.95)', backdropFilter: 'blur(32px)' }}>
                {/* Title bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]"
                  style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                    <span className="ml-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">CODE_STREAM_V.1.0</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-white/10 p-1"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    {CODE_TABS.map(tab => (
                      <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`px-4 py-1.5 text-xs font-mono rounded-full transition-all duration-300 ${activeTab === tab.name ? 'text-white shadow-[0_0_12px_rgba(255,40,0,0.5)]' : 'text-white/35 hover:text-white/70'}`}
                        style={activeTab === tab.name ? { background: '#ff2800' } : {}}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code body */}
                <div className="relative flex flex-1 overflow-hidden font-mono text-sm leading-6 min-h-[480px] max-h-[560px]">
                  {/* Line numbers */}
                  <div className="select-none shrink-0 flex flex-col items-end pr-4 pl-4 pt-6 border-r border-white/[0.04]"
                    style={{ background: 'rgba(0,0,0,0.2)', minWidth: '3.5rem' }}>
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div key={i} className="h-6 text-xs text-right"
                        style={{ color: i < lineCount ? 'rgba(255,40,0,0.5)' : 'rgba(255,255,255,0.12)' }}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  {/* Code */}
                  <div className="flex-1 overflow-auto p-6 scrollbar-hide">
                    <pre className="whitespace-pre">
                      <code dangerouslySetInnerHTML={{ __html: highlightSyntax(typedCode) }} />
                      {isTyping && (
                        <span className="inline-block align-middle ml-0.5 animate-pulse"
                          style={{ width: '2px', height: '1.1em', backgroundColor: '#ff2800', boxShadow: '0 0 8px #ff2800' }} />
                      )}
                    </pre>
                  </div>
                  {/* Scanline */}
                  <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.06]"
                    style={{ backgroundImage: 'linear-gradient(transparent 50%,rgba(0,0,0,0.4) 50%)', backgroundSize: '100% 4px' }} />
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/[0.05] shrink-0"
                  style={{ background: 'rgba(255,40,0,0.06)' }}>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-red-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ff2800]" />
                      Live_Execution
                    </span>
                    <span className="text-white/25">|</span>
                    <span className="text-white/40">TypeScript  ·  UTF-8</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
                    <span>Ln {lineCount}, Col {colCount}</span>
                    <span className="text-white/15">|</span>
                    <AnimatePresence mode="wait">
                      <motion.span key={tick % 2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500/70">
                        {isTyping ? '↯ streaming...' : '✓ compiled'}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Right File Manager Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-64 shrink-0 rounded-2xl overflow-hidden border border-white/[0.06] flex flex-col"
              style={{ background: 'rgba(4,4,4,0.95)', backdropFilter: 'blur(32px)' }}
            >
              {/* Panel header */}
              <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between shrink-0"
                style={{ background: 'rgba(255,255,255,0.01)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,40,0,0.15)' }}>
                    <FileText size={11} className="text-red-400" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-white/60 uppercase tracking-widest">Files</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-red-400/60 uppercase tracking-widest">vault</span>
                </div>
              </div>

              {/* File manager */}
              <div className="flex-1 p-4 overflow-hidden flex flex-col min-h-[480px]">
                <FileManagerPanel />
              </div>

              {/* Bottom hint */}
              <div className="px-5 py-2.5 border-t border-white/[0.04] shrink-0"
                style={{ background: 'rgba(255,40,0,0.04)' }}>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest text-center">
                  Browser-local · No server upload
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
