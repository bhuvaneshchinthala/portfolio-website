import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll } from 'framer-motion';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

import SectionHeading from '@/components/ui/SectionHeading';
import TextMotionOverlay from '@/components/TextMotionOverlay';
import VideoScrollCanvas from '@/components/VideoScrollCanvas';

// ─────────────────────────────────────────────
// Sub-Component: Magnetic Submit Button
// ─────────────────────────────────────────────
const MagneticSubmitButton = ({ isSubmitting, isSent }: { isSubmitting: boolean, isSent: boolean }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const smoothX = useSpring(x, springConfig);
    const smoothY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current || isSubmitting || isSent) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // The pull factor (0.3) dictates how strongly the button snaps toward the mouse
        x.set((e.clientX - centerX) * 0.3);
        y.set((e.clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: smoothX, y: smoothY }}
            type="submit"
            disabled={isSubmitting || isSent}
            className="group relative w-full md:w-auto md:min-w-[200px] overflow-hidden bg-white text-black font-black py-5 px-10 rounded-full transition-all duration-500 disabled:opacity-50 hover:scale-[1.02]"
        >
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1)" />

            <span className="relative z-10 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase group-hover:text-white transition-colors duration-300">
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> SENDING
                    </>
                ) : isSent ? (
                    "MESSAGE SENT"
                ) : (
                    <>
                        SEND MESSAGE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </span>
        </motion.button>
    );
};

export default function ContactSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        projectType: 'Web Development',
        message: '',
        _botcheck: '' // Honeypot field
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('name', formState.name);
            formData.append('email', formState.email);
            formData.append('projectType', formState.projectType);
            formData.append('message', formState.message);
            formData.append('_botcheck', formState._botcheck);

            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message');
            }

            setIsSent(true);
            setFormState({ name: '', email: '', projectType: 'Web Development', message: '', _botcheck: '' });
            setTimeout(() => setIsSent(false), 5000);
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section ref={containerRef} id="contact" className="pb-32 px-6 relative z-10 overflow-hidden min-h-screen flex items-center justify-center">
            {/* Background Scroll Video Canvas */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <VideoScrollCanvas 
                    scrollProgress={scrollYProgress} 
                    folder="/frames2" 
                    frameCount={169}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <SectionHeading
                    number="05."
                    title="GET_IN"
                    titleHighlight="TOUCH"
                    label="CONTACT_PROTOCOL"
                    className="mb-16"
                />

                <div className="text-center mb-16">
                    <p className="font-paragraph text-xl text-muted-gray max-w-2xl mx-auto">
                        Have a project in mind? I'd love to hear about it. Let's build something that defies expectations.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative max-w-5xl mx-auto"
                >
                    <div className="relative backdrop-blur-2xl rounded-3xl p-8 md:p-16 overflow-hidden border border-white/5 bg-[#0a0a0a]/80 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]">

                        {/* Subtle Glass Gradient/Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-12 relative z-10">

                            {/* Honeypot Field (Hidden) */}
                            <input 
                                type="checkbox" 
                                name="_botcheck" 
                                className="hidden" 
                                style={{ display: 'none' }}
                                checked={formState._botcheck === 'true'}
                                onChange={(e) => setFormState({ ...formState, _botcheck: e.target.checked ? 'true' : '' })}
                            />

                            {/* Error Message */}
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Name Input */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formState.name}
                                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                        className="peer w-full bg-transparent border-0 border-b border-white/20 py-4 text-xl md:text-2xl text-white placeholder-transparent focus:outline-none focus:ring-0 transition-colors"
                                        placeholder="Name"
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-red-500"
                                    >
                                        Your Name
                                    </label>
                                    {/* Animated Red Line */}
                                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-500 peer-focus:w-full box-shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                                </div>

                                {/* Email Input */}
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        className="peer w-full bg-transparent border-0 border-b border-white/20 py-4 text-xl md:text-2xl text-white placeholder-transparent focus:outline-none focus:ring-0 transition-colors"
                                        placeholder="Email"
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-red-500"
                                    >
                                        Your Email
                                    </label>
                                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-500 peer-focus:w-full box-shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                                </div>
                            </div>

                            {/* Project Type Select */}
                            <div className="relative group">
                                <select
                                    id="projectType"
                                    value={formState.projectType}
                                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                                    className="peer w-full bg-transparent border-0 border-b border-white/20 py-4 text-xl md:text-2xl text-white focus:outline-none focus:ring-0 transition-colors appearance-none cursor-pointer"
                                >
                                    <option className="bg-[#0a0a0a]">Web Development</option>
                                    <option className="bg-[#0a0a0a]">AI / Machine Learning</option>
                                    <option className="bg-[#0a0a0a]">Deep Learning / Computer Vision</option>
                                    <option className="bg-[#0a0a0a]">Data Engineering</option>
                                    <option className="bg-[#0a0a0a]">Mobile App</option>
                                    <option className="bg-[#0a0a0a]">UI/UX Design</option>
                                    <option className="bg-[#0a0a0a]">Consulting</option>
                                    <option className="bg-[#0a0a0a]">Other</option>
                                </select>
                                <label
                                    htmlFor="projectType"
                                    className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest"
                                >
                                    I'm interested in...
                                </label>
                                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-500 peer-focus:w-full" />
                            </div>

                            {/* Message Textarea */}
                            <div className="relative group">
                                <textarea
                                    id="message"
                                    required
                                    rows={1}
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="peer w-full bg-transparent border-0 border-b border-white/20 py-4 text-xl md:text-2xl text-white placeholder-transparent focus:outline-none focus:ring-0 transition-colors resize-none min-h-[60px]"
                                    placeholder="Message"
                                />
                                <label
                                    htmlFor="message"
                                    className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-red-500"
                                >
                                    Tell me about your project
                                </label>
                                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-500 peer-focus:w-full box-shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                            </div>

                            {/* Magnetic Submit Button */}
                            <div className="pt-8">
                                <MagneticSubmitButton isSubmitting={isSubmitting} isSent={isSent} />
                            </div>

                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
