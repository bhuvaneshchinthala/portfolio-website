import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';

const PROJECTS = [
    {
        id: 'p1',
        year: '2026',
        role: 'Computer Vision Engineer',
        techStack: 'Python • PyTorch • 3D Vision',
        description: 'Implements state-of-the-art 3D mesh reconstruction from single images. Features a custom "Midnight Studio" interface and optimized performance. SPAR3D improves upon the backside of the mesh by conditioning on a point cloud.',
        githubUrl: '#',
        liveUrl: '#',
        image: '/images/projects/spar3d.png',
        watermark: 'SPAR3D'
    },
    {
        id: 'p2',
        year: '2026',
        role: 'AI Research Engineer',
        techStack: 'Python • TensorFlow • Streamlit',
        description: 'VoltAI is an advanced AI-powered smart grid control system that uses a multi-agent architecture with LLM reasoning (Mistral via Ollama) to detect, analyze, and automatically resolve power grid violations.',
        githubUrl: '#',
        liveUrl: '#',
        image: '/images/projects/volt-ai.png',
        watermark: 'VOLTAI'
    },
    {
        id: 'p3',
        year: '2026',
        role: 'AI Developer',
        techStack: 'Python • Mistral • ChromaDB',
        description: 'A powerful document Q&A system that supports PDFs, text files, CSV, Excel, and images using a multi-agent architecture with a local LLM. Features 6 specialized AI agents including Planner, Retrieval, Reranker, and Reasoning.',
        githubUrl: '#',
        liveUrl: '#',
        image: '/images/projects/multimodal-rag.png',
        watermark: 'RAG AI'
    },
    {
        id: 'p4',
        year: '2026',
        role: 'Robotics Engineer',
        techStack: 'Python • PyTorch • OpenCV • YOLOv5',
        description: 'Real-time robotic pick-and-place system using YOLOv5 for biscuit detection and a regression model to map camera coordinates to XArm robot positions. Integrates live video processing, object localization, and automated gripping.',
        githubUrl: '#',
        liveUrl: '#',
        image: '/images/projects/robopick.png',
        watermark: 'ROBOPICK'
    },
    {
        id: 'p5',
        year: '2023 - 2024',
        role: 'AI Researcher',
        techStack: 'Python • PyTorch • Medical Imaging',
        description: 'A deep-learning system for 3D brain tumor segmentation using MRI scans. Uses a 3D U-Net to detect edema, tumor core, and enhancing regions across all MRI modalities. Achieves high Dice accuracy supporting medical diagnosis.',
        githubUrl: '#',
        liveUrl: '#',
        image: '/images/projects/brain3d.png',
        watermark: 'BRAIN 3D'
    },
    {
        id: 'p6',
        year: '2026',
        role: 'Machine Learning Researcher',
        techStack: 'Python • PyTorch • YOLOv5 • OpenCV',
        description: 'Implementing few-shot learning techniques to detect novel objects in autonomous driving scenarios. Utilizes a two-stage training approach with a CSPNet backbone and a Cosine Similarity Classifier for K-shot fine-tuning.',
        githubUrl: 'https://github.com/bhuvaneshchinthala/FEW-SHOT-LEARNING-',
        liveUrl: '#',
        image: '/images/projects/few-shot.png',
        watermark: 'FEW-SHOT OD'
    },
    {
        id: 'p7',
        year: '2026',
        role: 'NLP Researcher',
        techStack: 'Python • PyTorch • Hugging Face',
        description: 'An automated style-transfer system for Telugu text transcripts built using deep transformer backbones like RoBERTa. Dynamically rewrites transcripts into 9 customizable writing styles while perfectly preserving original meaning.',
        githubUrl: 'https://github.com/bhuvaneshchinthala/StyleRec-Benchmark-Dataset-for-Prompt-Recovery-in-Style-Transfer',
        liveUrl: '#',
        image: '/images/projects/telugu-nlp.png',
        watermark: 'STYLE TRANSFER'
    }
];

