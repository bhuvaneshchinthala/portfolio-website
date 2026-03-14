import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CIPHER = '01アイウエオカキクケコ∆Ω≡∑∞◆▲§ψθλπ░▒▓';

// ─── Single Word Unit ────────────────────────────────────────────────────────
function WordUnit({ word, wordIndex }: { word: string; wordIndex: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [chars, setChars] = useState<string[]>(word.split(''));
  const [glowLevel, setGlowLevel] = useState(0); // 0–1
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isScrambling = useRef(false);

  // Spring-powered magnetic pull toward cursor
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 280, damping: 18, mass: 0.6 });

  const triggerScramble = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    const original = word.split('');
    let tick = 0;
    const total = 12;

    scrambleRef.current = setInterval(() => {
      setChars(prev =>
        prev.map((_, i) => {
          const progress = tick / total;
          // Reveal characters from left to right
          if (i / original.length < progress) return original[i];
          return CIPHER[Math.floor(Math.random() * CIPHER.length)];
        })
      );
      tick++;
      if (tick > total) {
        clearInterval(scrambleRef.current!);
        scrambleRef.current = null;
        setChars(original);
        isScrambling.current = false;
      }
    }, 35);
  }, [word]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 200;

      if (dist < radius) {
        const strength = 1 - dist / radius;
        // Pull toward cursor (attraction)
        const pull = strength * 18;
        x.set((dx / dist) * pull);
        y.set((dy / dist) * pull);
        setGlowLevel(strength);
        if (strength > 0.45 && !isScrambling.current) {
          triggerScramble();
        }
      } else {
        x.set(0);
        y.set(0);
        setGlowLevel(0);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (scrambleRef.current) clearInterval(scrambleRef.current);
    };
  }, [x, y, triggerScramble]);

  // Color interpolation: white → #ff8c00 → #ff2800
  const r = Math.round(255);
  const g = Math.round(255 - glowLevel * 255);
  const b = Math.round(255 - glowLevel * 255);
  const color = `rgb(${r},${g},${b})`;

  const glowShadow =
    glowLevel > 0.05
      ? `drop-shadow(0 0 ${Math.round(glowLevel * 20)}px rgba(255,${Math.round((1 - glowLevel) * 80)},0,${glowLevel.toFixed(2)})) drop-shadow(0 0 ${Math.round(glowLevel * 40)}px rgba(255,40,0,${(glowLevel * 0.5).toFixed(2)}))`
      : 'none';

  return (
    <motion.span
      ref={ref}
      style={{
        x: sx,
        y: sy,
        display: 'inline-flex',
        color,
        filter: glowShadow,
        scale: 1 + glowLevel * 0.06,
        transition: 'color 0.1s',
        letterSpacing: `${glowLevel * 0.04}em`,
      }}
      className="cursor-default select-none origin-center will-change-transform"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay: wordIndex * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            fontFamily: ch === word[i] ? 'inherit' : 'monospace',
          }}
        >
          {ch}
        </span>
      ))}
    </motion.span>
  );
}

// ─── Public Component ─────────────────────────────────────────────────────────
interface Props {
  children: string;
  className?: string;
  as?: React.ElementType;
}

export default function MagneticScrambleText({ children, className = '', as: Tag = 'p' }: Props) {
  const words = children.trim().split(/\s+/);

  return (
    <Tag className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`} style={{ color: 'rgb(255,255,255)' }}>
      {words.map((word, i) => (
        <WordUnit key={`${i}-${word}`} word={word} wordIndex={i} />
      ))}
    </Tag>
  );
}
