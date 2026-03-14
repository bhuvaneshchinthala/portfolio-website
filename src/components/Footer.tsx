import { useRef } from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import FooterCanvas from './FooterCanvas';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer ref={footerRef} id="contact" className="relative bg-black overflow-hidden">

      {/* Dynamic Scrolling Video Background */}
      <FooterCanvas targetRef={footerRef} />

      <div className="relative z-10 max-w-[120rem] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="font-black text-3xl tracking-tighter text-white">
              CHINTHALA <span className="text-red-600">BHUVANESH</span>
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed font-light max-w-md">
              The code represents the birth of ideas—where potential coalesces into brilliance.
              It symbolizes my approach to development: taking raw ideas and energy to form vast, immersive digital ecosystems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <button
                  onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-red-500 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-red-500 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Code Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-red-500 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-red-500 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 hover:opacity-100 transition-opacity"></span>
                  About & Skills
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white tracking-wider uppercase">
              Connect
            </h4>
            <div className="flex gap-4 mb-8">
              <a
                href="https://github.com/bhuvaneshchinthala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-red-600 transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/bhuvanesh-chinthala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-blue-500 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:bhuvaneshchinthala0@gmail.com"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-red-500 transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>

            <a href="mailto:bhuvaneshchinthala0@gmail.com" className="text-xl font-light text-white hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-1">
              bhuvaneshchinthala0@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Chinthala Bhuvanesh. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            Designed with <span className="text-red-600">precision</span> and <span className="text-white">passion</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
