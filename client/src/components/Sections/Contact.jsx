import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';

const Contact = ({ settings }) => {
  const emailVal = settings?.emailAddress || 'fa23-bcs-022@cuivehari.edu.pk';
  const githubVal = settings?.githubUrl || 'https://github.com/awaisali022';
  const linkedinVal = settings?.linkedinUrl || 'https://www.linkedin.com/in/awaisali022/';
  const twitterVal = settings?.twitterUrl || 'https://twitter.com';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${API_URL}/contact`, formData);
      setStatus({
        type: 'success',
        text: 'Your message has been sent successfully! I will get back to you soon.'
      });
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            Contact <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-8">
              <h3 className="font-display font-bold text-2xl text-light-text dark:text-dark-text">
                Let's Discuss Your Project
              </h3>
              <p className="font-sans text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed">
                Have a project in mind, need structural full stack advice, or want to integrate 3D components into your website? Feel free to reach out using the form or direct coordinates below.
              </p>

              {/* Direct Info list */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-sans text-light-muted dark:text-dark-muted block">Email Address</span>
                    <a href={`mailto:${emailVal}`} className="text-sm sm:text-base font-semibold text-light-text dark:text-dark-text hover:text-indigo-500 transition-colors">
                      {emailVal}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-sans text-light-muted dark:text-dark-muted block">Location</span>
                    <span className="text-sm sm:text-base font-semibold text-light-text dark:text-dark-text">
                      Multan, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-sans text-light-muted dark:text-dark-muted block">Phone</span>
                    <a href="tel:+923054737765" className="text-sm sm:text-base font-semibold text-light-text dark:text-dark-text hover:text-green-500 transition-colors">
                      +923054737765
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons with animations */}
            <div className="pt-8 lg:pt-0">
              <h4 className="font-display font-bold text-sm text-light-text dark:text-dark-text uppercase tracking-wider mb-4">
                Follow My Profiles
              </h4>
              <div className="flex items-center space-x-4">
                <a
                  href={githubVal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-light-text dark:text-dark-text hover:bg-indigo-500 hover:text-white hover:-translate-y-1 transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={linkedinVal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-light-text dark:text-dark-text hover:bg-indigo-500 hover:text-white hover:-translate-y-1 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={twitterVal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-light-text dark:text-dark-text hover:bg-indigo-500 hover:text-white hover:-translate-y-1 transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl relative shadow-xl">
              {/* Form header */}
              <h3 className="font-display font-bold text-xl text-light-text dark:text-dark-text mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="glass-input"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="glass-input"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter message subject"
                    className="glass-input"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your project details..."
                    className="glass-input resize-none"
                    required
                  />
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-start p-4 rounded-lg text-sm border ${
                        status.type === 'success'
                          ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {status.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{status.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center w-full px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-indigo-500/10 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Inquiry <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
