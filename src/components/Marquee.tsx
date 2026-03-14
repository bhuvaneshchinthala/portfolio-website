import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import React, { useRef } from "react";

// Sub-component for individual items to allow hover interactions
const MarqueeItem = ({ text, styleType }: { text: string; styleType: "red" | "white" | "outline" }) => {
  let styleClasses = "cursor-pointer ";
  let glowingStyle: any = {};

  if (styleType === "red") {
    styleClasses += "text-[#ff2800] font-black";
  } else if (styleType === "white") {
    styleClasses += "text-white font-black italic";
  } else if (styleType === "outline") {
    styleClasses += "text-transparent font-black italic";
    glowingStyle = {
      WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.4)",
    };
  }

  // Animation variants for the high-end interaction
  const itemVariants = {
    rest: {
      scale: 1,
      letterSpacing: "0px",
      textShadow: styleType === "red" ? "0 0 10px rgba(255, 40, 0, 0.3)" : "0 0 0px rgba(0,0,0,0)",
      filter: "brightness(1)",
    },
    hover: {
      scale: 1.15,
      letterSpacing: "6px",
      textShadow: styleType === "red"
        ? "0 0 40px rgba(255, 40, 0, 0.8), 0 0 80px rgba(255, 40, 0, 0.4)"
        : styleType === "white"
          ? "0 0 20px rgba(255, 255, 255, 0.8)"
          : "0 0 20px rgba(255, 255, 255, 0.5)",
      filter: "brightness(1.5)",
      WebkitTextStroke: styleType === "outline" ? "2px rgba(255, 255, 255, 1)" : glowingStyle.WebkitTextStroke,
      color: styleType === "outline" ? "white" : undefined,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    }
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={itemVariants as any}
      className={`inline-flex items-center px-4 md:px-8 group ${styleClasses}`}
      style={glowingStyle}
    >
      <span>{text}</span>
      <motion.span
        variants={{
          rest: { color: "rgba(255,255,255,0.2)", scale: 1, rotate: 0 },
          hover: { color: "#ff2800", scale: 1.2, rotate: 180, transition: { type: "spring", stiffness: 300, damping: 10 } }
        }}
        className="font-light mx-4 md:mx-8 text-xl md:text-3xl not-italic"
        style={{ textShadow: "none", WebkitTextStroke: "0px" }}
      >
        //
      </motion.span>
    </motion.div>
  );
};

// Advanced Velocity-based Parallax Marquee Row
function ParallaxRow({ children, baseVelocity = 100 }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Transform velocity into a multiplier for speed and skew
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3], {
    clamp: false
  });

  // Dynamic Skew Effect - Skews the text when scrolling fast
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [3, -3]);
  const scale = useTransform(smoothVelocity, [-1000, 0, 1000], [1.02, 1, 1.02]);

  /**
   * This is a magic wrapping for the length of the text - you
   * have to replace for wrapping that works for you or dynamically
   * calculate
   */
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // change direction based on scroll velocity if desired, or just speed up
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  // Helper function to wrap values
  function wrap(min: number, max: number, v: number) {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  }

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 leading-[1.1] py-2">
      <motion.div
        className="flex whitespace-nowrap text-4xl md:text-5xl lg:text-7xl tracking-wide uppercase font-bold"
        style={{ x, skewX, scale }}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  const wordsTop = [
    { text: "STRENGTH", type: "red" as const },
    { text: "DISCIPLINE", type: "outline" as const },
    { text: "ENDURANCE", type: "red" as const },
    { text: "LEGACY", type: "white" as const },
  ];

  const wordsBottom = [
    { text: "DEDICATION", type: "red" as const },
    { text: "AESTHETICS", type: "outline" as const },
    { text: "FOCUS", type: "red" as const },
    { text: "DOMINANCE", type: "white" as const },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-deep-black py-16 lg:py-24 flex flex-col items-center justify-center border-y border-white/5">

      {/* Reduced Ambient Glow Behind Marquee */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[200px] bg-[#ff2800] rounded-[100%] blur-[120px] opacity-10 pointer-events-none" />

      {/* Grid Background Overlays for Sci-Fi Effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwaC0yMHYtMjB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=')] opacity-10 pointer-events-none" />

      <div className="w-full relative z-10 flex flex-col gap-4 md:gap-8 transform -rotate-[1deg] scale-[1.02]">

        {/* Row 1 - Moves Left */}
        <ParallaxRow baseVelocity={-1.5}>
          {wordsTop.map((item, index) => (
            <MarqueeItem key={index} text={item.text} styleType={item.type} />
          ))}
        </ParallaxRow>

        {/* Row 2 - Moves Right */}
        <ParallaxRow baseVelocity={1}>
          {wordsBottom.map((item, index) => (
            <MarqueeItem key={index} text={item.text} styleType={item.type} />
          ))}
        </ParallaxRow>

      </div>

      {/* Screen edges fade */}
      <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-deep-black to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-deep-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
