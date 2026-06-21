import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillCard = ({ skill }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (skill.proficiency / 100) * circumference;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-5 rounded-xl flex flex-col items-center justify-center hover:scale-[1.03] transition-all hover:shadow-indigo-500/10 group cursor-default"
    >
      <div className="relative w-20 h-20 flex items-center justify-center mb-3">
        {/* SVG Circular Progress Meter */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-black/5 dark:stroke-white/5 fill-transparent"
            strokeWidth="5"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-indigo-500 dark:stroke-indigo-400 fill-transparent"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference
            }}
          />
        </svg>
        <span className="absolute font-display font-bold text-light-text dark:text-dark-text text-sm group-hover:scale-110 transition-transform">
          {skill.proficiency}%
        </span>
      </div>
      
      <h4 className="font-display font-semibold text-center text-sm sm:text-base text-light-text dark:text-dark-text">
        {skill.name}
      </h4>
      <span className="text-[10px] font-sans text-light-muted dark:text-dark-muted tracking-widest uppercase mt-1">
        {skill.category}
      </span>
    </motion.div>
  );
};

const Skills = ({ skills = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Hardcoded fallback list if the database is unpopulated or loading
  const defaultSkills = [
    { name: 'React.js', category: 'Frontend', proficiency: 95 },
    { name: 'JavaScript / ES6', category: 'Frontend', proficiency: 90 },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 90 },
    { name: 'Three.js / R3F', category: 'Frontend', proficiency: 80 },
    { name: 'Node.js & Express', category: 'Backend', proficiency: 88 },
    { name: 'MongoDB & Mongoose', category: 'Backend', proficiency: 85 },
    { name: 'REST APIs', category: 'Backend', proficiency: 90 },
    { name: 'Git & GitHub', category: 'Tools', proficiency: 90 },
    { name: 'Figma', category: 'Design', proficiency: 75 }
  ];

  const activeSkills = skills.length > 0 ? skills : defaultSkills;
  
  // Extract distinct categories dynamically
  const categories = ['All', ...new Set(activeSkills.map((s) => s.category))];

  const filteredSkills = activeCategory === 'All'
    ? activeSkills
    : activeSkills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            My <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Skills</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass-panel text-light-muted dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill._id || skill.name} skill={skill} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
