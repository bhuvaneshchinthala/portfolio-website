import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bot, MessageCircle, X, Sparkles, ArrowRight, 
  Send, ArrowUpRight, Loader2, Maximize2, Terminal, Info 
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTIONS = [
  { label: 'Who is Bhuvanesh?', query: 'Give me a 10-second introduction.' },
  { label: 'Show his projects', query: 'What projects has he built?' },
  { label: 'What are his tech skills?', query: 'What are his AI & tech skills?' },
  { label: 'How to contact him?', query: 'How can I contact him?' }
];

const SIMULATED_STEPS = [
  "Cognitive Router: Directing query to Gemini core node.",
  "Vector Store: Matching query against knowledge index.",
  "Model Engine: Processing context graph via Gemini.",
  "Response Node: Finalizing semantic token packets."
];

// Inline Markdown Parser
function parseInlineStyles(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(<strong key={`b-${match.index}`} className="font-bold text-white">{match[2]}</strong>);
    } else if (match[3]) {
      nodes.push(<em key={`i-${match.index}`} className="italic text-white/80">{match[3]}</em>);
    } else if (match[4]) {
      nodes.push(
        <code key={`c-${match.index}`} className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[9.5px] font-mono text-[#ff4422]">
          {match[4]}
        </code>
      );
    } else if (match[5] && match[6]) {
      nodes.push(
        <a key={`a-${match.index}`} href={match[6]} target="_blank" rel="noreferrer" className="underline underline-offset-2 text-red-400 hover:text-red-300 transition-colors">
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

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
        <div key={`code-${i}`} className="my-2 rounded border border-white/10 bg-black/60 overflow-hidden w-full">
          {lang && (
            <div className="px-3 py-1 text-[7px] font-mono text-white/30 border-b border-white/5 uppercase tracking-widest bg-white/[0.02]">
              {lang}
            </div>
          )}
          <pre className="px-3 py-2 text-[9.5px] font-mono text-white/75 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {codeLines.join('\n')}
          </pre>
        </div>
      );
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-[10px] font-bold text-white tracking-wider uppercase mt-2 mb-1 font-mono">
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

    if (/^\s*[\*\-]\s+/.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^\s*[\*\-]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*[\*\-]\s+/, '');
        listItems.push(
          <li key={`li-${i}`} className="flex items-start gap-1.5 text-[11px] text-white/80 leading-relaxed">
            <span className="text-red-500/50 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-red-500" />
            <span>{parseInlineStyles(itemText)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-1 pl-1 w-full">
          {listItems}
        </ul>
      );
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="text-[11px] text-white/80 leading-relaxed my-1 w-full whitespace-pre-wrap">
        {parseInlineStyles(line)}
      </p>
    );
    i++;
  }

  return elements;
}

