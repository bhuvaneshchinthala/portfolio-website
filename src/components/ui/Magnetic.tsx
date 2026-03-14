
import { useRef, useState, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticProps {
    children: ReactNode;
    strength?: number; // How strong the magnetic pull is (default 0.5)
}

export default function Magnetic({ children, strength = 0.5 }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Use spring physics for smooth return
    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();

        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        x.set(middleX * strength);
        y.set(middleY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
}
