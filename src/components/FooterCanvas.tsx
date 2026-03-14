import React, { useEffect, useRef, useState, type RefObject } from 'react';
import { motion, useInView, useMotionValue, animate, useTransform } from 'framer-motion';

interface FooterCanvasProps {
    targetRef: RefObject<HTMLElement>;
}

export default function FooterCanvas({ targetRef }: FooterCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // TOTAL FRAMES: 192 expected from the video file
    const frameCount = 192;

    // Trigger animation when the footer comes into view (at least 10% visible)
    const isInView = useInView(targetRef, { amount: 0.1 });

    // Drive the frame index with a MotionValue
    const frameIndex = useMotionValue(0);

    // Fade the canvas in as it plays (opacity goes from 0 to 0.25 as frames 0->48 play)
    const opacityTransform = useTransform(frameIndex, [0, 48], [0, 0.25]);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];

            // ═══ OPTIMIZED LOADER (Concurrency Limit) ═══
            const MAX_CONCURRENCY = 8;
            const imagesToLoad = Array.from({ length: frameCount }, (_, i) => i + 1);

            const loadNext = async () => {
                if (imagesToLoad.length === 0) return;

                const i = imagesToLoad.shift()!;
                const img = new Image();

                // Format: frame_0001.jpg
                const paddedIndex = String(i).padStart(4, '0');
                img.src = `/images/footer-frames/frame_${paddedIndex}.jpg`;

                return new Promise<void>((resolve) => {
                    img.onload = () => {
                        loadedImages[i - 1] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load footer frame ${paddedIndex}`);
                        resolve();
                    };
                }).then(() => loadNext());
            };

            const activePool = Array.from({ length: Math.min(MAX_CONCURRENCY, imagesToLoad.length) }, () => loadNext());

            await Promise.all(activePool);

            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // ═══ CUSTOM CINEMATIC PLAYBACK LOGIC ═══
    useEffect(() => {
        if (!isLoaded) return;

        let controls: any;

        if (isInView) {
            // User requested: "first 3 sec it should come slow and then after it should come fast"
            // We animate the frame index from 0 to 191 over 5 seconds total.
            // At 60% of the duration (3 seconds), we only reach frame 50 (very slow reveal).
            // At 100% of the duration (5 seconds), we hit frame 191 (very fast finish).
            controls = animate(frameIndex, [0, 50, 191], {
                duration: 5,
                times: [0, 0.6, 1], // 0s, 3s, 5s
                ease: ["linear", "easeIn"] // Smooth start, accelerates heavily into the end
            });
        } else {
            // Reset when scrolled out of view
            frameIndex.set(0);
        }

        return () => {
            if (controls) controls.stop();
        };
    }, [isInView, isLoaded, frameIndex]);

    // ═══ CANVAS RENDER LOOP ═══
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const render = (currentFrame: number) => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            }

            const width = rect.width;
            const height = rect.height;

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, width, height);

            if (!isLoaded || images.length === 0) return;

            const safeFrame = Math.min(frameCount - 1, Math.floor(currentFrame));
            const img = images[safeFrame];
            if (!img) return;

            const imgAspect = img.width / img.height;
            const canvasAspect = width / height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgAspect > canvasAspect) {
                drawHeight = height;
                drawWidth = height * imgAspect;
                offsetX = (width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = width;
                drawHeight = width / imgAspect;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const unsubscribe = frameIndex.on("change", (latest) => {
            requestAnimationFrame(() => render(latest));
        });

        requestAnimationFrame(() => render(frameIndex.get()));
        const handleResize = () => requestAnimationFrame(() => render(frameIndex.get()));
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, [frameIndex, images, isLoaded]);

    return (
        <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            style={{
                objectFit: 'cover',
                opacity: opacityTransform,
                // Unique blending logic to integrate the video smoothly
                mixBlendMode: 'screen',
                // CSS MASKING: Fades out the harsh headlights and edges
                // Creates a soft organic drop-off so the car merges perfectly into the black website background
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
            }}
        />
    );
}
