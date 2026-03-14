import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, animate } from 'framer-motion';

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

// ── Mouse-tilt helper ────────────────────────────────────────────────────────
function useTilt(ref: React.RefObject<HTMLDivElement>, disabled: boolean) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sry = useSpring(ry, { stiffness: 180, damping: 22 });

  useEffect(() => {
    if (disabled) { rx.set(0); ry.set(0); return; }
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      ry.set(nx * 12);
      rx.set(-ny * 12);
    };
    const onLeave = () => { rx.set(0); ry.set(0); };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled, rx, ry, ref]);

  return { srx, sry };
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ImageFlipCard({ src, alt = '', className = '' }: Props) {
  // cumulative rotation in degrees (increments of 180 per click)
  const rotation = useMotionValue(0);
  const [totalDeg, setTotalDeg] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { srx, sry } = useTilt(cardRef, isFlipping);

  // "back face" is visible whenever the angle (mod 360) is in [90,270)
  const showingBack = ((totalDeg % 360) + 360) % 360 >= 90 &&
                      ((totalDeg % 360) + 360) % 360 < 270;

  const flip = () => {
    if (isFlipping) return;
    const next = totalDeg + 180;
    setIsFlipping(true);
    animate(rotation, next, {
      duration: 1.1,
      ease: [0.6, 0.05, 0.01, 0.99],
      onUpdate: (v) => {
        // live back-face detection for shine
      },
      onComplete: () => {
        setTotalDeg(next);
        setIsFlipping(false);
      },
    });
  };

  // full 360 spin (back to start, dramatic)
  const fullSpin = () => {
    if (isFlipping) return;
    const base = totalDeg;
    const next = base + 360;
    setIsFlipping(true);
    animate(rotation, next, {
      duration: 1.6,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => {
        setTotalDeg(base); // net zero, back to same face
        rotation.set(base);
        setIsFlipping(false);
      },
    });
  };

  const stats = [
    { label: 'SYSTEMS BUILT', value: '40+' },
    { label: 'ML MODELS',     value: '28'  },
    { label: 'YEARS ACTIVE',  value: '03'  },
    { label: 'DEPLOYMENTS',   value: '60+' },
  ];

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Glow ring during flip */}
      {isFlipping && (
        <div className="absolute inset-0 z-20 pointer-events-none rounded-sm"
          style={{ boxShadow: '0 0 60px 10px rgba(255,40,0,0.35), inset 0 0 30px rgba(255,40,0,0.15)' }}
        />
      )}

      {/* Tilt + flip container */}
      <motion.div
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Inner card that actually rotates on Y */}
        <motion.div
          style={{
            rotateY: rotation,
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* ── FRONT ────────────────────────────────── */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 overflow-hidden cursor-pointer group"
            onClick={flip}
            onDoubleClick={fullSpin}
          >
            <img
              src={src} alt={alt}
              draggable={false}
              className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:brightness-90 group-hover:grayscale-0"
              style={{ display: 'block' }}
            />

            {/* CRT scanlines */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)' }}
            />

            {/* Corner brackets */}
            {['top-4 left-4 border-t-2 border-l-2','top-4 right-4 border-t-2 border-r-2',
              'bottom-14 left-4 border-b-2 border-l-2','bottom-14 right-4 border-b-2 border-r-2'].map((c, i) => (
              <span key={i} className={`absolute w-6 h-6 border-[#ff2800] ${c} transition-all duration-500 group-hover:w-8 group-hover:h-8`} />
            ))}

            {/* Shimmer sweep on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%)' }}
            />

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-3">
              <span className="w-4 h-px bg-[#ff2800]/70" />
              <span className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase">Click · Flip  /  Dbl-Click · 360°</span>
              <span className="w-4 h-px bg-[#ff2800]/70" />
            </div>
          </div>

          {/* ── BACK ─────────────────────────────────── */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 bg-[#060606] border border-white/10 flex flex-col justify-between p-8 md:p-10 overflow-hidden cursor-pointer"
            onClick={flip}
            onDoubleClick={fullSpin}
          >
            {/* Animated gradient noise */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />

            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg,transparent,#ff2800 40%,#ff6600 60%,transparent)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />

            {/* Header */}
            <div className="relative z-10">
              <div className="font-mono text-[10px] text-[#ff2800] tracking-[0.3em] uppercase mb-3">
                ◆ System Profile ◆
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-white uppercase leading-none">
                Bhuvanesh
              </h3>
              <h3 className="text-4xl md:text-5xl font-black tracking-[-0.04em] uppercase leading-none"
                style={{ WebkitTextStroke: '1.5px #ff2800', color: 'transparent' }}
              >
                Chinthala
              </h3>
              <p className="font-mono text-[11px] text-white/30 mt-3 tracking-[0.25em] uppercase">
                AI Architect · Builder · 1993→
              </p>
            </div>

            {/* Stats */}
            <div className="relative z-10 grid grid-cols-2 gap-3 my-4">
              {stats.map(({ label, value }) => (
                <div key={label} className="border border-white/8 bg-white/[0.02] p-3 group/s hover:border-[#ff2800]/40 hover:bg-[#ff2800]/5 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">{value}</div>
                  <div className="font-mono text-[9px] text-[#ff2800]/60 tracking-[0.18em] uppercase mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Terminal */}
            <div className="relative z-10 border-t border-white/8 pt-4 font-mono text-[11px] leading-[1.8] text-white/20">
              <span className="text-[#ff2800]">▶</span> STATUS: OPERATIONAL<br />
              <span className="text-[#ff2800]">▶</span> MODE: DEEP_LEARNING<br />
              <span className="text-[#ff2800]">▶</span> READY_FOR_INPUT
              <span className="inline-block w-[6px] h-[11px] bg-[#ff2800]/70 ml-1 animate-pulse align-middle" />
            </div>

            {/* Bottom hint */}
            <div className="relative z-10 flex items-center gap-2 mt-3 font-mono text-[10px] text-white/20 tracking-[0.25em] uppercase">
              <span className="w-4 h-px bg-[#ff2800]/30" />
              Click · Flip Back  /  Dbl-Click · 360°
              <span className="w-4 h-px bg-[#ff2800]/30" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
