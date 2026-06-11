import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function VideoFrameSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const frameCount = 169;
  const currentFrame = useTransform(scrollYProgress, [0, 1], [1, frameCount]);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
        const img = new window.Image();
        const paddedIndex = i.toString().padStart(4, '0');
        // The path depends on BASE_URL if any, but Vite handles / from public
        img.src = `${import.meta.env.BASE_URL || '/'}frames/frame_${paddedIndex}.jpg`.replace('//', '/');
        
        // Initial draw for frame 1 once it loads
        if (i === 1) {
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (canvas && ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width - img.width * scale) / 2;
                    const y = (canvas.height - img.height * scale) / 2;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                }
            };
        }
        loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useMotionValueEvent(currentFrame, "change", (latest) => {
    const frameIndex = Math.min(frameCount, Math.max(1, Math.round(latest))) - 1;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && images[frameIndex]) {
      const img = images[frameIndex];
      // Check naturalHeight to ensure it's loaded
      if (img.complete && img.naturalHeight !== 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    }
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-draw current frame
        const frameIndex = Math.min(frameCount, Math.max(1, Math.round(currentFrame.get()))) - 1;
        const ctx = canvasRef.current.getContext('2d');
        const img = images[frameIndex];
        if (ctx && img && img.complete && img.naturalHeight !== 0) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            const scale = Math.max(canvasRef.current.width / img.width, canvasRef.current.height / img.height);
            const x = (canvasRef.current.width - img.width * scale) / 2;
            const y = (canvasRef.current.height - img.height * scale) / 2;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, currentFrame]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-deep-black z-10">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
