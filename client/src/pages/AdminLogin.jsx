import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CustomCursor from '../components/UX/CustomCursor';

const AdminLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-[#050508] flex items-center justify-center p-4 transition-colors duration-500 overflow-hidden relative">
      <CustomCursor />

      {/* Decorative blurred background shapes */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10"
      >
        {/* Branding header */}
        <div className="text-center mb-8">
          <h2 className="font-display font-extrabold text-3xl tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
            AWAIS.ALI
          </h2>
          <p className="text-xs sm:text-sm font-medium text-light-muted dark:text-dark-muted">
            Administrative Access Portal
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-light-muted/50 dark:text-dark-muted/50">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                className="glass-input pl-11"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-light-muted/50 dark:text-dark-muted/50">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input pl-11"
                required
              />
            </div>
          </div>

          {/* Error notice */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-3 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-lg"
              >
                <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-semibold hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all cursor-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Log In <LogIn className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs sm:text-sm font-semibold text-light-muted hover:text-indigo-500 dark:text-dark-muted dark:hover:text-indigo-400 transition-colors cursor-none"
          >
            Return to Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