const ProjectImagePanel = ({ image, velocityRotate }: { image?: string, velocityRotate: any }) => {
    // Dynamic Holographic Glare based on scroll velocity tilt
    const glareX = useTransform(velocityRotate, [-25, 25], ["150%", "-50%"]);

    return (
        <Magnetic strength={0.2}>
            <motion.div
                style={{
                    rotateY: velocityRotate,
                    rotateZ: useTransform(velocityRotate, [-15, 15], [2, -2])
                }}
                className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] flex-shrink-0 perspective-1000 rotate-x-[5deg] translate-z-10 shadow-2xl transition-transform duration-200 group p-6 md:p-8"
            >
                {/* 1. Solid Black Brutalist Frame */}
                <div className="absolute inset-0 w-full h-full bg-[#050505] border-[3px] border-zinc-800 -z-20 transition-all duration-700 ease-out group-hover:border-red-600/50 shadow-[0_0_50px_rgba(0,0,0,0.9)]" />

                {/* Cyber-Corners (Anchored to the black frame) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-white/20 z-30 transition-all duration-500 ease-out group-hover:w-12 group-hover:h-12 group-hover:border-red-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-[4px] border-r-[4px] border-white/20 z-30 transition-all duration-500 ease-out group-hover:w-12 group-hover:h-12 group-hover:border-red-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[4px] border-l-[4px] border-white/20 z-30 transition-all duration-500 ease-out group-hover:w-12 group-hover:h-12 group-hover:border-red-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-white/20 z-30 transition-all duration-500 ease-out group-hover:w-12 group-hover:h-12 group-hover:border-red-500" />

                {/* Offset Defensive Shadow Plate (Deep Base) */}
                <div className="absolute top-8 left-8 w-[calc(100%-2rem)] h-[calc(100%-2rem)] bg-red-600/10 border border-red-500/10 blur-md -z-30 transition-all duration-700 ease-out group-hover:top-12 group-hover:left-12 group-hover:bg-red-600/20 group-hover:blur-xl" />

                {/* 2. Inner Primary Image Container */}
                <div className="relative w-full h-full bg-zinc-950/80 border-[0.5px] border-white/10 overflow-hidden z-10">

                    {/* Inner Tech Border (Dashed) */}
                    <div className="absolute inset-2 border-[1.5px] border-dashed border-white/10 z-20 transition-all duration-700 group-hover:border-red-500/40 group-hover:inset-3" />

                    {/* The Image Itself */}
                    {image ? (
                        <motion.img
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            src={image}
                            alt="Project Mockup"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950">
                            <span className="text-white/30 text-xs font-sans uppercase tracking-[0.3em]">Awaiting Visuals</span>
                        </div>
                    )}

                    {/* Dynamic Holographic Glare Layer (Bounded to image) */}
                    <motion.div
                        style={{ x: glareX }}
                        className="absolute top-0 bottom-0 pointer-events-none z-30 mix-blend-overlay w-[200%] flex items-center justify-center translate-x-[-25%]"
                    >
                        <div className="w-1/4 h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg]" />
                    </motion.div>
                </div>
            </motion.div>
        </Magnetic>
    );
};

