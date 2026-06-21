import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ settings }) => {
  const emailVal = settings?.emailAddress || 'awais.ali@example.com';
  const githubVal = settings?.githubUrl || 'https://github.com';
  const linkedinVal = settings?.linkedinUrl || 'https://linkedin.com';
  const twitterVal = settings?.twitterUrl || 'https://twitter.com';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-[#050508] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      {/* Scroll to Top Trigger */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1 active:scale-95"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 animate-pulse" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Copyright */}
        <div className="text-center md:text-left">
          <Link
            to="/"
            className="font-display font-extrabold text-xl tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
          >
            AWAIS.ALI
          </Link>
          <p className="text-xs font-sans text-dark-muted mt-2">
            &copy; {new Date().getFullYear()} Awais Ali. All rights reserved.
          </p>
        </div>

        {/* Quick Contacts */}
        <div className="flex items-center space-x-4">
          <a
            href={githubVal}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-dark-muted hover:border-white hover:text-white hover:bg-white/5 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={linkedinVal}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-dark-muted hover:border-white hover:text-white hover:bg-white/5 transition-all"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={twitterVal}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-dark-muted hover:border-white hover:text-white hover:bg-white/5 transition-all"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${emailVal}`}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-dark-muted hover:border-white hover:text-white hover:bg-white/5 transition-all"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
