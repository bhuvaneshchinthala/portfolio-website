import { useEffect, useRef } from 'react';

export default function FluidCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;
        contextRef.current = context;

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

        const mouse = { x: width / 2, y: height / 2 };
        const params = {
            pointsNumber: 50, // More points = smoother curve
            widthFactor: 25,  // MUCH wider base (was 10)
            mouseThreshold: 0.5,
            spring: 0.4,
            friction: 0.5
        };

        const trail = new Array(params.pointsNumber).fill(0).map(() => ({
            x: mouse.x,
            y: mouse.y,
            dx: 0,
            dy: 0,
        }));

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        let animationFrameId: number;

        const update = () => {
            if (!context) return;
            context.clearRect(0, 0, width, height);

            // Update points physics
            trail.forEach((p, pIdx) => {
                const prev = pIdx === 0 ? mouse : trail[pIdx - 1];
                const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;

                p.dx += (prev.x - p.x) * spring;
                p.dy += (prev.y - p.y) * spring;
                p.dx *= params.friction;
                p.dy *= params.friction;

                p.x += p.dx;
                p.y += p.dy;
            });

            // Calculate velocity for dynamic width
            const dx = mouse.x - trail[0].x;
            const dy = mouse.y - trail[0].y;
            const velocity = Math.sqrt(dx * dx + dy * dy);

            // Dynamic width scaling - faster = wider
            // Scale up to 2.5x base width when moving fast
            const velocityScale = Math.min(velocity * 0.02, 1);
            const baseWidth = params.widthFactor * (1 + velocityScale * 1.5);

            // Draw Ribbon (Polygon Mesh)
            context.beginPath();
            context.lineCap = 'round';
            context.lineJoin = 'round';

            // Create gradient
            const gradient = context.createLinearGradient(
                trail[0].x, trail[0].y,
                trail[trail.length - 1].x, trail[trail.length - 1].y
            );
            // Stabondar Red - Hot & Glowing
            gradient.addColorStop(0, "rgba(255, 40, 0, 0.8)");
            gradient.addColorStop(0.5, "rgba(255, 10, 0, 0.4)");
            gradient.addColorStop(1, "rgba(255, 40, 0, 0)");

            context.fillStyle = gradient;

            // Draw forward path (Top edge of ribbon)
            if (trail.length > 1) {
                context.moveTo(trail[0].x, trail[0].y);

                for (let i = 1; i < trail.length - 1; i++) {
                    const point = trail[i];
                    const nextPoint = trail[i + 1];

                    const dirX = nextPoint.x - point.x;
                    const dirY = nextPoint.y - point.y;
                    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;

                    const perpX = -dirY / len;
                    const perpY = dirX / len;

                    // Width tapers down but modulates slightly with sine wave for organic feel
                    const taper = 1 - (i / trail.length);
                    const wave = Math.sin(i * 0.2 + performance.now() * 0.005) * 2; // subtle wave
                    const currentWidth = (baseWidth + wave) * taper;

                    const topX = point.x + perpX * currentWidth;
                    const topY = point.y + perpY * currentWidth;

                    context.lineTo(topX, topY);
                }

                // Draw backward path (Bottom edge of ribbon)
                for (let i = trail.length - 2; i >= 1; i--) {
                    const point = trail[i];
                    const nextPoint = trail[i + 1];

                    const dirX = nextPoint.x - point.x;
                    const dirY = nextPoint.y - point.y;
                    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;

                    const perpX = -dirY / len;
                    const perpY = dirX / len;

                    const taper = 1 - (i / trail.length);
                    const wave = Math.sin(i * 0.2 + performance.now() * 0.005) * 2;
                    const currentWidth = (baseWidth + wave) * taper;

                    const bottomX = point.x - perpX * currentWidth;
                    const bottomY = point.y - perpY * currentWidth;

                    context.lineTo(bottomX, bottomY);
                }
            }

            context.closePath();
            context.fill();

            // Add subtle glow
            context.shadowBlur = 20;
            context.shadowColor = "rgba(255, 40, 0, 0.5)";

            animationFrameId = requestAnimationFrame(update);
        };

        update();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
