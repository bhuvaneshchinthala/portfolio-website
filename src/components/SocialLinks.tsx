import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

const socialLinks = [
    {
        name: 'GitHub',
        url: 'https://github.com/bhuvaneshchinthala',
        icon: Github,
        color: 'hover:text-white',
        borderColor: 'hover:border-white/50'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/bhuvanesh-chinthala',
        icon: Linkedin,
        color: 'hover:text-blue-400',
        borderColor: 'hover:border-blue-400/50'
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com/bhuvxnesh_26',
        icon: Instagram,
        color: 'hover:text-pink-500',
        borderColor: 'hover:border-pink-500/50'
    }
];

export default function SocialLinks() {
    return (
        <section className="py-20 relative z-20 flex flex-col items-center justify-center overflow-hidden">
            {/* Background Porsche Image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <img 
                    src="/images/porsche.png" 
                    alt="Porsche Background" 
                    className="w-full h-full object-cover object-center opacity-30 mix-blend-screen"
                />
                {/* Dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-[1]" />
            </div>

            {/* Section Heading specific for Socials */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
            >
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Connect</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    FIND ME <span className="text-[#ff2800]">ON</span>
                </h3>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-6 px-4">
                {socialLinks.map((social, index) => (
                    <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                        }}
                        whileHover={{ scale: 1.08, y: -5 }} // Scale and lift
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            y: [0, -8, 0], // Subtle floating animation
                            transition: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.5 // Stagger the float
                            }
                        }}
                        className={`
                            group relative flex items-center gap-4 px-8 py-5 
                            bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem]
                            transition-all duration-500
                            hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:border-red-500/50
                        `}
                    >
                        {/* Glow Effect Element */}
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className={`p-3 rounded-full bg-white/5 group-hover:bg-red-600/20 transition-colors duration-300`}>
                            <social.icon size={24} className="text-gray-300 group-hover:text-red-500 transition-colors duration-300" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 tracking-wider font-medium group-hover:text-gray-400 transition-colors">FOLLOW ON</span>
                            <span className="text-lg font-bold text-white tracking-wide group-hover:text-red-100 transition-colors flex items-center gap-1">
                                {social.name}
                            </span>
                        </div>

                        <ArrowUpRight
                            size={18}
                            className="text-gray-600 group-hover:text-red-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 ml-2"
                        />
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
