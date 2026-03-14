import { useRef, useCallback, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AboutBackground from './AboutBackground';

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({ baseVelocity = 100 }: { baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap w-full">
      <motion.div className="scroller font-bold uppercase text-4xl md:text-6xl flex whitespace-nowrap flex-nowrap" style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="flex items-center gap-0 mr-12">
            <motion.div initial="rest" whileHover="hover" animate="rest"
              variants={{ rest: { scale: 1, letterSpacing: "0px", textShadow: "0 0 10px rgba(255,40,0,0.3)", filter: "brightness(1)" }, hover: { scale: 1.15, letterSpacing: "6px", textShadow: "0 0 40px rgba(255,40,0,0.8), 0 0 80px rgba(255,40,0,0.4)", filter: "brightness(1.5)", transition: { type: "spring", stiffness: 400, damping: 15 } } }}
              className="inline-flex items-center px-4 md:px-8 cursor-pointer text-[#ff2800] font-black">
              <span>MACHINE LEARNING</span>
              <motion.span variants={{ rest: { color: "rgba(255,255,255,0.2)" }, hover: { color: "#ff2800", transition: { type: "spring", stiffness: 300, damping: 10 } } }} className="font-light mx-4 md:mx-8 text-xl md:text-3xl">//</motion.span>
            </motion.div>
            <motion.div initial="rest" whileHover="hover" animate="rest"
              variants={{ rest: { scale: 1, letterSpacing: "0px", filter: "brightness(1)", WebkitTextStroke: "1px rgba(255,255,255,0.4)", color: "transparent" }, hover: { scale: 1.15, letterSpacing: "6px", filter: "brightness(1.5)", WebkitTextStroke: "2px rgba(255,255,255,1)", color: "white", transition: { type: "spring", stiffness: 400, damping: 15 } } } as any}
              className="inline-flex items-center px-4 md:px-8 cursor-pointer font-black italic">
              <span>GENERATIVE AI</span>
              <motion.span variants={{ rest: { color: "rgba(255,255,255,0.2)", WebkitTextStroke: "0px" }, hover: { color: "#ff2800", WebkitTextStroke: "0px", transition: { type: "spring", stiffness: 300, damping: 10 } } } as any} className="font-light mx-4 md:mx-8 text-xl md:text-3xl">//</motion.span>
            </motion.div>
            <motion.div initial="rest" whileHover="hover" animate="rest"
              variants={{ rest: { scale: 1, letterSpacing: "0px", textShadow: "0 0 10px rgba(255,40,0,0.3)", filter: "brightness(1)" }, hover: { scale: 1.15, letterSpacing: "6px", textShadow: "0 0 40px rgba(255,40,0,0.8)", filter: "brightness(1.5)", transition: { type: "spring", stiffness: 400, damping: 15 } } }}
              className="inline-flex items-center px-4 md:px-8 cursor-pointer text-[#ff2800] font-black">
              <span>COMPUTER VISION</span>
              <motion.span variants={{ rest: { color: "rgba(255,255,255,0.2)" }, hover: { color: "#ff2800", transition: { type: "spring", stiffness: 300, damping: 10 } } }} className="font-light mx-4 md:mx-8 text-xl md:text-3xl">//</motion.span>
            </motion.div>
            <motion.div initial="rest" whileHover="hover" animate="rest"
              variants={{ rest: { scale: 1, letterSpacing: "0px", filter: "brightness(1)", WebkitTextStroke: "1px rgba(255,255,255,0.4)", color: "transparent" }, hover: { scale: 1.15, letterSpacing: "6px", filter: "brightness(1.5)", WebkitTextStroke: "2px rgba(255,255,255,1)", color: "white", transition: { type: "spring", stiffness: 400, damping: 15 } } } as any}
              className="inline-flex items-center px-4 md:px-8 cursor-pointer font-black italic">
              <span>SYSTEM DESIGN</span>
              <motion.span variants={{ rest: { color: "rgba(255,255,255,0.2)", WebkitTextStroke: "0px" }, hover: { color: "#ff2800", WebkitTextStroke: "0px", transition: { type: "spring", stiffness: 300, damping: 10 } } } as any} className="font-light mx-4 md:mx-8 text-xl md:text-3xl">//</motion.span>
            </motion.div>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightSize = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 500, mass: 0.3 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 500, mass: 0.3 });
  const smoothSize = useSpring(spotlightSize, { damping: 25, stiffness: 300 });
  const maskImage = useMotionTemplate`radial-gradient(${smoothSize}px circle at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    spotlightSize.set(450);
  }, [mouseX, mouseY, spotlightSize]);

  const handleMouseLeave = useCallback(() => {
    spotlightSize.set(0);
  }, [spotlightSize]);

  // Left panel mouse tracking for spotlight + tilt
  const [leftMouse, setLeftMouse] = useState({ x: 0.5, y: 0.5, over: false });
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const handleLeftMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = leftPanelRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLeftMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height, over: true });
  }, []);
  const handleLeftLeave = useCallback(() => setLeftMouse(m => ({ ...m, over: false, x: 0.5, y: 0.5 })), []);
  const leftTiltX = (leftMouse.y - 0.5) * -8;
  const leftTiltY = (leftMouse.x - 0.5) * 8;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-0 bg-black" />

      {/* Neural Canvas */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none" style={{ opacity: 0.35 }}>
        <AboutBackground />
      </div>

      {/* SVG Outline Filter */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="thick-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="3"></feMorphology>
          <feFlood floodColor="#ffffff" floodOpacity="1" result="WHITE"></feFlood>
          <feComposite in="WHITE" in2="DILATED" operator="in" result="WHITE_OUTLINE"></feComposite>
          <feGaussianBlur in="WHITE_OUTLINE" stdDeviation="4" result="GLOW_INNER"></feGaussianBlur>
          <feGaussianBlur in="WHITE_OUTLINE" stdDeviation="10" result="GLOW_MID"></feGaussianBlur>
          <feGaussianBlur in="WHITE_OUTLINE" stdDeviation="25" result="GLOW_OUTER"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="GLOW_OUTER" />
            <feMergeNode in="GLOW_MID" />
            <feMergeNode in="GLOW_INNER" />
            <feMergeNode in="GLOW_INNER" />
            <feMergeNode in="WHITE_OUTLINE" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      {/* Silhouette Profile Reveal Area - BASE: always visible dark image */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {/* BASE LAYER WRAPPER to hide the glowing left edge */}
        <div
          className="absolute h-full w-full md:w-[50%] right-0"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 15px, black 40px)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15px, black 40px)'
          }}
        >
          {/* BASE LAYER: Dark Image + Thick White Glowing Outline */}
          <img
            src="/images/bhuvanesh-bright-portrait.png"
            alt="Bhuvanesh Portrait Outline"
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{
              filter: 'brightness(0.35) contrast(1.2) drop-shadow(0 0 10px rgba(0,0,0,1)) url(#thick-glow)'
            }}
          />
        </div>
      </div>

      {/* TOP LAYER: Full Color Reveal — mask applied to full section so coordinates match mouse */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ WebkitMaskImage: maskImage, maskImage }}
      >
        <img
          src="/images/bhuvanesh-bright-portrait.png"
          alt="Bhuvanesh Portrait Reveal"
          className="absolute h-full w-full md:w-[50%] right-0 object-cover object-center"
          style={{
            filter: 'brightness(1.4) contrast(1.2) saturate(1.4)'
          }}
        />
      </motion.div>

      <div className="absolute inset-0 z-[3] bg-gradient-to-br from-red-500/10 via-transparent to-transparent mix-blend-overlay pointer-events-none" />


      {/* Cursor glow aura */}
      <motion.div
        className="absolute pointer-events-none z-[2]"
        style={{
          x: smoothX, y: smoothY,
          translateX: '-50%', translateY: '-50%',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(255,200,150,0.06) 0%, rgba(255,40,0,0.03) 40%, transparent 70%)',
          opacity: useTransform(smoothSize, [0, 450], [0, 1]),
        }}
      />

      {/* Floating badges */}
      <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }} className="absolute top-[25%] right-[10%] md:right-[18%] z-20 hidden md:block">
        <div className="flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 shadow-lg">
          <span className="text-red-500 text-lg">◆</span>
          <span className="text-white/90 text-sm font-medium tracking-wide">AI Engineer</span>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.8 }} className="absolute top-[60%] right-[6%] md:right-[12%] z-20 hidden md:block">
        <div className="flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 shadow-lg">
          <span className="text-red-500 text-lg">◆</span>
          <span className="text-white/90 text-sm font-medium tracking-wide">System Designer</span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center px-6 md:px-16 lg:px-24 pb-48 pt-16">
        <div
          ref={leftPanelRef}
          className="max-w-xl space-y-8 relative"
          onMouseMove={handleLeftMove}
          onMouseLeave={handleLeftLeave}
          style={{
            transform: `perspective(900px) rotateX(${leftTiltX}deg) rotateY(${leftTiltY}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Left panel spotlight */}
          {leftMouse.over && (
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl z-0"
              style={{
                background: `radial-gradient(400px circle at ${leftMouse.x * 100}% ${leftMouse.y * 100}%, rgba(255,40,0,0.10) 0%, rgba(255,40,0,0.04) 40%, transparent 70%)`,
              }}
            />
          )}

          <div className="overflow-hidden relative z-10">
            <motion.h2
              className="text-xl md:text-2xl text-gray-400 font-light tracking-wide uppercase flex items-center gap-3"
            >
              {/* Animated line */}
              <motion.span
                className="h-[1px] bg-red-500/50 block"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              {/* Letter-by-letter reveal */}
              {'Hello there!'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
                  className="inline-block"
                  style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
                >{ch}</motion.span>
              ))}
            </motion.h2>
          </div>

          {/* I'm Bhuvanesh — per letter with red glow on name */}
          <div className="relative z-10">
            <div className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight drop-shadow-lg flex flex-wrap items-baseline gap-x-1">
              {/* "I'm " */}
              {"I'm".split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-white"
                  initial={{ opacity: 0, y: 60, rotateX: 90 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.33, 1, 0.68, 1] }}
                >{ch}</motion.span>
              ))}
              {/* Space */}
              <span className="inline-block" style={{ width: '0.25em' }} />
              {/* "Bhuvanesh" — each letter glows red */}
              {'Bhuvanesh'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 60, rotateX: 90 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: [0.33, 1, 0.68, 1] }}
                  whileHover={{
                    scale: 1.15,
                    filter: 'drop-shadow(0 0 14px rgba(255,40,0,1))',
                    transition: { duration: 0.1 }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #ff4422 50%, #ff2800 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >{ch}</motion.span>
              ))}
            </div>
          </div>

          {/* AI Engineer & Designer — word-by-word typewriter */}
          <div className="overflow-hidden relative z-10">
            <div className="text-2xl md:text-4xl text-gray-300 font-light flex flex-wrap gap-x-3 items-center">
              {['AI', 'Engineer', '&', 'Designer'].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={word === '&' ? { color: '#ff2800' } : undefined}
                >{word}</motion.span>
              ))}
              {/* Blinking cursor */}
              <motion.span
                className="inline-block w-[3px] h-8 bg-red-500 ml-1 rounded-full"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            whileHover={{ boxShadow: '0 0 30px rgba(255,40,0,0.12)', borderColor: 'rgba(255,40,0,0.25)', transition: { duration: 0.3 } }}
            className="text-gray-300 text-lg md:text-xl leading-relaxed space-y-6 pt-4 border-l-2 border-white/10 pl-6 backdrop-blur-sm bg-black/30 p-5 rounded-r-xl relative z-10"
          >
            {/* Word-by-word bio */}
            <p className="flex flex-wrap gap-x-[0.35em] gap-y-1">
              {["Hi,", "I'm"].map((w,i) => <motion.span key={i} className="inline-block" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.8+i*0.06}}>{w}</motion.span>)}
              <motion.span className="inline-block font-medium text-white" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.92}} whileHover={{textShadow:'0 0 20px rgba(255,255,255,0.8)',scale:1.05}}>Bhuvanesh,</motion.span>
              {["an","aspiring","Artificial","Intelligence","student","from","Telangana,","India.","I","am","currently","pursuing","my","studies","at"].map((w,i)=><motion.span key={i} className="inline-block" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.98+i*0.04}}>{w}</motion.span>)}
              <motion.span className="inline-block text-red-400 cursor-pointer" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:1.6}} whileHover={{textShadow:'0 0 20px rgba(255,40,0,0.9)',scale:1.05}}>Amrita Vishwa Vidyapeetham,</motion.span>
              <motion.span className="inline-block" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:1.7}}>Coimbatore.</motion.span>
            </p>

            <p className="flex flex-wrap gap-x-[0.35em] gap-y-1">
              {["Passionate","about","fusing","creative","design","with","artificial","intelligence.","I","build","systems","that","don't","just","work","—","they"].map((w,i)=><motion.span key={i} className="inline-block" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:1.8+i*0.04}}>{w}</motion.span>)}
              <motion.span className="inline-block text-white font-semibold" initial={{opacity:0,scale:0.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:2.5,type:'spring',stiffness:400}} whileHover={{textShadow:'0 0 30px rgba(255,255,255,1)',scale:1.1}}>think</motion.span>
              <motion.span className="inline-block" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:2.56}}>and</motion.span>
              <motion.span className="inline-block text-white font-semibold" initial={{opacity:0,scale:0.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:2.62,type:'spring',stiffness:400}} whileHover={{textShadow:'0 0 30px rgba(255,255,255,1)',scale:1.1}}>inspire.</motion.span>
            </p>

            <p className="text-gray-400 text-sm md:text-base border-t border-white/10 pt-4 mt-2 flex flex-wrap gap-x-[0.35em] gap-y-1">
              {["My","goal","is","to","grow","as","an","AI","professional","and","contribute","to","impactful,","technology-driven","advancements","in","the","future."].map((w,i)=><motion.span key={i} className="inline-block" initial={{opacity:0,y:6}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:2.7+i*0.04}}>{w}</motion.span>)}
            </p>
          </motion.div>


          <div className="pt-8 flex flex-col sm:flex-row gap-6 relative z-30">
            <Link to="/about-me" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-full text-white transition-all overflow-hidden shadow-[0_0_20px_rgba(255,40,0,0.3)] hover:shadow-[0_0_40px_rgba(255,40,0,0.5)] cursor-pointer">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              <span className="relative z-10 tracking-widest uppercase text-sm font-bold pointer-events-none">Access Core Profile</span>
              <ArrowUpRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform pointer-events-none" />
            </Link>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all duration-300 backdrop-blur-sm cursor-pointer relative z-30">
              <span className="tracking-widest uppercase text-sm font-medium text-white/90 group-hover:text-white pointer-events-none">Initialize Contact</span>
            </button>
          </div>

        </div>
      </div>

      {/* Skills Marquee */}
      <div className="absolute -bottom-8 left-0 right-0 py-4 overflow-hidden bg-gradient-to-t from-black to-transparent z-10 opacity-60">
        <ParallaxText baseVelocity={-3} />
        <ParallaxText baseVelocity={3} />
      </div>
    </section>
  );
}