const ProjectCard = ({
    project,
    progress,
    index,
    total,
    velocityRotate
}: {
    project: typeof PROJECTS[0],
    progress: any,
    index: number,
    total: number,
    velocityRotate: any
}) => {
    const opacity = useTransform(progress, (p: number) => {
        const center = index / (total - 1);
        const distance = Math.abs(p - center);
        const step = 1 / (total - 1);

        if (distance <= 0.05) return 1;
        if (distance >= step) return 0.2;

        const fadeRatio = (distance - 0.05) / (step - 0.05);
        return 1 - (fadeRatio * 0.8);
    });

    const scale = useTransform(progress, (p: number) => {
        const center = index / (total - 1);
        const distance = Math.abs(p - center);
        const step = 1 / (total - 1);

        if (distance <= 0.05) return 1;
        if (distance >= step) return 0.85;

        const fadeRatio = (distance - 0.05) / (step - 0.05);
        return 1 - (fadeRatio * 0.15);
    });

    // Reverse Parallax for Watermark
    // By mapping the global scroll progress across an arbitrary large movement array
    const watermarkX = useTransform(progress, [0, 1], ["-0%", "200%"]);

    // Massive Parallax Index Numbers (moves vertically relative to project)
    const numberY = useTransform(progress, [0, 1], ["60%", "-60%"]);

    return (
        <motion.div
            style={{ opacity, scale }}
            className="w-[100vw] h-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 px-8 flex-shrink-0 relative pt-32 md:pt-28"
        >
            {/* Massive Parallax Index Number */}
            <motion.div
                style={{ y: numberY }}
                className="absolute top-1/4 right-[5%] md:right-[20%] select-none pointer-events-none z-0"
            >
                <span className="text-[40vw] md:text-[30vw] font-black text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.06)] md:[-webkit-text-stroke:4px_rgba(255,255,255,0.06)] leading-none italic font-sans tracking-tighter">
                    {(index + 1).toString().padStart(2, '0')}
                </span>
            </motion.div>

            {/* Massive Watermark Text Behind Project with Parallax Float */}
            <motion.div
                style={{ x: watermarkX }}
                className="absolute bottom-10 left-[10%] select-none pointer-events-none opacity-5 md:opacity-10 z-0 mix-blend-overlay"
            >
                <h2 className="text-[20vw] font-black uppercase tracking-tighter text-white whitespace-nowrap">
                    {project.watermark}
                </h2>
            </motion.div>

            {/* Left Content Column */}
            <div className="w-full md:w-[500px] flex flex-col items-start gap-8 z-30 font-sans">

                <div className="flex flex-col gap-3 mb-2 md:mb-6">
                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter flex items-center flex-wrap">
                        {(() => {
                            const words = project.watermark.split(' ');
                            const firstWord = words[0];
                            const restOfWords = words.slice(1).join(' ');
                            return (
                                <>
                                    <span className="text-white drop-shadow-md">{firstWord}</span>
                                    {restOfWords && (
                                        <span className="text-[#CC0000] ml-3 drop-shadow-[0_0_15px_rgba(204,0,0,0.6)]">
                                            {restOfWords}
                                        </span>
                                    )}
                                </>
                            );
                        })()}
                    </h3>
                    <div className="h-1.5 w-16 bg-[#CC0000] rounded-full shadow-[0_0_10px_rgba(204,0,0,0.5)]"></div>
                </div>

                <div className="flex flex-col gap-1">
                    <h4 className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Year</h4>
                    <p className="text-xl md:text-2xl text-white font-medium">{project.year}</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h4 className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Role</h4>
                    <p className="text-xl md:text-2xl text-white font-medium">{project.role}</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h4 className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Tech Stack</h4>
                    <p className="text-sm md:text-base text-white font-medium">{project.techStack}</p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <h4 className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Description</h4>
                    <p className="text-sm text-white/70 leading-relaxed max-w-[400px]">
                        {project.description}
                    </p>
                </div>

                <div className="flex items-center gap-6 mt-6">
                    <a href={project.githubUrl} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                        Github <Github size={14} />
                    </a>
                    <a href={project.liveUrl} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                        Live <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* Right Panel with scroll-velocity 3D lean */}
            <div className="z-10 mt-12 md:mt-0">
                <ProjectImagePanel image={project.image} velocityRotate={velocityRotate} />
            </div>
        </motion.div>
    );
};

export default function ProjectsSection() {
    const targetRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress, scrollY } = useScroll({
        target: targetRef,
    });

    // Horizontal Scrolling Math
    const numProjects = PROJECTS.length;
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(numProjects - 1) * 100}vw`]);

    // Velocity Math for the 3D Lean effect
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    // Map velocity so that scrolling down leans phone left, scrolling up leans right
    const velocityRotate = useTransform(smoothVelocity, [-2000, 0, 2000], [25, 0, -25]);

    return (
        <section
            ref={targetRef}
            id="projects"
            className="relative bg-[#0a0a0a]"
            style={{ height: `${numProjects * 100}vh` }} // Make section tall enough to scroll horizontally
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center perspective-1000">

                {/* Sticky Header */}
                <div className="absolute top-12 md:top-24 left-8 md:left-[10vw] z-50 pointer-events-none">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-sans font-black tracking-tighter uppercase flex items-center flex-wrap"
                    >
                        <span className="text-white drop-shadow-md">SELECTED</span>
                        <span className="text-[#CC0000] ml-3 drop-shadow-[0_0_15px_rgba(204,0,0,0.6)]">WORKS</span>
                    </motion.h2>
                </div>

                {/* Horizontal Scrolling Track */}
                <motion.div
                    style={{ x }}
                    className="flex h-full w-max items-center"
                >
                    {PROJECTS.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            progress={scrollYProgress}
                            index={index}
                            total={numProjects}
                            velocityRotate={velocityRotate}
                        />
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
