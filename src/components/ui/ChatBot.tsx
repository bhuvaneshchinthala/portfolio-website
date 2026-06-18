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
  { label: '👤 About Bhuvanesh', query: 'Tell me about Bhuvanesh' },
  { label: '📂 Selected Projects', query: 'What projects has he built?' },
  { label: '🛠️ AI & Tech Skills', query: 'What are his AI skills?' },
  { label: '💼 Work Experience', query: 'Show his experience' },
  { label: '📨 Initialize Contact', query: 'How can I contact him?' },
  { label: '📄 Download Resume', query: '/resume' }
];

// Inline Markdown Parser for premium formatting
function parseInlineStyles(text: string): React.ReactNode[] {
  const tokens: { type: 'text' | 'link' | 'bold' | 'code'; content: string; url?: string }[] = [];
  let lastIdx = 0;
  
  // Regex capturing bold **text**, inline `code`, and links [text](url)
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

const parseMarkdown = (text: string) => {
  return text.split('\n\n').map((para, pIdx) => {
    // Heading Level 3 or 4
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

    // Unordered lists
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
          {firstItem && <p className="font-mono font-light tracking-wide mb-1 text-white/90 text-[11px] md:text-xs">{parseInlineStyles(firstItem)}</p>}
          <ul className="list-disc pl-5 font-mono font-light tracking-wide text-white/80 space-y-1 my-1 text-[10px] md:text-[11px]">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineStyles(item)}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <p key={pIdx} className="whitespace-pre-line font-mono font-light tracking-wide mb-2 text-white/90 text-[11px] md:text-xs">
        {parseInlineStyles(para)}
      </p>
    );
  });
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "System online. I am ARES, Bhuvanesh's AI Representative. Ask me about his biography, machine learning projects, skills, education, experience, or query the local system for his resume.",
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

    // Intercept Resume download query
    if (userMessage.toLowerCase() === '/resume' || userMessage.toLowerCase().includes('download resume')) {
      setTimeout(() => {
        // Trigger actual download of the public PDF
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
            content: "### Resume Download Triggered\n\nI have successfully initiated the secure local download pipeline for Bhuvanesh's resume.\n\n*   **Filename**: `Bhuvanesh_Chinthala_Resume.pdf`\n*   **Format**: `PDF (Scientific & Research Format)`\n*   **Status**: `Completed` (Verify your downloads directory)\n\nIf the download did not start automatically, you can [click here to download directly](/bhuvanesh_resume.pdf) or navigate to the [/pdf-viewer](/pdf-viewer) route to read his scientific documents.",
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
      }, 800);
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
        if (data.content && !data.fallback) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.content,
              thinking: data.thinking || [
                "Cognitive Router: Directing query to Gemini core routing node.",
                "Model Engine: Processing context graph via gemini-1.5-flash.",
                "Verification Node: Decrypting response token packets."
              ],
              toolCall: data.toolCall || "gemini.generateContent()",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            }
          ]);
          setIsLoading(false);
          return;
        } else if (data.fallback) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: "### System Offline Alert\n\nNo active `GEMINI_API_KEY` was found in the environment configurations.\n\n**Action Required**: Configure your Gemini API key in the `.env` file, then reboot the development server.",
              thinking: ["Diagnostic Node: Key verification returned NULL.", "Planner Agent: Offline fallback loop initialized."],
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
            content: `### System Diagnostic Alert\n\nThe server API returned status **${res.status}**:\n\n*   **Error**: \`${errorData.error || res.statusText}\`\n*   **Details**: \`${errorData.details || 'No additional details.'}\`\n\nPlease verify your network and Gemini API key config.`,
            thinking: ["Diagnostic Node: API request failed.", `Log: Server returned status ${res.status}.`],
            toolCall: "system.server_error()",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }
        ]);
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("API endpoint error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "### Subroutine Network Failure\n\nCould not establish connection to the backend cognitive routing pipeline. \n\n*   Please check if the local server is running.\n*   Check if your internet connection is active.",
          thinking: ["Network Router: Failed to handshake with backend server.", "Diagnostic Node: Connection timed out."],
          toolCall: "network.handshake_fail()",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }
      ]);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger button with breathing Red Halo Glow */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-full bg-black border border-red-500/30 flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(255,40,0,0.15)] hover:shadow-[0_0_35px_rgba(255,40,0,0.4)] transition-all duration-300"
        >
          {/* Breathing aura */}
          <div className="absolute inset-0 rounded-full bg-red-500/5 animate-pulse pointer-events-none" />
          <MessageSquare className="text-red-500 w-5 h-5" />
        </motion.button>
      </div>

      {/* Futuristic slide-in Glassmorphic Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[440px] h-[640px] rounded-xl border border-white/[0.06] shadow-2xl flex flex-col z-[9999] overflow-hidden"
            style={{
              background: 'rgba(7, 7, 7, 0.96)',
              backdropFilter: 'blur(35px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 1px rgba(255,40,0,0.2)'
            }}
          >
            {/* HUD Header with live system telemetry status */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01] flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-red-500/5 border border-red-500/20 flex items-center justify-center">
                    <Bot size={14} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-[0.15em] text-white">ARES // COGNITIVE_NODE</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-mono text-emerald-500/80 tracking-widest uppercase">ACTIVE // RAG_SECURED</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors p-1 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Live telemetry metadata stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[8px] font-mono text-white/40 tracking-wider">
                <div className="flex items-center gap-1 bg-white/[0.01] px-2 py-1 rounded border border-white/[0.02]">
                  <Activity size={8} className="text-red-500" />
                  <span>LATENCY: ~240ms</span>
                </div>
                <div className="flex items-center gap-1 bg-white/[0.01] px-2 py-1 rounded border border-white/[0.02]">
                  <HardDrive size={8} className="text-red-500" />
                  <span>COMPUTE: EDGE</span>
                </div>
                <div className="flex items-center gap-1 bg-white/[0.01] px-2 py-1 rounded border border-white/[0.02]">
                  <Terminal size={8} className="text-red-500" />
                  <span>VECTORS: ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Chat Messages Stream Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Cognitive RAG Trajectory expander logs */}
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

                  {/* Executed RAG database tool trace */}
                  {msg.toolCall && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded border border-red-500/10 bg-red-500/[0.02] text-[8px] font-mono text-red-400">
                      <Terminal size={9} />
                      <span>EXEC: {msg.toolCall}</span>
                    </div>
                  )}

                  {/* Message Bubble wrapper */}
                  <div
                    className={`max-w-[90%] rounded px-3.5 py-2.5 text-xs leading-relaxed ${
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
                        <p className="font-sans whitespace-pre-line text-[11px] md:text-xs">{msg.content}</p>
                      )}
                    </div>
                    <span className="block text-right text-[8px] font-mono text-white/30 mt-1.5">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* Typing loader indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-white/30 text-[10px] font-mono mt-1 pl-1">
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
            <div className="px-4 py-2 border-t border-white/[0.03] bg-black/20 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
              {SUGGESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="text-[9px] font-mono whitespace-nowrap bg-white/[0.01] border border-white/[0.05] hover:border-red-500/40 hover:bg-red-500/[0.02] text-white/50 hover:text-white px-2.5 py-1 rounded transition-all cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Message input prompt box */}
            <div className="p-4 border-t border-white/[0.06] bg-black/40 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Bhuvanesh's AI assistant..."
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
