import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface NavItem {
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: 'Home', id: 'hero' },
  { label: 'Code', id: 'terminal' },
  { label: 'Projects', id: 'projects' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

export default function CenteredNavigation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 z-10 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-4xl mx-auto"
      >
        {/* Decorative circles */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 border border-white/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 border border-white/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Main navigation container */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-0">
          {/* Title */}
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4">
              Navigate
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto" />
          </motion.div>

          {/* Navigation items in a circular/grid pattern */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 w-full"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => scrollToSection(item.id)}
                className="group relative h-32 md:h-40 flex items-center justify-center"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm"
                  animate={{
                    borderColor:
                      hoveredIndex === index ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor:
                      hoveredIndex === index ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      index === 0
                        ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
                        : index === 1
                          ? 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%)'
                          : index === 2
                            ? 'radial-gradient(circle at center, rgba(236, 72, 153, 0.2) 0%, transparent 70%)'
                            : index === 3
                              ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%)'
                              : 'radial-gradient(circle at center, rgba(251, 146, 60, 0.2) 0%, transparent 70%)',
                  }}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                      y: hoveredIndex === index ? -4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-heading text-3xl md:text-4xl font-bold text-white block mb-2">
                      {item.label}
                    </span>
                    <motion.div
                      className="h-0.5 w-0 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"
                      animate={{
                        width: hoveredIndex === index ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </div>

                {/* Corner accents */}
                <motion.div
                  className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20 rounded-tl"
                  animate={{
                    borderColor: hoveredIndex === index ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                  }}
                />
                <motion.div
                  className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20 rounded-br"
                  animate={{
                    borderColor: hoveredIndex === index ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                  }}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-16 text-center font-paragraph text-muted-gray max-w-2xl"
          >
            Explore my work, skills, and get in touch. Each section reveals a different aspect of my digital journey.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
