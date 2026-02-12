import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

export default function CodeTerminal() {
  const [activeTab, setActiveTab] = useState('app.tsx');
  const [typedCode, setTypedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout>();

  const tabs = [
    { name: 'app.tsx', language: 'typescript' },
    { name: 'styles.css', language: 'css' },
    { name: 'config.json', language: 'json' },
  ];

  const codeSnippets: Record<string, string> = {
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
        <h1>Welcome to Nebula</h1>
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
  "name": "nebula-portfolio",
  "version": "1.0.0",
  "theme": {
    "colors": {
      "primary": "#ffffff",
      "secondary": "#a1a1aa",
      "background": "#020202",
      "overlay": "rgba(255, 255, 255, 0.02)"
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

  useEffect(() => {
    setTypedCode('');
    setIsTyping(true);

    const code = codeSnippets[activeTab];
    let currentIndex = 0;

    const typeCode = () => {
      if (currentIndex < code.length) {
        setTypedCode(code.substring(0, currentIndex + 1));
        currentIndex++;
        typingRef.current = setTimeout(typeCode, 10);
      } else {
        setIsTyping(false);
      }
    };

    typeCode();

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [activeTab]);

  const highlightSyntax = (code: string, language: string) => {
    const keywords = ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'useEffect', 'useState'];
    const types = ['string', 'number', 'boolean', 'void', 'any'];
    
    let highlighted = code;

    // Highlight strings
    highlighted = highlighted.replace(/(['"`])(.*?)\1/g, '<span class="text-[#ce9178]">$1$2$1</span>');

    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-[#569cd6]">${keyword}</span>`);
    });

    // Highlight types
    types.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-[#4ec9b0]">${type}</span>`);
    });

    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-[#6a9955]">$1</span>');

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-[#b5cea8]">$1</span>');

    return highlighted;
  };

  return (
    <section id="terminal" className="relative py-32 px-8">
      <div className="max-w-[120rem] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-light-gray bg-clip-text text-transparent">
            Code Terminal
          </h2>
          <p className="font-paragraph text-secondary text-lg max-w-2xl mx-auto">
            A glimpse into the development environment. Interactive code editor with syntax highlighting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Terminal Window */}
          <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#333333] shadow-2xl">
            {/* Title Bar */}
            <div className="bg-[#323233] px-4 py-3 flex items-center justify-between border-b border-[#333333]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="font-paragraph text-xs text-[#cccccc]">
                Visual Studio Code
              </div>
              <div className="flex items-center gap-3 text-[#cccccc]">
                <Minus size={14} />
                <Square size={12} />
                <X size={14} />
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-[#252526] flex items-center gap-1 px-2 border-b border-[#333333]">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-4 py-2 font-paragraph text-sm transition-colors duration-200 ${
                    activeTab === tab.name
                      ? 'bg-[#1e1e1e] text-[#ffffff] border-t-2 border-[#007acc]'
                      : 'text-[#969696] hover:text-[#ffffff]'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Code Editor */}
            <div className="bg-[#1e1e1e] p-6 font-mono text-sm text-[#d4d4d4] overflow-x-auto min-h-[400px] max-h-[600px] overflow-y-auto">
              <pre className="leading-relaxed">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(typedCode, tabs.find(t => t.name === activeTab)?.language || 'typescript'),
                  }}
                />
                {isTyping && <span className="inline-block w-2 h-5 bg-[#ffffff] ml-1 animate-pulse" />}
              </pre>
            </div>

            {/* Status Bar */}
            <div className="bg-[#007acc] px-4 py-1 flex items-center justify-between text-xs font-paragraph text-white">
              <div className="flex items-center gap-4">
                <span>UTF-8</span>
                <span>LF</span>
                <span>{tabs.find(t => t.name === activeTab)?.language.toUpperCase()}</span>
              </div>
              <div>
                Ln {typedCode.split('\n').length}, Col {typedCode.split('\n').pop()?.length || 0}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
