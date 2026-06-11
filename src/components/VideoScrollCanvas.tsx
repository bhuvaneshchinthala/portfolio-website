import { useEffect, useRef, useState } from 'react';
import { type MotionValue, useSpring } from 'framer-motion';

interface VideoScrollCanvasProps {
    scrollProgress: MotionValue<number>;
    onLoadProgress?: (progress: number) => void;
    onLoaded?: () => void;
    folder?: string;
    frameCount?: number;
    extension?: string;
}

export default function VideoScrollCanvas({ 
    scrollProgress, 
    onLoadProgress, 
    onLoaded,
    folder = "/frames",
    frameCount = 169,
    extension = "jpg"
}: VideoScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);

    // Smooth out the scroll progress for fluid playback
    const smoothProgress = useSpring(scrollProgress, {
        stiffness: 60,
        damping: 22,
        restDelta: 0.001
    });

    useEffect(() => {
        const loadImages = async () => {
            const actualFrameCount = frameCount;

            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            // ═══ OPTIMIZED LOADER (Concurrency Limit) ═══
            // Prevent network clogging by loading max 6 images at a time.
            const MAX_CONCURRENCY = 6;
            const imagesToLoad = Array.from({ length: actualFrameCount }, (_, i) => i + 1);

            // Prioritize first 24 frames (1 second) for instant start
            const priorityBatch = imagesToLoad.slice(0, 24);
            const remainingBatch = imagesToLoad.slice(24);
            const queue = [...priorityBatch, ...remainingBatch];

            const loadNext = async () => {
                if (queue.length === 0) return;

                const i = queue.shift()!;
                const img = new Image();
                const paddedIndex = i.toString().padStart(4, '0');
                img.src = `${folder}/frame_${paddedIndex}.${extension}`;

                return new Promise<void>((resolve) => {
                    img.onload = () => {
                        loadedImages[i - 1] = img;
                        loadedCount++;
                        // Periodically update React state so we don't wait for all frames
                        if (loadedCount % 4 === 0 || loadedCount === 1) {
                            setImages([...loadedImages]);
                        }
                        onLoadProgress?.(Math.round((loadedCount / actualFrameCount) * 100));
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        loadedCount++;
                        onLoadProgress?.(Math.round((loadedCount / actualFrameCount) * 100));
                        resolve();
                    };
                }).then(() => loadNext()); // Chain next load
            };

            // Start initial pool
            const activePool = Array.from({ length: Math.min(MAX_CONCURRENCY, queue.length) }, () => loadNext());

            await Promise.all(activePool);

            // Final state update when everything finishes
            setImages([...loadedImages]);
            onLoaded?.();
        };

        loadImages();
    }, [folder, frameCount, extension]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Force High Quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const render = (progress: number) => {
            // Handle High DPI
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            }

            const width = rect.width;
            const height = rect.height;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#050505'; // Match background
            ctx.fillRect(0, 0, width, height);

            if (images.length === 0) return;

            // Map progress 0-1 to frame index
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(progress * (frameCount - 1))
            );

            let img = images[frameIndex];
            
            // If strictly that frame isn't loaded yet, find the closest previous loaded frame
            if (!img) {
                for (let j = frameIndex; j >= 0; j--) {
                    if (images[j]) {
                        img = images[j];
                        break;
                    }
                }
            }

            if (!img) return;

            // COVER fit — fill entire viewport, crop overflow (cinematic feel)
            const imgAspect = img.width / img.height;
            const canvasAspect = width / height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgAspect > canvasAspect) {
                // Image wider: fit by height, crop sides
                drawHeight = height;
                drawWidth = height * imgAspect;
                offsetX = (width - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Image taller: fit by width, crop top/bottom
                drawWidth = width;
                drawHeight = width / imgAspect;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            }

            // Global composite operation if needed for specific blend
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const unsubscribe = smoothProgress.on("change", (latest) => {
            requestAnimationFrame(() => render(latest));
        });

        // Initial render and resize handler
        requestAnimationFrame(() => render(smoothProgress.get()));
        const handleResize = () => requestAnimationFrame(() => render(smoothProgress.get()));
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, [smoothProgress, images, frameCount]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-[2]"
            style={{
                objectFit: 'cover'
            }}
        />
    );
}
