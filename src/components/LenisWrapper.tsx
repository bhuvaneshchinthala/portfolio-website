import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

interface LenisWrapperProps {
    children: React.ReactNode;
}

function LenisGsapSync() {
    const lenis = useLenis((lenis) => {
        ScrollTrigger.update();
    });

    useEffect(() => {
        const updateLenis = (time: number) => {
            lenis?.raf(time * 1000);
        };

        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(updateLenis);
        };
    }, [lenis]);

    return null;
}

export default function LenisWrapper({ children }: LenisWrapperProps) {
    return (
        <ReactLenis root autoRaf={false} options={{
            lerp: 0.08, // Heavy smooth feeling
            duration: 1.5,
            smoothWheel: true,
            wheelMultiplier: 1, // Sensitivity
        }}>
            <LenisGsapSync />
            {children}
        </ReactLenis>
    );
}
