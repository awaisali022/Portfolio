import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BACKEND_URL } from '../../context/AuthContext';

const BlogCard = ({ post, index }) => {
  const publishDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'June 20, 2026';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-panel rounded-xl overflow-hidden flex flex-col justify-between hover:scale-[1.03] transition-all hover:shadow-indigo-500/5 group"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
        <img
          src={post.coverImage
            ? (post.coverImage.startsWith('http') ? post.coverImage : `${BACKEND_URL}${post.coverImage}`)
            : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Date Badge */}
          <div className="flex items-center text-xs font-semibold text-indigo-500 dark:text-indigo-400 space-x-1.5 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{publishDate}</span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg sm:text-xl text-light-text dark:text-dark-text mb-3 line-clamp-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
            {post.title}
          </h3>

          {/* Text Excerpt fallback */}
          <div
            className="font-sans text-xs sm:text-sm text-light-muted dark:text-dark-muted line-clamp-3 mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Read More Link */}
        <div className="flex items-center justify-between mt-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {post.tags?.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-light-muted dark:text-dark-muted">
                #{t}
              </span>
            ))}
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center text-xs sm:text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors group/link"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Blog = ({ posts = [] }) => {
  const defaultPosts = [
    {
      title: 'Getting Started with React Three Fiber',
      slug: 'getting-started-react-three-fiber',
      content: '<p>Three.js is an amazing library that enables 3D graphics on the web, but using it inside React can sometimes feel verbose. That is where R3F shines...</p>',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
      tags: ['React', 'Three.js'],
      createdAt: '2026-06-20T08:00:00.000Z'
    },
    {
      title: 'Optimizing MERN Stack Application Performance',
      slug: 'optimizing-mern-performance',
      content: '<p>Performance is key to retaining users on your website. In MERN stack development, optimization spans databases, API design, and client assets...</p>',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600',
      tags: ['MERN', 'Database'],
      createdAt: '2026-06-18T08:00:00.000Z'
    }
  ];

  const activePosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <section id="blog" className="py-24 bg-[#0a0a0f]/50 dark:bg-black/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight">
            Latest <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Insights</span>
          </h2>
          <div className="h-[3px] w-16 bg-indigo-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activePosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
