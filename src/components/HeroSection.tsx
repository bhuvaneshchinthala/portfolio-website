import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    let scrollY = 0;
    let animationFrame: number;

    // Car animation with GSAP-like keyframes (15 keyframes)
    const carKeyframes = [
      { progress: 0, x: -200, y: 0, rotation: 0, blur: 0, opacity: 0 },
      { progress: 0.05, x: -100, y: -10, rotation: 2, blur: 2, opacity: 0.3 },
      { progress: 0.1, x: 0, y: -15, rotation: 5, blur: 3, opacity: 0.6 },
      { progress: 0.2, x: 150, y: -20, rotation: 8, blur: 4, opacity: 0.8 },
      { progress: 0.3, x: 300, y: -15, rotation: 10, blur: 5, opacity: 1 },
      { progress: 0.4, x: 450, y: -10, rotation: 12, blur: 6, opacity: 1 },
      { progress: 0.5, x: 600, y: 0, rotation: 15, blur: 7, opacity: 1 },
      { progress: 0.6, x: 750, y: 10, rotation: 12, blur: 6, opacity: 1 },
      { progress: 0.7, x: 900, y: 15, rotation: 8, blur: 5, opacity: 0.9 },
      { progress: 0.75, x: 1000, y: 20, rotation: 5, blur: 4, opacity: 0.8 },
      { progress: 0.8, x: 1100, y: 15, rotation: 3, blur: 3, opacity: 0.7 },
      { progress: 0.85, x: 1200, y: 10, rotation: 2, blur: 2, opacity: 0.5 },
      { progress: 0.9, x: 1300, y: 5, rotation: 1, blur: 1, opacity: 0.3 },
      { progress: 0.95, x: 1400, y: 0, rotation: 0, blur: 0, opacity: 0.1 },
      { progress: 1, x: 1500, y: 0, rotation: 0, blur: 0, opacity: 0 },
    ];

    const interpolateKeyframe = (progress: number) => {
      // Find surrounding keyframes
      let prevFrame = carKeyframes[0];
      let nextFrame = carKeyframes[carKeyframes.length - 1];

      for (let i = 0; i < carKeyframes.length - 1; i++) {
        if (progress >= carKeyframes[i].progress && progress <= carKeyframes[i + 1].progress) {
          prevFrame = carKeyframes[i];
          nextFrame = carKeyframes[i + 1];
          break;
        }
      }

      // Interpolate between frames
      const localProgress = (progress - prevFrame.progress) / (nextFrame.progress - prevFrame.progress);
      
      return {
        x: prevFrame.x + (nextFrame.x - prevFrame.x) * localProgress,
        y: prevFrame.y + (nextFrame.y - prevFrame.y) * localProgress,
        rotation: prevFrame.rotation + (nextFrame.rotation - prevFrame.rotation) * localProgress,
        blur: prevFrame.blur + (nextFrame.blur - prevFrame.blur) * localProgress,
        opacity: prevFrame.opacity + (nextFrame.opacity - prevFrame.opacity) * localProgress,
      };
    };

    const drawCar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scroll progress (0 to 1)
      const maxScroll = 800;
      const progress = Math.min(scrollY / maxScroll, 1);

      const frame = interpolateKeyframe(progress);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.save();
      ctx.globalAlpha = frame.opacity;

      // Motion blur effect
      if (frame.blur > 0) {
        ctx.filter = `blur(${frame.blur}px)`;
      }

      // Draw speed lines
      if (progress > 0.1 && progress < 0.9) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(centerX + frame.x - 100 - i * 30, centerY + frame.y + (Math.random() - 0.5) * 50);
          ctx.lineTo(centerX + frame.x - 150 - i * 30, centerY + frame.y + (Math.random() - 0.5) * 50);
          ctx.stroke();
        }
      }

      // Draw drift smoke
      if (progress > 0.2 && progress < 0.8) {
        const smokeGradient = ctx.createRadialGradient(
          centerX + frame.x - 80,
          centerY + frame.y + 30,
          0,
          centerX + frame.x - 80,
          centerY + frame.y + 30,
          60
        );
        smokeGradient.addColorStop(0, 'rgba(161, 161, 170, 0.3)');
        smokeGradient.addColorStop(1, 'rgba(161, 161, 170, 0)');
        ctx.fillStyle = smokeGradient;
        ctx.fillRect(centerX + frame.x - 140, centerY + frame.y, 120, 60);
      }

      ctx.translate(centerX + frame.x, centerY + frame.y);
      ctx.rotate((frame.rotation * Math.PI) / 180);

      // Draw simplified car shape
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-40, -15, 80, 30);
      ctx.fillRect(-30, -25, 50, 10);

      // Headlight glow
      if (progress > 0.15) {
        const glowGradient = ctx.createRadialGradient(40, 0, 0, 40, 0, 40);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(40, -10, 40, 20);
      }

      ctx.restore();
    };

    const animate = () => {
      drawCar();
      animationFrame = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Car animation canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="relative z-10 max-w-[120rem] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1
            className="font-heading text-7xl md:text-9xl font-black mb-8 leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-foreground via-light-gray to-foreground bg-clip-text text-transparent">
              DIGITAL
            </span>
            <br />
            <span className="bg-gradient-to-r from-light-gray via-foreground to-light-gray bg-clip-text text-transparent">
              COSMOS
            </span>
          </motion.h1>

          <motion.p
            className="font-paragraph text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Crafting immersive digital experiences that transcend boundaries. 
            Where innovation meets design in the vast expanse of technology.
          </motion.p>

          <motion.div
            className="flex gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-foreground text-deep-black rounded-full font-paragraph font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Explore Projects</span>
              <div className="absolute inset-0 bg-light-gray transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>

            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-foreground text-foreground rounded-full font-paragraph font-semibold text-base hover:bg-foreground hover:text-deep-black transition-all duration-300 hover:scale-105"
            >
              About Me
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.2,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 0.5,
          }}
        >
          <ArrowDown className="text-secondary" size={32} />
        </motion.div>
      </div>

      {/* Blur overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-black pointer-events-none" />
    </section>
  );
}
