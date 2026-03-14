import React, { useRef, useState, useEffect } from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function MouseSpotlightText({ className = '', children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setOpacity(1));
      container.addEventListener('mouseleave', () => setOpacity(0));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        container.removeEventListener('mouseenter', () => setOpacity(1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        container.removeEventListener('mouseleave', () => setOpacity(0));
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      {/* Dim base text */}
      <div className="text-white/30 transition-colors duration-500 w-full h-full">
        {children}
      </div>
      
      {/* Bright spotlight text on top with mask */}
      <div 
        className="absolute inset-0 text-white pointer-events-none transition-opacity duration-300 w-full h-full"
        style={{
          opacity,
          WebkitMaskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
          color: '#ffffff'
        }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
