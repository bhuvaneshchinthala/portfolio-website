import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-deep-black border-t border-overlay">
      <div className="max-w-[120rem] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-light-gray bg-clip-text text-transparent">
              NEBULA
            </h3>
            <p className="font-paragraph text-secondary text-sm leading-relaxed">
              Crafting digital experiences that transcend the ordinary. A journey through innovation, design, and technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-foreground">
              Navigate
            </h4>
            <ul className="space-y-3 font-paragraph text-sm">
              <li>
                <button
                  onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-secondary hover:text-foreground transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-secondary hover:text-foreground transition-colors duration-300"
                >
                  Code Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-secondary hover:text-foreground transition-colors duration-300"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-secondary hover:text-foreground transition-colors duration-300"
                >
                  About & Skills
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-foreground">
              Connect
            </h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-overlay border border-muted-gray flex items-center justify-center text-secondary hover:text-foreground hover:border-foreground transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-overlay border border-muted-gray flex items-center justify-center text-secondary hover:text-foreground hover:border-foreground transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-overlay border border-muted-gray flex items-center justify-center text-secondary hover:text-foreground hover:border-foreground transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="mailto:hello@nebula.dev"
                className="w-10 h-10 rounded-full bg-overlay border border-muted-gray flex items-center justify-center text-secondary hover:text-foreground hover:border-foreground transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
            <p className="font-paragraph text-secondary text-sm">
              hello@nebula.dev
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-overlay">
          <p className="font-paragraph text-secondary text-sm text-center">
            © {new Date().getFullYear()} Nebula. All rights reserved. Designed with precision and passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
