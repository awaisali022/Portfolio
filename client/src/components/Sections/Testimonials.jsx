import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ review }) => {
  return (
    <div className="glass-panel w-[300px] sm:w-[350px] flex-shrink-0 p-6 mx-4 rounded-xl flex flex-col justify-between shadow-lg select-none">
      {/* Testimonial message */}
      <p className="font-sans text-xs sm:text-sm text-light-muted dark:text-dark-muted italic leading-relaxed mb-6">
        "{review.message}"
      </p>

      <div className="flex items-center space-x-3.5">
        {/* Avatar */}
        <img
          src={review.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100'}
          alt={review.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-indigo-500/20"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-xs sm:text-sm text-light-text dark:text-dark-text truncate">
            {review.name}
          </h4>
          <span className="text-[10px] sm:text-xs font-medium text-light-muted dark:text-dark-muted block truncate">
            {review.role} {review.company ? `@ ${review.company}` : ''}
          </span>
          
          {/* Star Ratings */}
          <div className="flex items-center space-x-0.5 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < (review.rating || 5)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-black/10 dark:text-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = ({ testimonials = [] }) => {
  const defaultReviews = [];

  const activeReviews = testimonials.length > 0 ? testimonials : defaultReviews;
  
  // Double list items to enable seamless marquee repeat
  const marqueeItems = [...activeReviews, ...activeReviews];

  return (
    <section id="testimonials" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            Client <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Feedback</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />
        </div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative flex overflow-x-hidden w-full group/marquee">
        <div className="flex animate-[marquee_25s_linear_infinite] group-hover/marquee:[animation-play-state:paused] whitespace-nowrap">
          {marqueeItems.map((rev, idx) => (
            <TestimonialCard key={idx} review={rev} />
          ))}
        </div>

        {/* Tailwind Custom Marquee styles in inline keyframes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}} />

        {/* Gradient blur covers left/right sides */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-light-bg dark:from-dark-bg to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-light-bg dark:from-dark-bg to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default Testimonials;
