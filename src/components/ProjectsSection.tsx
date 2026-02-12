import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import { Image } from '@/components/ui/image';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<Projects>('projects');
      setProjects(result.items);
      setIsLoading(false);
    };

    loadProjects();
  }, []);

  // Bento grid layout patterns
  const getBentoClass = (index: number) => {
    const patterns = [
      'md:col-span-2 md:row-span-2', // Large
      'md:col-span-1 md:row-span-1', // Small
      'md:col-span-1 md:row-span-2', // Tall
      'md:col-span-2 md:row-span-1', // Wide
      'md:col-span-1 md:row-span-1', // Small
      'md:col-span-2 md:row-span-2', // Large
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section id="projects" className="relative py-32 px-8">
      <div className="max-w-[120rem] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-light-gray bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="font-paragraph text-secondary text-lg max-w-2xl mx-auto">
            A curated collection of digital experiences, each crafted with precision and innovation.
          </p>
        </motion.div>

        {/* Reserve space to prevent layout shift */}
        <div className="min-h-[800px]">
          {isLoading ? null : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl ${getBentoClass(index)}`}
                  onMouseEnter={() => setHoveredId(project._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    transform: hoveredId === project._id ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {/* Glassmorphism card */}
                  <div className="absolute inset-0 bg-overlay backdrop-blur-xl border border-muted-gray/20 rounded-2xl" />

                  {/* Project thumbnail */}
                  {project.projectThumbnail && (
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                      <Image
                        src={project.projectThumbnail}
                        alt={project.projectTitle || 'Project thumbnail'}
                        width={800}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover:text-light-gray transition-colors duration-300">
                        {project.projectTitle}
                      </h3>
                      <p className="font-paragraph text-secondary text-sm md:text-base leading-relaxed mb-4">
                        {project.shortDescription}
                      </p>
                      {project.techStackTags && (
                        <div className="flex flex-wrap gap-2">
                          {project.techStackTags.split(',').map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-overlay border border-muted-gray/30 rounded-full text-xs font-paragraph text-light-gray"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 mt-6">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-foreground text-deep-black rounded-full text-sm font-paragraph font-medium hover:bg-light-gray transition-all duration-300 hover:scale-105"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                      {project.gitHubUrl && (
                        <a
                          href={project.gitHubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-foreground text-foreground rounded-full text-sm font-paragraph font-medium hover:bg-foreground hover:text-deep-black transition-all duration-300 hover:scale-105"
                        >
                          <Github size={16} />
                          Code
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-paragraph text-secondary text-lg">
                No projects available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
