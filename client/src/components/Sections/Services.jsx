import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to resolve string icons dynamically from lucide-react
const DynamicIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
};

const Services = ({ services = [] }) => {
  const [showPricing, setShowPricing] = useState(false);

  const defaultServices = [
    {
      title: 'Full Stack Web Development',
      description: 'End-to-end building of responsive web applications. I design responsive frontend UI layouts and construct secure RESTful databases and servers.',
      icon: 'Code',
      price: '$800'
    },
    {
      title: '3D Web Experiences',
      description: 'Stunning visual interactive layouts utilizing React Three Fiber to load, animate, and showcase high-fidelity 3D assets on the browser.',
      icon: 'Box',
      price: '$1200'
    },
    {
      title: 'API Engineering & Systems',
      description: 'Constructing robust API architectures, processing pipelines, automated cron-jobs, and linking third-party web endpoints.',
      icon: 'Server',
      price: '$400'
    }
  ];

  const activeServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-24 bg-[#0a0a0f]/50 dark:bg-black/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            My <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Services</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />

          {/* Pricing Toggle */}
          <div className="mt-8 flex items-center justify-center space-x-3">
            <span className="text-sm font-sans text-light-muted dark:text-dark-muted font-medium">
              Show Pricing Estimates
            </span>
            <button
              onClick={() => setShowPricing(!showPricing)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showPricing ? 'bg-indigo-500' : 'bg-black/20 dark:bg-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  showPricing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-xl flex flex-col justify-between hover:scale-[1.03] transition-all hover:shadow-indigo-500/5 group"
            >
              <div>
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DynamicIcon name={service.icon} className="w-6 h-6" />
                </div>

                {/* Service Details */}
                <h3 className="font-display font-bold text-xl text-light-text dark:text-dark-text mb-3">
                  {service.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-light-muted dark:text-dark-muted leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Dynamic Price Display */}
              {showPricing && service.price && (
                <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-auto">
                  <span className="text-xs font-sans text-light-muted dark:text-dark-muted tracking-wide block">
                    Starting from
                  </span>
                  <span className="font-display font-extrabold text-2xl text-indigo-500 dark:text-indigo-400">
                    {service.price.startsWith('$') ? service.price : `$${service.price}`}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
