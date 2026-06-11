import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = 'default' | 'button' | 'text' | 'focus' | 'card';

export default function FuturisticCursor() {
  const [state, setState] = useState<CursorState>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Motion Values for cursor coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Follower shape dimension motion values
  const followerWidth = useMotionValue(40);
  const followerHeight = useMotionValue(40);
  const followerBorderRadius = useMotionValue(20);

  // Springs for outer follower coordinates (creates weightless delayed lag)
  const springX = useSpring(mouseX, { damping: 28, stiffness: 180, mass: 0.8 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 180, mass: 0.8 });

  // Springs for outer follower dimensions (smooth morphing)
  const springWidth = useSpring(followerWidth, { damping: 30, stiffness: 220, mass: 0.7 });
  const springHeight = useSpring(followerHeight, { damping: 30, stiffness: 220, mass: 0.7 });
  const springBorderRadius = useSpring(followerBorderRadius, { damping: 30, stiffness: 220, mass: 0.7 });

  // Springs for spotlight background (heavy parallax lag)
  const spotlightSpringX = useSpring(mouseX, { damping: 45, stiffness: 75, mass: 1.6 });
  const spotlightSpringY = useSpring(mouseY, { damping: 45, stiffness: 75, mass: 1.6 });

  // Springs for inner dot (near-instant response for high precision)
  const dotSpringX = useSpring(dotX, { damping: 12, stiffness: 1200, mass: 0.15 });
  const dotSpringY = useSpring(dotY, { damping: 12, stiffness: 1200, mass: 0.15 });

  // Keep ref versions of states for access inside the 60fps requestAnimationFrame canvas loop
  const stateRef = useRef(state);
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    // 1. Hide native browser cursor globally
    const style = document.createElement('style');
    style.id = 'cinematic-cursor-hide-rules';
    style.innerHTML = `
      html, body, a, button, input, textarea, select, [role="button"], .magnetic-target {
        cursor: none !important;
      }
      iframe {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // 2. Track mouse coordinates, hovers, and screen focus
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) setIsVisible(true);
      const { clientX, clientY } = e;

      // Update inner core target
      dotX.set(clientX);
      dotY.set(clientY);

      const target = e.target as HTMLElement;
      const interactiveEl = target ? (target.closest('a, button, input, textarea, select, [role="button"], img, .card, .group, .magnetic-target') as HTMLElement) : null;

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const styleInfo = window.getComputedStyle(interactiveEl);
        const radius = parseInt(styleInfo.borderRadius) || 8;

        // Categorize the element and morph the cursor geometry accordingly
        if (
          interactiveEl.tagName === 'INPUT' || 
          interactiveEl.tagName === 'TEXTAREA' || 
          interactiveEl.getAttribute('data-cursor') === 'text'
        ) {
          // Caret Text I-Beam Mode
          setState('text');
          followerWidth.set(4);
          followerHeight.set(26);
          followerBorderRadius.set(2);
          
          mouseX.set(clientX);
          mouseY.set(clientY);
        } else if (
          interactiveEl.tagName === 'IMG' || 
          interactiveEl.getAttribute('data-cursor') === 'focus'
        ) {
          // Focus mode corners
          setState('focus');
          followerWidth.set(64);
          followerHeight.set(64);
          followerBorderRadius.set(4);

          mouseX.set(clientX);
          mouseY.set(clientY);
        } else if (
          interactiveEl.classList.contains('card') || 
          interactiveEl.classList.contains('group') ||
          interactiveEl.getAttribute('data-cursor') === 'card'
        ) {
          // Expanded aura mode
          setState('card');
          followerWidth.set(110);
          followerHeight.set(110);
          followerBorderRadius.set(55);

          // Subtle pull (10%) towards center of card
          const targetX = clientX + (centerX - clientX) * 0.1;
          const targetY = clientY + (centerY - clientY) * 0.1;
          mouseX.set(targetX);
          mouseY.set(targetY);
        } else {
          // Clickable capsule mode (button, links, magnetic tags)
          setState('button');
          followerWidth.set(rect.width + 12);
          followerHeight.set(rect.height + 8);
          followerBorderRadius.set(radius + 4);

          // Elastic Magnetics: Pull target center by 88%, blending in 12% raw mouse drift
          const targetX = centerX + (clientX - centerX) * 0.12;
          const targetY = centerY + (clientY - centerY) * 0.12;
          mouseX.set(targetX);
          mouseY.set(targetY);
        }
      } else {
        // Default cursor state
        setState('default');
        followerWidth.set(40);
        followerHeight.set(40);
        followerBorderRadius.set(20);

        mouseX.set(clientX);
        mouseY.set(clientY);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      const el = document.getElementById('cinematic-cursor-hide-rules');
      if (el) el.remove();
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, []);

  // 3. Canvas rendering loop for Red Plasma Energy Trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    interface TrailPoint {
      x: number;
      y: number;
      velocity: number;
    }

    let history: TrailPoint[] = [];
    let lastPos = { x: dotX.get(), y: dotY.get() };

    // Function to draw a continuous polygon mesh ribbon for a glowing plasma layer
    const drawEnergyRibbon = (
      points: TrailPoint[],
      baseWidth: number,
      colorStart: string,
      colorEnd: string,
      blurAmount: number
    ) => {
      if (points.length < 3) return;

      ctx.save();
      ctx.shadowBlur = blurAmount;
      ctx.shadowColor = colorEnd;

      ctx.beginPath();
      
      const leftPoints: { x: number; y: number }[] = [];
      const rightPoints: { x: number; y: number }[] = [];

      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];

        const dx = next.x - curr.x;
        const dy = next.y - curr.y;
        const len = Math.hypot(dx, dy) || 1;

        const perpX = -dy / len;
        const perpY = dx / len;

        // Taper factor: tail is thin (index 0), head is thick (index history.length - 1)
        const ratio = (i + 1) / points.length;
        
        // Dynamically expand width based on coordinate velocity (Speed Stretching)
        const speedScale = Math.min(curr.velocity * 0.025, 1.4);
        
        // Organic vibrating plasma ripple via sine wave modulation
        const ripple = Math.sin(i * 0.45 - performance.now() * 0.018) * 1.5;
        
        const currentWidth = Math.max(0.5, (baseWidth * ratio * (1 + speedScale)) + ripple);

        leftPoints.push({
          x: curr.x + perpX * currentWidth,
          y: curr.y + perpY * currentWidth
        });

        rightPoints.push({
          x: curr.x - perpX * currentWidth,
          y: curr.y - perpY * currentWidth
        });
      }

      const head = points[points.length - 1];
      
      // Construct closed ribbon outline
      ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
      for (let i = 1; i < leftPoints.length; i++) {
        ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
      }
      
      // Round corner cap at cursor head
      ctx.lineTo(head.x, head.y);
      
      for (let i = rightPoints.length - 1; i >= 0; i--) {
        ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
      }

      ctx.closePath();

      // Create gradient along ribbon path
      const grad = ctx.createLinearGradient(
        points[0].x, points[0].y,
        head.x, head.y
      );
      grad.addColorStop(0, colorStart);
      grad.addColorStop(1, colorEnd);

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Track raw dot coordinates to make trailing extremely fluid and responsive
      const currentX = dotX.get();
      const currentY = dotY.get();

      const dx = currentX - lastPos.x;
      const dy = currentY - lastPos.y;
      const velocity = Math.hypot(dx, dy);

      lastPos = { x: currentX, y: currentY };

      const activeState = stateRef.current;
      const isHovered = activeState === 'button' || activeState === 'card';

      // Push to history
      if (isVisibleRef.current && currentX > 0 && currentY > 0) {
        history.push({
          x: currentX,
          y: currentY,
          velocity
        });
        
        // Luxurious long energy trail limit (up to 24 points)
        if (history.length > 24) {
          history.shift();
        }
      } else {
        if (history.length > 0) history.shift();
      }

      if (history.length >= 3) {
        // Draw Pass 1: Volumetric Crimson Aura (Wide & Soft)
        drawEnergyRibbon(
          history,
          isHovered ? 20 : 14,
          'rgba(255, 40, 0, 0)',
          isHovered ? 'rgba(255, 20, 0, 0.16)' : 'rgba(255, 40, 0, 0.08)',
          24
        );

        // Draw Pass 2: Plasma Core Jacket (Medium Glowing Neon Red)
        drawEnergyRibbon(
          history,
          isHovered ? 9 : 6.5,
          'rgba(255, 40, 0, 0)',
          isHovered ? 'rgba(255, 0, 60, 0.5)' : 'rgba(255, 40, 0, 0.28)',
          8
        );

        // Draw Pass 3: White-Red Core Fibre (Thin High-Heat Streak)
        drawEnergyRibbon(
          history,
          isHovered ? 2.2 : 1.6,
          'rgba(255, 220, 200, 0)',
          isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 220, 210, 0.75)',
          2
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* 1. Shape History Ghost Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9990] mix-blend-screen"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* 2. Parallax Spotlight Background Glow (Lagging way behind the cursor) */}
      <div className="fixed inset-0 pointer-events-none z-[9985] overflow-hidden">
        <motion.div
          style={{
            x: spotlightSpringX,
            y: spotlightSpringY,
            translateX: '-50%',
            translateY: '-50%',
            opacity: isVisible ? 0.6 : 0
          }}
          animate={{
            background: state === 'text' 
              ? 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0.02) 45%, transparent 75%)'
              : 'radial-gradient(circle, rgba(255, 40, 0, 0.16) 0%, rgba(255, 40, 0, 0.03) 45%, transparent 75%)',
            scale: state === 'button' ? 1.45 : state === 'card' ? 1.65 : 1
          }}
          transition={{ duration: 0.4 }}
          className="absolute w-[800px] h-[800px] rounded-full filter blur-[80px] transition-opacity duration-300 mix-blend-screen"
        />
      </div>

      {/* 3. Glassmorphism Backdrop Blur Aura Layer */}
      <div className="fixed inset-0 pointer-events-none z-[9994] overflow-hidden">
        <motion.div
          style={{
            x: springX,
            y: springY,
            width: springWidth,
            height: springHeight,
            borderRadius: springBorderRadius,
            translateX: '-50%',
            translateY: '-50%',
            opacity: isVisible && state !== 'text' ? 1 : 0
          }}
          className="absolute backdrop-blur-[1.5px] bg-white/[0.01] border border-white/[0.03] transition-opacity duration-300"
        />
      </div>

      {/* 4. Primary Morphable HUD Outer Follower Frame */}
      <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
        <motion.div
          style={{
            x: springX,
            y: springY,
            width: springWidth,
            height: springHeight,
            borderRadius: springBorderRadius,
            translateX: '-50%',
            translateY: '-50%',
            opacity: isVisible ? 1 : 0
          }}
          animate={{
            scale: isClicking ? 0.95 : 1.0,
          }}
          className="absolute flex items-center justify-center mix-blend-screen transition-opacity duration-300"
        >
          {/* Ambient outer aura backing */}
          <motion.div 
            animate={{
              opacity: state === 'button' ? 0.38 : state === 'card' ? 0.28 : 0.16,
              scale: state === 'button' ? [1, 1.08, 1] : 1
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
            className={`absolute inset-[-4px] rounded-[inherit] filter blur-[5px] transition-colors duration-300 ${
              state === 'text' ? 'bg-[#a78bfa]' : 'bg-[#ff2800]'
            }`}
          />

          {/* Target Element Outlines / Specific HUD Visuals */}
          {state === 'default' && (
            <>
              {/* Clockwise rotating segmented ring */}
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute w-full h-full"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#ff2800"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="18 10 5 10"
                />
              </motion.svg>

              {/* Counter-clockwise rotating dotted helper ring */}
              <motion.svg
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                className="absolute w-[calc(100%+10px)] h-[calc(100%+10px)]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="rgba(255, 40, 0, 0.45)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeDasharray="3 6"
                />
              </motion.svg>
            </>
          )}

          {state === 'button' && (
            // Crimson Red button border sleeve
            <div className="absolute inset-0 border border-[#ff2800]/80 rounded-[inherit] shadow-[0_0_12px_rgba(255,40,0,0.15)] transition-all duration-300" />
          )}

          {state === 'text' && (
            // Futuristic insertion I-beam caret
            <div className="w-[2px] h-full bg-[#a78bfa] shadow-[0_0_8px_#a78bfa] rounded-full" />
          )}

          {state === 'focus' && (
            // Focusing target brackets (Crimson Red for branding)
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#ff2800]" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#ff2800]" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#ff2800]" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#ff2800]" />
            </div>
          )}

          {state === 'card' && (
            // Large slow-rotating dashboard compass ring
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
              className="absolute w-full h-full"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="47"
                stroke="rgba(255, 40, 0, 0.35)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 8"
              />
            </motion.svg>
          )}

          {/* Interactive hover ripple pulse */}
          {state === 'button' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1.12, opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-[inherit] border border-[#ff2800]/50"
            />
          )}
        </motion.div>

        {/* 5. Inner Precision Core dot (Moves independently and instantly) */}
        <motion.div
          style={{
            x: dotSpringX,
            y: dotSpringY,
            translateX: '-50%',
            translateY: '-50%',
            opacity: isVisible && state !== 'text' ? 1 : 0 // Hide dot when typing to let I-beam shine
          }}
          className="absolute w-2.5 h-2.5 flex items-center justify-center mix-blend-screen z-[9999] pointer-events-none transition-opacity duration-300"
        >
          <div 
            className="w-full h-full rounded-full shadow-lg bg-[#ff2800] shadow-[#ff2800]/50 scale-[1.1]"
          />
        </motion.div>
      </div>
    </>
  );
}
