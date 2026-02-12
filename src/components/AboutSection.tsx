import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Skills } from '@/entities';
import { Image } from '@/components/ui/image';
import { ExternalLink } from 'lucide-react';

export default function AboutSection() {
  const [skills, setSkills] = useState<Skills[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadSkills = async () => {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<Skills>('skills');
      setSkills(result.items);
      setIsLoading(false);
    };

    loadSkills();
  }, []);

  const categories = ['all', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))];
  
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  return (
    <section id="about" className="relative py-32 px-8">
      <div className="max-w-[120rem] mx-auto">
        {/* About Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-light-gray bg-clip-text text-transparent">
            About & Expertise
          </h2>
          <p className="font-paragraph text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
            A passionate developer and designer dedicated to creating immersive digital experiences. 
            With expertise spanning multiple technologies and frameworks, I transform ideas into 
            high-performance, visually stunning applications that push the boundaries of what's possible on the web.
          </p>
        </motion.div>

        {/* Skills Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
              Technical Skills
            </h3>

            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-paragraph text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-foreground text-deep-black'
                      : 'bg-overlay border border-muted-gray/30 text-secondary hover:text-foreground hover:border-foreground'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Reserve space to prevent layout shift */}
          <div className="min-h-[400px]">
            {isLoading ? null : filteredSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative"
                  >
                    {/* Glassmorphism card */}
                    <div className="relative bg-overlay backdrop-blur-xl border border-muted-gray/20 rounded-2xl p-6 hover:border-foreground/30 transition-all duration-300 h-full">
                      {/* Icon */}
                      {skill.icon && (
                        <div className="mb-4 w-16 h-16 rounded-xl bg-overlay border border-muted-gray/30 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={skill.icon}
                            alt={skill.skillName || 'Skill icon'}
                            width={48}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      )}

                      {/* Skill name */}
                      <h4 className="font-heading text-xl font-bold mb-2 text-foreground group-hover:text-light-gray transition-colors duration-300">
                        {skill.skillName}
                      </h4>

                      {/* Category badge */}
                      {skill.category && (
                        <span className="inline-block px-3 py-1 bg-overlay border border-muted-gray/30 rounded-full text-xs font-paragraph text-light-gray mb-3">
                          {skill.category}
                        </span>
                      )}

                      {/* Description */}
                      {skill.description && (
                        <p className="font-paragraph text-secondary text-sm leading-relaxed mb-4">
                          {skill.description}
                        </p>
                      )}

                      {/* Proficiency level */}
                      {skill.proficiencyLevel !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-paragraph text-xs text-secondary">Proficiency</span>
                            <span className="font-paragraph text-xs text-foreground font-medium">
                              {skill.proficiencyLevel}%
                            </span>
                          </div>
                          <div className="w-full h-1 bg-overlay rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiencyLevel}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.05 }}
                              className="h-full bg-gradient-to-r from-foreground to-light-gray"
                            />
                          </div>
                        </div>
                      )}

                      {/* Documentation link */}
                      {skill.documentationUrl && (
                        <a
                          href={skill.documentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-paragraph text-secondary hover:text-foreground transition-colors duration-300"
                        >
                          <ExternalLink size={14} />
                          Documentation
                        </a>
                      )}

                      {/* Hover glow effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-secondary text-lg">
                  No skills available in this category.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="max-w-4xl mx-auto bg-overlay backdrop-blur-xl border border-muted-gray/20 rounded-2xl p-12">
            <h3 className="font-heading text-3xl font-bold mb-6 text-foreground">
              Let's Build Something Amazing
            </h3>
            <p className="font-paragraph text-secondary text-lg leading-relaxed mb-8">
              I'm always excited to collaborate on innovative projects and explore new technological frontiers. 
              Whether you have a vision that needs execution or a challenge that requires creative problem-solving, 
              let's connect and create something extraordinary together.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-foreground text-deep-black rounded-full font-paragraph font-semibold text-base hover:bg-light-gray transition-all duration-300 hover:scale-105"
            >
              Get In Touch
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
