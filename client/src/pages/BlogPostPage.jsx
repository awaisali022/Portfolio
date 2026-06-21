import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import Navbar from '../components/UX/Navbar';
import Footer from '../components/Sections/Footer';
import CustomCursor from '../components/UX/CustomCursor';
import { API_URL, BACKEND_URL } from '../context/AuthContext';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/blog/${slug}`);
        setPost(data);
      } catch (err) {
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-[#050508] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-[#050508] text-light-text dark:text-dark-text overflow-hidden transition-colors duration-500">
      <CustomCursor />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-600 mb-8 transition-colors group cursor-none"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        {error || !post ? (
          <div className="text-center py-12">
            <h2 className="font-display font-bold text-2xl text-red-500">{error || 'Post Not Found'}</h2>
          </div>
        ) : (
          <article className="glass-panel p-6 sm:p-10 rounded-2xl shadow-xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-light-text dark:text-dark-text tracking-tight mb-4">
                {post.title}
              </h1>

              <div className="flex items-center space-x-4 text-xs sm:text-sm text-light-muted dark:text-dark-muted font-medium">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-indigo-500" />
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-purple-500" />
                  {Math.max(1, Math.ceil(post.content.split(' ').length / 200))} min read
                </span>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 border border-black/10 dark:border-white/10">
                <img
                  src={post.coverImage.startsWith('http') ? post.coverImage : `${BACKEND_URL}${post.coverImage}`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content Markup */}
            <div
              className="prose prose-indigo dark:prose-invert max-w-none text-light-text dark:text-dark-text font-sans leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
