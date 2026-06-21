import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { BACKEND_URL } from '../../context/AuthContext';

const TimelineItem = ({ title, subtitle, duration, location, details, type }) => {
  const isWork = type === 'work';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="relative pl-8 pb-10 border-l border-black/10 dark:border-white/10 last:pb-0"
    >
      {/* Icon Bullet */}
      <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0d0d14] border-2 border-indigo-500 flex items-center justify-center text-indigo-500 shadow-md">
        {isWork ? <Briefcase className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
      </div>

      {/* Date badge */}
      <div className="flex items-center text-xs font-semibold text-indigo-500 dark:text-indigo-400 mb-2 space-x-2">
        <Calendar className="w-3.5 h-3.5" />
        <span>{duration}</span>
      </div>

      {/* Card Content */}
      <div className="glass-panel p-5 sm:p-6 rounded-xl hover:shadow-indigo-500/5 transition-all">
        <h4 className="font-display font-bold text-base sm:text-lg text-light-text dark:text-dark-text">
          {title}
        </h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-light-muted dark:text-dark-muted mt-1 mb-3">
          <span>{subtitle}</span>
          {location && (
            <span className="flex items-center text-xs text-light-muted/70 dark:text-dark-muted/70">
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </span>
          )}
        </div>

        {Array.isArray(details) ? (
          <ul className="list-disc list-inside text-xs sm:text-sm text-light-muted dark:text-dark-muted space-y-1.5 leading-relaxed">
            {details.map((point, index) => (
              <li key={index} className="pl-1">
                {point}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted leading-relaxed">
            {details}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const Resume = ({ experience = [], education = [], resumeUrl = '' }) => {
  // Static fallback values
  const defaultExperience = [
    {
      company: 'Vertex Tech Solutions',
      role: 'Senior Full Stack Developer',
      location: 'Remote / Islamabad',
      description: [
        'Led a team of 4 developers to build enterprise ERP platforms using MERN stack.',
        'Developed interactive 3D product customizers with R3F increasing user dwell time by 50%.',
        'Built secure REST APIs and microservices serving 100k+ daily requests.'
      ],
      startDate: 'Jan 2024',
      endDate: 'Present'
    },
    {
      company: 'PixelForge Studios',
      role: 'Full Stack Developer',
      location: 'Lahore, Pakistan',
      description: [
        'Built client websites and admin management applications.',
        'Optimized site bundle chunks reducing page speeds by 30%.',
        'Implemented Stripe checkout pipelines for e-commerce checkouts.'
      ],
      startDate: 'Aug 2022',
      endDate: 'Dec 2023'
    }
  ];

  const defaultEducation = [
    {
      institution: 'NUST',
      degree: 'BS Computer Science',
      description: 'Graduated with Honors. Specialized in Software Engineering, DBMS, and human-computer interactions.',
      startDate: 'Sep 2018',
      endDate: 'Jul 2022'
    }
  ];

  const activeExperience = experience.length > 0 ? experience : defaultExperience;
  const activeEducation = education.length > 0 ? education : defaultEducation;
  const fullResumeUrl = resumeUrl
    ? (resumeUrl.startsWith('http') ? resumeUrl : `${BACKEND_URL}${resumeUrl}`)
    : '';

  return (
    <section id="resume" className="py-24 bg-[#0a0a0f]/50 dark:bg-black/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            My <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Timeline</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />

          {/* Download Resume Link Button */}
          {fullResumeUrl && (
            <div className="mt-8 flex justify-center">
              <a
                href={fullResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30 rounded-lg text-sm font-semibold hover:scale-[1.03] transition-all"
              >
                <FileText className="w-4 h-4 mr-2" /> Download PDF Resume
              </a>
            </div>
          )}
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Experience Column */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <Briefcase className="w-6 h-6 text-indigo-500" />
              <h3 className="font-display font-bold text-xl sm:text-2xl text-light-text dark:text-dark-text">
                Work Experience
              </h3>
            </div>
            
            <div className="relative">
              {activeExperience.map((exp, idx) => (
                <TimelineItem
                  key={idx}
                  title={exp.role}
                  subtitle={exp.company}
                  duration={`${exp.startDate} - ${exp.endDate}`}
                  location={exp.location}
                  details={exp.description}
                  type="work"
                />
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <GraduationCap className="w-6 h-6 text-purple-500" />
              <h3 className="font-display font-bold text-xl sm:text-2xl text-light-text dark:text-dark-text">
                Education
              </h3>
            </div>

            <div className="relative">
              {activeEducation.map((edu, idx) => (
                <TimelineItem
                  key={idx}
                  title={edu.degree}
                  subtitle={edu.institution}
                  duration={`${edu.startDate} - ${edu.endDate}`}
                  location={edu.fieldOfStudy}
                  details={edu.description}
                  type="edu"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