export default function ChatBot() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hey! I'm Bhuvanesh's AI assistant. Ask me anything about his projects, skills, or experience!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Show the welcome toast after 2.5 seconds on first visit
  useEffect(() => {
    if (location.pathname === '/chat') return;
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [location.pathname]);



  // Hide tooltip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setTooltipVisible(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll to bottom when messages or loading states change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Listen for the custom "open-chatbot" event (e.g. from Hero input bar)
  useEffect(() => {
    const handleOpenChatbot = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>;
      const query = customEvent.detail?.query || '';
      
      setIsOpen(true);
      setShowToast(false);
      setToastDismissed(true);
      setTooltipVisible(false);
      
      if (query.trim()) {
        handleSendQuery(query.trim());
      }
    };

    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  // Hide entirely on the full chat page itself
  if (location.pathname === '/chat') return null;

  const handleSendQuery = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messagesRef.current, userMsg];
    setMessages(updatedMessages);
    setChatInput('');
    setIsLoading(true);
    setThinkingSteps([]);
    setActiveStepIndex(0);

    // Simulate thinking steps locally
    const stepIntervals: ReturnType<typeof setTimeout>[] = [];
    SIMULATED_STEPS.forEach((step, idx) => {
      const t = setTimeout(() => {
        setThinkingSteps(prev => [...prev, step]);
        setActiveStepIndex(idx + 1);
      }, (idx + 1) * 500);
      stepIntervals.push(t);
    });

    try {
      // Sliding window of last 20 messages to match backend limits
      const recentMessages = updatedMessages.slice(-20);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      // Clear the timeouts if we finish early or error out
      stepIntervals.forEach(clearTimeout);

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.content,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsLoading(false);
          return;
        }
      }
      throw new Error("Handshake failure");
    } catch (err) {
      stepIntervals.forEach(clearTimeout);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "### Subroutine Network Failure\n\nCould not establish connection to the backend cognitive routing pipeline. Running offline diagnostic fallback.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsLoading(false);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    handleSendQuery(chatInput.trim());
  };

  const handleToggleOpen = () => {
    setShowToast(false);
    setToastDismissed(true);
    setTooltipVisible(false);
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {/* CSS Keyframe animations for background pulses and pings */}
      <style>{`
        @keyframes radar-ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes radar-ping-delay {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .radar-ring-1 {
          animation: radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .radar-ring-2 {
          animation: radar-ping-delay 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          animation-delay: 0.5s;
        }
        @keyframes fab-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .thin-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 40, 0, 0.2);
          border-radius: 99px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 40, 0, 0.4);
        }
      `}</style>

      {/* ─── Welcome Toast Notification ─── */}
      <AnimatePresence>
        {showToast && !toastDismissed && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-6 z-[10000] max-w-[300px] cursor-pointer"
            onClick={handleToggleOpen}
          >
            <div className="relative bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_40px_rgba(255,40,0,0.15),0_0_0_1px_rgba(255,255,255,0.05)]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowToast(false);
                  setToastDismissed(true);
                }}
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={10} />
              </button>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Bot size={18} className="text-red-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-bold text-white tracking-wide">BHUV AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider">Online</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    👋 Hey! I'm Bhuvanesh's AI assistant. Ask me anything about his projects, skills, or experience!
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[9px] font-mono text-red-400 tracking-wider uppercase">
                    <span>Start chatting</span>
                    <ArrowRight size={9} />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#0a0a0a]/95 border-b border-r border-white/10 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating Chat Drawer Overlay ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="fixed bottom-6 right-6 z-[10001] w-[calc(100vw-32px)] md:w-[385px] h-[520px] rounded-2xl overflow-hidden flex flex-col bg-[#050505]/95 border border-white/10 shadow-[0_20px_50px_rgba(255,40,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="relative px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-red-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-black animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider font-orbitron text-white">BHUVAI // COGNITIVE</span>
                  </div>
                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none mt-0.5">Vector Store Active</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Maximize to full dashboard page */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/chat');
                  }}
                  title="Open Full Dashboard"
                  className="w-7 h-7 rounded-md flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <Maximize2 size={12} />
                </button>
                {/* Close Drawer */}
                <button
                  onClick={handleToggleOpen}
                  title="Close Assistant"
                  className="w-7 h-7 rounded-md flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            </div>

            {/* Conversation Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 thin-scrollbar bg-black/40">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Icon */}
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] border mt-0.5 ${
                      msg.role === 'user' 
                        ? 'bg-white/5 border-white/10 text-white/70' 
                        : 'bg-red-500/10 border-red-500/25 text-red-400'
                    }`}>
                      {msg.role === 'user' ? 'U' : <Bot size={11} />}
                    </div>

                    {/* Bubble Content */}
                    <div className="flex flex-col">
                      <div className={`rounded-xl px-3.5 py-2.5 text-[11px] leading-relaxed shadow-sm border ${
                        msg.role === 'user'
                          ? 'bg-[#0f0f0f] border-white/5 text-white'
                          : 'bg-[#0a0a0a] border-white/10 text-white/90'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          parseMarkdown(msg.content)
                        )}
                      </div>
                      <span className="text-[7.5px] font-mono text-white/20 mt-1 self-end px-1">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dynamic Simulated Thinking Steps */}
              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-red-500/10 border border-red-500/25 text-red-400">
                      <Bot size={11} className="animate-spin" />
                    </div>

                    <div className="flex flex-col w-full">
                      <div className="rounded-xl px-3.5 py-3 bg-[#0a0a0a] border border-red-500/20 text-white/90 w-full shadow-[0_0_15px_rgba(255,40,0,0.05)]">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-[#ff4422] mb-2 uppercase tracking-wider">
                          <Loader2 size={10} className="animate-spin" />
                          <span>AI Node Thinking</span>
                        </div>
                        
                        {/* Thinking Log Trace */}
                        <div className="space-y-1 border-l border-white/5 pl-2 font-mono text-[8px] text-white/40">
                          {thinkingSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="text-red-500/50">✔</span>
                              <span>{step}</span>
                            </div>
                          ))}
                          {activeStepIndex >= 0 && activeStepIndex < SIMULATED_STEPS.length && (
                            <div className="flex items-center gap-1.5 text-white/60 animate-pulse">
                              <span className="text-[#ff4422]">&gt;</span>
                              <span>{SIMULATED_STEPS[activeStepIndex]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions when history is empty or short */}
              {messages.length === 1 && !isLoading && (
                <div className="pt-2">
                  <div className="flex items-center gap-1 text-[8px] font-mono text-white/35 uppercase tracking-widest mb-2 pl-1">
                    <Info size={9} />
                    <span>Quick Access Queries</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendQuery(item.query)}
                        className="p-2.5 text-left bg-white/[0.01] hover:bg-red-500/[0.03] border border-white/5 hover:border-red-500/30 rounded-lg text-white/60 hover:text-white transition-all cursor-pointer group"
                      >
                        <div className="text-[9.5px] font-semibold text-white/80 group-hover:text-red-400 transition-colors">{item.label}</div>
                        <div className="flex items-center gap-0.5 mt-1 text-[7.5px] font-mono text-white/35 tracking-wider uppercase">
                          <span>Query</span>
                          <ArrowUpRight size={8} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <div className="p-3 border-t border-white/10 bg-white/[0.01] relative">
              <form 
                onSubmit={handleInputSubmit}
                className="relative flex items-center w-full h-11 bg-black/60 border border-white/10 focus-within:border-red-500/30 rounded-lg overflow-hidden transition-colors"
              >
                {/* Left Terminal Marker */}
                <div className="pl-3 pr-1.5 flex items-center justify-center pointer-events-none text-white/30 font-mono text-[10px]">
                  <Terminal size={10} className="text-[#ff4422]" />
                </div>
                
                {/* Input text */}
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={isLoading ? "Bhuvi AI is thinking..." : "Ask me anything..."}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-white/90 text-[11px] font-mono placeholder:text-white/20 outline-none h-full pr-10"
                  autoComplete="off"
                  spellCheck="false"
                />

                {/* Blinking block cursor when empty */}
                {!chatInput && !isLoading && (
                  <div className="absolute left-[28px] top-1/2 -translate-y-1/2 w-1.5 h-3 bg-[#ff4422] animate-pulse opacity-60 pointer-events-none" />
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || !chatInput.trim()}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7.5 h-7.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                    chatInput.trim() && !isLoading
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' 
                      : 'text-white/20 cursor-not-allowed border border-transparent'
                  }`}
                >
                  <Send size={11} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Floating Button ─── */}
      <div className="fixed bottom-7 right-7 z-[9999]">
        {/* Persistent Label Tooltip */}
        <AnimatePresence>
          {tooltipVisible && !showToast && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
            >
              <div className="bg-[#0c0c0c]/90 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
                <Sparkles size={10} className="text-red-400 animate-pulse" />
                <span className="text-[10px] font-mono text-white/70 tracking-wider uppercase">
                  Chat with AI
                </span>
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0c0c0c]/90 border-r border-t border-white/10 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Radar Pulse Rings */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[60px] h-[60px] rounded-full border border-red-500/30 radar-ring-1" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[60px] h-[60px] rounded-full border border-orange-500/20 radar-ring-2" />
            </div>
          </>
        )}

        {/* The Button */}
        <motion.button
          onClick={handleToggleOpen}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.8 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer group"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)',
            boxShadow: isOpen 
              ? '0 0 30px rgba(255,40,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 0 25px rgba(255,40,0,0.2), 0 0 60px rgba(255,40,0,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            border: isOpen ? '1.5px solid rgba(255,60,0,0.6)' : '1.5px solid rgba(255,60,0,0.35)',
          }}
        >
          {/* Spinning outer dashed ring */}
          <svg
            className="absolute inset-[-4px] w-[68px] h-[68px] pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50" cy="50" r="48"
              stroke="url(#fab-grad)" strokeWidth="1" fill="none"
              strokeDasharray="12 8 20 6 8 14"
              className="origin-center"
              style={{ animation: 'fab-spin 12s linear infinite' }}
            />
            <defs>
              <linearGradient id="fab-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff5722" />
                <stop offset="50%" stopColor="#ff2800" />
                <stop offset="100%" stopColor="#d84315" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner glow pulse */}
          <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-red-500/10 to-orange-600/5 animate-pulse pointer-events-none" />

          {/* Chat Icon / Close Icon */}
          <div className="relative z-10 flex items-center justify-center">
            {isOpen ? (
              <X
                size={22}
                className="text-white group-hover:text-red-400 transition-colors duration-300"
                strokeWidth={2}
              />
            ) : (
              <MessageCircle
                size={22}
                className="text-white group-hover:text-red-400 transition-colors duration-300"
                strokeWidth={2}
              />
            )}
            {/* Sparkle micro-icon */}
            <Sparkles
              size={9}
              className="absolute -top-1.5 -right-1.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Active status dot */}
          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          )}
        </motion.button>
      </div>
    </>
  );
}
