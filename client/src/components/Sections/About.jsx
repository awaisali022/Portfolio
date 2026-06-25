import React, { useEffect, useState, useRef } from 'react';
import { Award, FolderKanban, Users2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BACKEND_URL } from '../../context/AuthContext';

// Pure React Count-Up Component
const Counter = ({ value, duration = 1500, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end <= 0) return;

    const stepTime = Math.max(Math.floor(duration / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, trigger]);

  return <span>{count}</span>;
};

const About = ({ settings }) => {
  const bioText = settings?.aboutBio || 'Full Stack Developer with a passion for clean architectures and beautiful user experiences.';
  const yearsExp = settings?.yearsExperience || 4;
  const projectsComp = settings?.projectsCompleted || 25;
  const clientsCount = settings?.happyClients || 15;
  const rawAvatar = settings?.aboutImage || '';
  const avatarUrl = rawAvatar
    ? (rawAvatar.startsWith('http') ? rawAvatar : `${BACKEND_URL}${rawAvatar}`)
    : 'https://raw.githubusercontent.com/awaisali022/Projects-picsk-/main/personal%20picks_01.png';

  // Parallax Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  // Intersection Observer for Counter triggers
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // Trigger once
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const degX = (y / (box.height / 2)) * -12; // tilt depth factor
    const degY = (x / (box.width / 2)) * 12;
    setTilt({ x: degX, y: degY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-[#0a0a0f]/50 dark:bg-black/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            About <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Parallax Avatar Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl cursor-none overflow-hidden glass-panel p-2 shadow-2xl transition-transform duration-200"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Outer glowing borders inside the panel */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <img
                src={avatarUrl}
                alt="Awais Ali Profile"
                className="w-full h-full object-cover rounded-xl select-none"
              />
            </div>
          </div>

          {/* Description Text Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <h3 className="font-display font-bold text-2xl text-light-text dark:text-dark-text">
              Crafting Digital Realities with Clean Code
            </h3>
            <p className="font-sans text-light-muted dark:text-dark-muted text-base sm:text-lg leading-relaxed">
              {bioText}
            </p>
            <p className="font-sans text-light-muted dark:text-dark-muted text-sm sm:text-base leading-relaxed">
              My development philosophy focuses heavily on writing maintainable code, implementing modular architectures, and optimizing load performative matrices. I thrive on collaborating across teams to bring dynamic, three-dimensional designs into responsive products.
            </p>

            {/* Counters Section */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6">
              {/* Counter Card 1 */}
              <div className="glass-panel p-4 rounded-xl text-center">
                <Award className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
                  <Counter value={yearsExp} trigger={isInView} />+
                </span>
                <span className="text-xs sm:text-sm font-sans font-medium text-light-muted dark:text-dark-muted">
                  Years Experience
                </span>
              </div>

              {/* Counter Card 2 */}
              <div className="glass-panel p-4 rounded-xl text-center">
                <FolderKanban className="w-6 h-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
                  <Counter value={projectsComp} trigger={isInView} />+
                </span>
                <span className="text-xs sm:text-sm font-sans font-medium text-light-muted dark:text-dark-muted">
                  Projects Completed
                </span>
              </div>

              {/* Counter Card 3 */}
              <div className="glass-panel p-4 rounded-xl text-center">
                <Users2 className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
                  <Counter value={clientsCount} trigger={isInView} />+
                </span>
                <span className="text-xs sm:text-sm font-sans font-medium text-light-muted dark:text-dark-muted">
                  Happy Clients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
