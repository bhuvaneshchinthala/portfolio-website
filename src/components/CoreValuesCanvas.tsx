import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

interface CoreValuesCanvasProps {
    scrollYProgress: MotionValue<number>;
}

export default function CoreValuesCanvas({ scrollYProgress }: CoreValuesCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const frameCount = 240;

    // Current frame index based on scroll (0 to 240)
    const currentFrameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    // Preload all images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Pads the number with zeros (e.g., 0001, 0023, 0145)
            const frameNum = i.toString().padStart(4, '0');
            img.src = `/core-values/frame_${frameNum}.jpg`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setImages(loadedImages);
                    // Draw the very first frame immediately once all are loaded
                    drawFrame(loadedImages, 0);
                }
            };
            loadedImages.push(img);
        }
    }, [frameCount]);

    const drawFrame = (imgs: HTMLImageElement[], index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = imgs[index];
        if (!img) return;

        // Draw image covering the whole canvas (object-cover style logic)
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
        }

        // Apply a 10% zoom to crop out the "veo" watermark at the edges
        const zoomFactor = 1.10;
        drawWidth *= zoomFactor;
        drawHeight *= zoomFactor;

        // Center the zoomed-in image
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply dark overlay/filter settings to make the white text pop
        ctx.filter = 'brightness(0.6) contrast(1.1) saturate(1.2)';
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Watch the framer-motion value and draw the corresponding frame
    useEffect(() => {
        const unsubscribe = currentFrameIndex.on("change", (latestVal) => {
            const frameIndex = Math.floor(latestVal);
            if (images.length > 0) {
                // Wrap in requestAnimationFrame for rendering performance
                requestAnimationFrame(() => drawFrame(images, frameIndex));
            }
        });

        return () => unsubscribe();
    }, [currentFrameIndex, images]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            // Native resolution of the frames for sharpness
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            if (images.length > 0) {
                drawFrame(images, Math.floor(currentFrameIndex.get()));
            }
        };

        handleResize(); // Init size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [images, currentFrameIndex]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}
