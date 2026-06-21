import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Sections/Hero';
import About from '../components/Sections/About';
import Skills from '../components/Sections/Skills';
import Resume from '../components/Sections/Resume';
import Projects from '../components/Sections/Projects';
import Services from '../components/Sections/Services';
import Testimonials from '../components/Sections/Testimonials';
import Blog from '../components/Sections/Blog';
import Contact from '../components/Sections/Contact';
import Footer from '../components/Sections/Footer';
import Navbar from '../components/UX/Navbar';
import CustomCursor from '../components/UX/CustomCursor';
import PageLoader from '../components/UX/PageLoader';
import { API_URL } from '../context/AuthContext';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    settings: null,
    projects: [],
    skills: [],
    experience: [],
    education: [],
    services: [],
    testimonials: [],
    blogs: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, projects, skills, experience, education, services, testimonials, blogs] = await Promise.all([
          axios.get(`${API_URL}/settings`).catch(() => ({ data: null })),
          axios.get(`${API_URL}/projects`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/skills`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/experience`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/education`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/services`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/testimonials`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/blog`).catch(() => ({ data: [] }))
        ]);

        setData({
          settings: settings.data,
          projects: projects.data,
          skills: skills.data,
          experience: experience.data,
          education: education.data,
          services: services.data,
          testimonials: testimonials.data,
          blogs: blogs.data
        });
      } catch (err) {
        console.error('Fetch errors', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-light-bg dark:bg-[#050508] text-light-text dark:text-dark-text overflow-hidden transition-colors duration-500">
      <PageLoader onComplete={() => setLoading(false)} />
      
      {!loading && (
        <>
          <CustomCursor />
          <Navbar />
          <div className="relative z-10">
            <Hero settings={data.settings} />
            <About settings={data.settings} />
            <Skills skills={data.skills} />
            <Resume
              experience={data.experience}
              education={data.education}
              resumeUrl={data.settings?.resumeUrl}
            />
            <Projects projects={data.projects} />
            <Services services={data.services} />
            <Testimonials testimonials={data.testimonials} />
            <Blog posts={data.blogs} />
            <Contact settings={data.settings} />
            <Footer settings={data.settings} />
          </div>
          
          {/* Background glowing spheres */}
          <div className="absolute top-[10%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] -z-10 pointer-events-none" />
          <div className="absolute top-[50%] right-[-15%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[150px] -z-10 pointer-events-none" />
        </>
      )}
    </div>
  );
};

export default Home;
