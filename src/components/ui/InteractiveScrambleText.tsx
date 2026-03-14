import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#∆Ω≡∑∞◆▲!?%&';

function ScrambleChar({ char }: { char: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(char);
    const [close, setClose] = useState(false);
    
    // Physics springs for dodging the mouse
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 350, damping: 22 });
    const sy = useSpring(y, { stiffness: 350, damping: 22 });
    const scramRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Skip scramble logic for spaces to keep word structure
    if (char === ' ') {
        return <span className="inline-block w-[0.25em]">&nbsp;</span>;
    }

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const max = 150; // Interaction radius

            if (dist < max) {
                // Determine push force based on proximity
                const force = (1 - dist / max) * 30;
                x.set((dx / dist) * force * -1); // Repel away from cursor
                y.set((dy / dist) * force * -1);
                
                setClose(true);
                
                // Rapidly scramble the character while hovering
                if (!scramRef.current) {
                    let n = 0;
                    scramRef.current = setInterval(() => {
                        setDisplay(SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]);
                        if (++n > 10) {
                            clearInterval(scramRef.current!); 
                            scramRef.current = null;
                            setDisplay(char); // Return to original char
                        }
                    }, 40);
                }
            } else {
                // Snap back to original position
                x.set(0); 
                y.set(0); 
                setClose(false);
                if (scramRef.current) { 
                    clearInterval(scramRef.current); 
                    scramRef.current = null; 
                    setDisplay(char); 
                }
            }
        };
        
        window.addEventListener('mousemove', onMove);
        return () => { 
            window.removeEventListener('mousemove', onMove); 
            if (scramRef.current) clearInterval(scramRef.current); 
        };
    }, [char, x, y]);

    return (
        <motion.span
            ref={ref}
            style={{
                x: sx, 
                y: sy,
                display: 'inline-block',
                color: close ? '#ff2800' : 'inherit',
                filter: close ? 'drop-shadow(0 0 15px rgba(255,40,0,0.8)) drop-shadow(0 0 30px rgba(255,40,0,0.4))' : 'none',
                transition: 'color 0.15s, filter 0.15s',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="cursor-default select-none"
        >
            {display}
        </motion.span>
    );
}

export default function InteractiveScrambleText({ 
    text, 
    className = "" 
}: { 
    text: string, 
    className?: string 
}) {
    return (
        <span className={`inline-flex flex-wrap ${className}`}>
            {text.split('').map((char, i) => (
                <ScrambleChar key={i} char={char} />
            ))}
        </span>
    );
}
