import React, { useState } from 'react';
import { ExternalLink, Github, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_URL } from '../../context/AuthContext';

// Tilt Wrapper Component for cards
const TiltCard = ({ children, onClick }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const degX = (y / (box.height / 2)) * -10; // tilt speed
    const degY = (x / (box.width / 2)) * 10;
    setTilt({ x: degX, y: degY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-none rounded-xl overflow-hidden glass-panel p-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
};

const Projects = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const defaultProjects = [
    {
      _id: '1',
      title: '3D Interactive Portfolio',
      description: 'A stunning portfolio website built using R3F, Framer Motion, and Node.js. Incorporates fully dynamic administration APIs and database-backed seed elements.',
      techStack: ['React', 'Three.js', 'Framer Motion', 'Node.js', 'MongoDB'],
      liveLink: 'https://awaisali022.github.io/3d-portfolio/  ',
      githubLink: 'https://github.com/awaisali022/3d-portfolio',
      category: 'Frontend & 3D',
      featured: true,
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600']
    },
    {
      _id: '2',
      title: 'E-Commerce Platform',
      description: 'Full stack online retail catalog featuring Stripe integrations, vendor invoice dashboards, database search matrices, and real-time inventory systems.',
      techStack: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB'],
      liveLink: 'https://example.com',
      githubLink: 'https://github.com',
      category: 'Full Stack',
      featured: true,
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600']
    }
  ];

  const activeProjects = projects.length > 0 ? projects : defaultProjects;
  
  // Categories derived dynamically
  const categories = ['All', ...new Set(activeProjects.map((p) => p.category))];

  const filteredProjects = activeFilter === 'All'
    ? activeProjects
    : activeProjects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            Featured <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                activeFilter === filter
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'glass-panel text-light-muted dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <TiltCard key={project._id} onClick={() => setSelectedProject(project)}>
              {/* Image box */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 group/img">
                <img
                  src={project.images[0]
                    ? (project.images[0].startsWith('http') ? project.images[0] : `${BACKEND_URL}${project.images[0]}`)
                    : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                />
                {project.featured && (
                  <span className="absolute top-2 right-2 flex items-center bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md">
                    <Award className="w-3 h-3 mr-1" /> Featured
                  </span>
                )}
              </div>

              {/* Text Meta */}
              <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text mb-2 group-hover:text-indigo-500 transition-colors">
                {project.title}
              </h3>
              
              <p className="font-sans text-xs sm:text-sm text-light-muted dark:text-dark-muted line-clamp-2 mb-4">
                {project.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-light-muted dark:text-dark-muted">
                    +{project.techStack.length - 4} more
                  </span>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Full-Detail Modal Popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl rounded-2xl glass-panel max-h-[90vh] overflow-y-auto p-5 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-light-text dark:text-dark-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Category */}
              <div className="mb-4">
                <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 tracking-wider uppercase">
                  {selectedProject.category}
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text mt-1">
                  {selectedProject.title}
                </h2>
              </div>

              {/* Main Image Slider/Preview */}
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 bg-gray-900 border border-black/10 dark:border-white/10">
                <img
                  src={selectedProject.images[0]
                    ? (selectedProject.images[0].startsWith('http') ? selectedProject.images[0] : `${BACKEND_URL}${selectedProject.images[0]}`)
                    : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Project Description */}
              <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text mb-2">
                Overview
              </h3>
              <p className="font-sans text-sm sm:text-base text-light-muted dark:text-dark-muted mb-6 leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Project Tech Stack */}
              <h3 className="font-display font-bold text-base text-light-text dark:text-dark-text mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 border-t border-black/5 dark:border-white/5 pt-6">
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-indigo-500/10 hover:scale-[1.02] transition-all"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                  </a>
                )}
                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-6 py-3 bg-transparent border border-black/15 dark:border-white/15 text-light-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-sm font-semibold hover:scale-[1.02] transition-all"
                  >
                    <Github className="w-4 h-4 mr-2" /> GitHub Repository
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
