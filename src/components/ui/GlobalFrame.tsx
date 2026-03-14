
export default function GlobalFrame() {
    return (
        <div className="fixed inset-0 z-[60] pointer-events-none">
            {/* Outer Frame (Subtle Red Glow) */}
            <div className="absolute inset-4 md:inset-6 border border-white/5 rounded-[2rem] shadow-[0_0_30px_rgba(255,40,0,0.05)] opacity-80" />

            {/* Inner Accent Lines (Red Tech Corners) */}
            {/* Top Left */}
            <div className="absolute top-6 left-6 w-12 h-[1px] bg-gradient-to-r from-red-600 to-transparent" />
            <div className="absolute top-6 left-6 w-[1px] h-12 bg-gradient-to-b from-red-600 to-transparent" />

            {/* Top Right */}
            <div className="absolute top-6 right-6 w-12 h-[1px] bg-gradient-to-l from-red-600 to-transparent" />
            <div className="absolute top-6 right-6 w-[1px] h-12 bg-gradient-to-b from-red-600 to-transparent" />

            {/* Bottom Left */}
            <div className="absolute bottom-6 left-6 w-12 h-[1px] bg-gradient-to-r from-red-600 to-transparent" />
            <div className="absolute bottom-6 left-6 w-[1px] h-12 bg-gradient-to-t from-red-600 to-transparent" />

            {/* Bottom Right */}
            <div className="absolute bottom-6 right-6 w-12 h-[1px] bg-gradient-to-l from-red-600 to-transparent" />
            <div className="absolute bottom-6 right-6 w-[1px] h-12 bg-gradient-to-t from-red-600 to-transparent" />

            {/* Vignette Overlay for Depth */}
            <div
                className="absolute inset-0 rounded-[2rem]"
                style={{
                    boxShadow: 'inset 0 0 150px rgba(0,0,0,0.7)'
                }}
            />
        </div>
    );
}
