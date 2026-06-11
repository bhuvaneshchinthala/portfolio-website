import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Terminal, Cpu, HardDrive, Activity } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string[];
  toolCall?: string;
  timestamp: string;
}

const SUGGESTIONS = [
  { label: '📂 Selected Projects', query: '/projects' },
  { label: '🛠️ Architecture Stack', query: '/tech-stack' },
  { label: '🖥️ Shell Terminal', query: '/terminal-vault' },
  { label: '📨 Direct Pipeline', query: '/contact' },
  { label: '🌐 System Pages', query: '/features' },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "System Initialized. I am ARES, Bhuvanesh's cognitive representative agent. Query my subroutines for technical audits regarding engineering projects, architecture stacks, or communication nodes.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customQuery?: string) => {
    const queryText = customQuery || input;
    if (!queryText.trim() || isLoading) return;

    const userMessage = queryText.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: currentTime }]);
    setIsLoading(true);

    // 1. Try querying the secure Grok API proxy
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
        if (data.content && !data.fallback) {
          const provider = data.provider || 'grok';
          const thinkingSteps = provider === 'gemini'
            ? [
                "Cognitive Router: Directing query to Gemini core routing node.",
                "Model Engine: Processing context graph via gemini-1.5-flash.",
                "Verification Node: Decrypting response token packets."
              ]
            : [
                "Cognitive Router: Directing query to Grok LLM core routing node.",
                "Model Engine: Processing context graph via grok-2.",
                "Verification Node: Decrypting response token packets."
              ];
          
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.content,
              thinking: thinkingSteps,
              toolCall: provider === 'gemini' ? "gemini.generateContent()" : "grok-2.completions()",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            }
          ]);
          setIsLoading(false);
          return;
        } else if (data.fallback) {
          // Key missing on server - add warning message
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: "### System Diagnostic Alert\n\nNeither `GEMINI_API_KEY` nor `GROK_API_KEY` environment variables are loaded by the dev server. \n\n**Action Required**: Add a `GEMINI_API_KEY` (Free) or `GROK_API_KEY` (Paid) to your `.env` file, then stop your server (`Ctrl + C`) and start it again with `npm run dev` to load the variables.\n\nRunning offline fallback subroutines...",
              thinking: ["Diagnostic Node: API Key check returned NULL.", "Planner Agent: Initializing offline search loop."],
              toolCall: "system.diagnostic_warning()",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            }
          ]);
          setIsLoading(false);
          return;
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `### System Diagnostic Alert\n\nAPI Server returned status **${res.status}**:\n\n*   **Error**: \`${errorData.error || res.statusText}\`\n*   **Details**: \`${errorData.details || 'No additional details provided.'}\`\n\nRunning offline fallback subroutines...`,
            thinking: ["Diagnostic Node: API request failed.", `Log: Server returned status ${res.status}.`],
            toolCall: "system.server_error()",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }
        ]);
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      console.warn("Grok API endpoint unreachable. Initiating local fallback subroutine...", err);
    }

    // 2. Fallback offline simulated database loop
    setTimeout(() => {
      let thinkingSteps: string[] = [];
      let responseContent = "";
      let toolCalled = "";
      const msgLower = userMessage.toLowerCase();

      if (msgLower.includes('project') || msgLower.includes('work') || msgLower.includes('build') || msgLower.includes('experience') || msgLower === '/projects') {
        toolCalled = "database.query('projects_metadata')";
        thinkingSteps = [
          "Cognitive Router: Directing query to projects database.",
          "Planner Agent: Compiling performance parameters and core methodologies.",
          "Tool Executor: Invoked database.query('projects_metadata') [Latency: 8ms].",
          "Verification Node: Structuring output specs and checking pipeline completeness."
        ];
        responseContent = "### Auditing Bhuvanesh's Core Research & AI Systems:\n\n" +
          "**1. SPAR3D (3D Computer Vision)**\n" +
          "*   *Architecture*: PyTorch, Single-view mesh reconstruction model.\n" +
          "*   *Specs*: Reconstructs 3D assets in <120ms with 98.4% IoU accuracy.\n\n" +
          "**2. VoltAI (AI Smart Grid)**\n" +
          "*   *Architecture*: Multi-agent control model via Mistral & local Ollama instances.\n" +
          "*   *Specs*: Maintains 99.8% voltage stability index on standard IEEE bus grids.\n\n" +
          "**3. Multi-Agent RAG System**\n" +
          "*   *Architecture*: Modular framework utilizing Mistral & ChromaDB vector engines.\n" +
          "*   *Specs*: Features 6 concurrent agents (Router, Ingestor, Query Planner, Refiner, Validator, Writer).\n\n" +
          "**4. RoboPick System**\n" +
          "*   *Architecture*: Real-time YOLOv5 model integrated with industrial pick-and-place robotic arm.\n\n" +
          "**5. MRI Segmenter & NLP**\n" +
          "*   *Architecture*: 3D UNet MRI segmentation and Telugu dialect style transfer models.";
      } else if (msgLower.includes('tech') || msgLower.includes('stack') || msgLower.includes('framework') || msgLower.includes('libraries') || msgLower.includes('built') || msgLower === '/tech-stack') {
        toolCalled = "system.inspect('dependencies')";
        thinkingSteps = [
          "Cognitive Router: Parsing repository configuration files.",
          "Tool Executor: Invoked system.inspect('dependencies') [Latency: 4ms].",
          "Planner Agent: Identifying core layout renderers and visual systems."
        ];
        responseContent = "### System Dependency Audit:\n\n" +
          "*   **Core Compiler**: Astro 5.0 (Static Site Generation / serverless edge runtime ready).\n" +
          "*   **Layout Engine**: React 19 (Client-side hydration utilizing `client:only` triggers).\n" +
          "*   **Visual pipeline**: GSAP (GreenSock) for high-performance timeline scrolling, and Framer Motion for micro-state transitions.\n" +
          "*   **Scrolling Sync**: Lenis Scroll synchronizer to prevent layout shifting on heavy scroll sequences.\n" +
          "*   **Styling System**: Tailwind CSS v4 featuring native CSS variables configuration.\n" +
          "*   **Aesthetics**: `<FuturisticCursor />` plasma energy trailing, organic matrix overlays, and high-frequency grid templates.";
      } else if (msgLower.includes('terminal') || msgLower.includes('code') || msgLower.includes('vault') || msgLower === '/terminal-vault') {
        toolCalled = "system.query('code_terminal_features')";
        thinkingSteps = [
          "Cognitive Router: Querying custom homepage subroutines.",
          "Tool Executor: Invoked system.query('code_terminal_features') [Latency: 11ms]."
        ];
        responseContent = "### Component Audit: Code Terminal\n\n" +
          "The interactive terminal is a customized client-side UNIX simulation with several advanced layers:\n\n" +
          "1.  **Command Buffer**: Direct CLI inputs supporting basic file queries.\n" +
          "2.  **File Vault**: Navigable, encrypted tree structure showing the website's component hierarchy.\n" +
          "3.  **Highlighter**: Renders source files line-by-line using custom canvas rendering delays.\n" +
          "4.  **Local Storage Sync**: Direct bridge allowing code snippets to be downloaded onto your machine.";
      } else if (msgLower.includes('cbum') || msgLower.includes('chris') || msgLower.includes('bumstead')) {
        toolCalled = "system.route('/cbum')";
        thinkingSteps = [
          "Cognitive Router: Scanning sub-routes for CBUM layout configs.",
          "Tool Executor: Invoked system.route('/cbum') [Latency: 7ms]."
        ];
        responseContent = "### Sub-Page Profile: /cbum\n\n" +
          "A dedicated visual tribute page focusing on high-density motion design:\n\n" +
          "*   **Visual Palette**: High-contrast, dark-mode layouts highlighting brand Ferrari Red (`#ff2800`).\n" +
          "*   **Grids**: Overlapping CSS grid assemblies with GSAP parallax triggers.\n" +
          "*   **Dynamic Quotes**: State-based random selector displaying inspirational athlete transcripts.";
      } else if (msgLower.includes('contact') || msgLower.includes('email') || msgLower.includes('message') || msgLower.includes('social') || msgLower === '/contact') {
        toolCalled = "system.get('comms_endpoints')";
        thinkingSteps = [
          "Cognitive Router: Verifying communication tunnels.",
          "Tool Executor: Invoked system.get('comms_endpoints') [Latency: 3ms]."
        ];
        responseContent = "### Comms Subsystem Routing:\n\n" +
          "*   **Active Gateway**: Submit a query using the Contact form at the footer of the home page.\n" +
          "*   **GitHub Nodes**: Review active repositories at [github.com/chinthalasathwik](https://github.com/chinthalasathwik).\n" +
          "*   **LinkedIn Pipeline**: Professional networking via Bhuvanesh Chinthala.\n" +
          "*   **Secure Email**: Direct electronic routing (response within 24 standard cycles).";
      } else if (msgLower.includes('page') || msgLower.includes('feature') || msgLower.includes('route') || msgLower.includes('website') || msgLower.includes('things') || msgLower.includes('everything') || msgLower === '/features') {
        toolCalled = "system.map('pages')";
        thinkingSteps = [
          "Cognitive Router: Scanning active Astro page manifests.",
          "Tool Executor: Invoked system.map('pages') [Latency: 5ms]."
        ];
        responseContent = "### Site Architecture Map:\n\n" +
          "•   **Home Page (`/`)**: Main entrypoint containing the interactive terminal, selected projects, and contact gateways.\n" +
          "•   **About Page (`/about-me`)**: Detailed dossier highlighting Bhuvanesh's deep learning, computer vision, and academic credentials.\n" +
          "•   **Tribute Page (`/cbum`)**: Motion-heavy bodybuilding design showcase.\n" +
          "•   **System Board (`/system`)**: Subsystem simulating memory logs and terminal output sequences.\n" +
          "•   **PDF Viewer (`/pdf-viewer`)**: Document reader view for scientific paper reviews.";
      } else if (msgLower.includes('who') || msgLower.includes('bhuvanesh') || msgLower.includes('about')) {
        toolCalled = "system.query('engineer_biography')";
        thinkingSteps = [
          "Cognitive Router: Querying profile records.",
          "Tool Executor: Invoked system.query('engineer_biography') [Latency: 9ms]."
        ];
        responseContent = "### Biography Audit:\n\n" +
          "**Bhuvanesh Chinthala** is an AI & Computer Vision Research Engineer. His focus areas include:\n\n" +
          "*   **Edge AI**: Optimization of CNNs and Transformer models on low-power processing units (Jetson Orin).\n" +
          "*   **Deep Learning Acceleration**: Quantization, pruning, and low-latency tensor compilers.\n" +
          "*   **Cognitive Networks**: Designing multi-agent orchestrations and RAG pipelines.\n\n" +
          "Review the complete portfolio by navigating to the `/about-me` page.";
      } else {
        thinkingSteps = [
          "Cognitive Router: Processing general query.",
          "Planner Agent: Intent unmatched. Formulating fallback navigation route."
        ];
        responseContent = "### Query Intent Unmatched\n\n" +
          "The query did not map to a standard tool path. Select one of the parameters below for details:\n\n" +
          "*   Type **`projects`** to review AI systems.\n" +
          "*   Type **`tech stack`** to list framework layers.\n" +
          "*   Type **`terminal`** to inspect the interactive command terminal.\n" +
          "*   Type **`contact`** to open the messaging routes.";
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: responseContent,
          thinking: thinkingSteps,
          toolCall: toolCalled,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }
      ]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Chat Trigger with Red Plasma Glow */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-full bg-black border border-red-500/30 flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(255,40,0,0.15)] hover:shadow-[0_0_35px_rgba(255,40,0,0.4)] transition-all duration-300"
        >
          {/* Inner breathing glow */}
          <div className="absolute inset-0 rounded-full bg-red-500/5 animate-pulse pointer-events-none" />
          <MessageSquare className="text-red-500 w-5 h-5" />
        </motion.button>
      </div>

      {/* Slide-in Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[440px] h-[640px] rounded-xl border border-white/[0.06] shadow-2xl flex flex-col z-[9999] overflow-hidden"
            style={{
              background: 'rgba(7, 7, 7, 0.98)',
              backdropFilter: 'blur(35px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 1px rgba(255,40,0,0.15)'
            }}
          >
            {/* Advanced Status Telemetry Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-red-500/5 border border-red-500/20 flex items-center justify-center">
                    <Bot size={14} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-[0.15em] text-white">ARES // COGNITIVE_NODE</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-mono text-emerald-500/80 tracking-widest uppercase">ACTIVE</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors p-1">
                  <X size={16} />
                </button>
              </div>

              {/* Live Telemetry Panel */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[8px] font-mono text-white/40 tracking-wider">
                <div className="flex items-center gap-1 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.02]">
                  <Activity size={8} className="text-red-500" />
                  <span>LATENCY: 28ms</span>
                </div>
                <div className="flex items-center gap-1 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.02]">
                  <HardDrive size={8} className="text-red-500" />
                  <span>CORE: 4.2G/8G</span>
                </div>
                <div className="flex items-center gap-1 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.02]">
                  <Terminal size={8} className="text-red-500" />
                  <span>AGENTS: 6/6</span>
                </div>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Cognitive Trajectory log timeline */}
                  {msg.thinking && msg.thinking.length > 0 && (
                    <div className="w-full mb-2.5 max-w-[90%]">
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

                  {/* Tool Call Log */}
                  {msg.toolCall && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded border border-red-500/10 bg-red-500/[0.02] text-[8px] font-mono text-red-400">
                      <Terminal size={9} />
                      <span>EXEC: {msg.toolCall}</span>
                    </div>
                  )}

                  {/* Chat message envelope */}
                  <div
                    className={`max-w-[90%] rounded px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white'
                        : 'border border-white/[0.04] text-white/90'
                    }`}
                    style={{
                      background: msg.role === 'user' ? '#ff2800' : 'rgba(12,12,12,0.4)',
                      boxShadow: msg.role === 'user' ? '0 4px 10px rgba(255,40,0,0.12)' : 'none'
                    }}
                  >
                    <div className="font-sans prose prose-invert max-w-none text-[11px] md:text-xs text-white/95">
                      {msg.role === 'assistant' ? (
                        <div className="space-y-2">
                          {msg.content.split('\n\n').map((paragraph, pIdx) => {
                            if (paragraph.startsWith('###')) {
                              return <h4 key={pIdx} className="text-xs font-mono font-bold tracking-[0.1em] text-red-500 mt-2 uppercase">{paragraph.replace('###', '').trim()}</h4>;
                            }
                            return <p key={pIdx} className="whitespace-pre-line font-mono font-light tracking-wide">{paragraph}</p>;
                          })}
                        </div>
                      ) : (
                        <p className="font-sans whitespace-pre-line">{msg.content}</p>
                      )}
                    </div>
                    <span className="block text-right text-[8px] font-mono text-white/30 mt-1.5">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-white/30 text-[10px] font-mono">
                  <Cpu size={10} className="animate-spin text-red-500" />
                  <span>Resolving cognitive graph...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* suggestion quick chips */}
            <div className="px-4 py-2 border-t border-white/[0.03] bg-black/20 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
              {SUGGESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="text-[9px] font-mono whitespace-nowrap bg-white/[0.02] border border-white/[0.05] hover:border-red-500/40 hover:bg-red-500/[0.02] text-white/50 hover:text-white px-2.5 py-1 rounded transition-all cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-white/[0.06] bg-black/40 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Query agent subroutines..."
                className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 transition-colors font-mono"
              />
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 rounded bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white shadow-[0_0_10px_rgba(255,40,0,0.15)] cursor-pointer"
              >
                <Send size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
