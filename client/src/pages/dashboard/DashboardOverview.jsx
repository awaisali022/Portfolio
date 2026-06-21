import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Briefcase, FileText, MessageSquare, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { API_URL } from '../../context/AuthContext';

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <div className="glass-panel p-6 rounded-xl flex items-center justify-between shadow-md">
      <div>
        <span className="text-xs font-sans text-light-muted dark:text-dark-muted font-semibold uppercase tracking-wider block">
          {title}
        </span>
        <span className="font-display font-extrabold text-3xl text-light-text dark:text-dark-text mt-2 block">
          {value}
        </span>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    unreadMessages: 0,
    testimonials: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, blogs, messages, testimonials] = await Promise.all([
          axios.get(`${API_URL}/projects`),
          axios.get(`${API_URL}/blog`),
          axios.get(`${API_URL}/contact`),
          axios.get(`${API_URL}/testimonials`)
        ]);

        const unreadCount = messages.data.filter((m) => !m.read).length;

        setStats({
          projects: projects.data.length,
          blogs: blogs.data.length,
          messages: messages.data.length,
          unreadMessages: unreadCount,
          testimonials: testimonials.data.length
        });
      } catch (err) {
        console.error('Stats loading failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Mock analytics charts data
  const chartData = [
    { name: 'Mon', visits: 120, inquiries: 2 },
    { name: 'Tue', visits: 180, inquiries: 4 },
    { name: 'Wed', visits: 150, inquiries: 1 },
    { name: 'Thu', visits: 220, inquiries: 5 },
    { name: 'Fri', visits: 300, inquiries: 7 },
    { name: 'Sat', visits: 240, inquiries: 3 },
    { name: 'Sun', visits: 340, inquiries: 8 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
          Dashboard Overview
        </h2>
        <p className="text-xs sm:text-sm font-sans text-light-muted dark:text-dark-muted mt-1">
          Real-time metrics summary and site analytics overview.
        </p>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={stats.projects}
          icon={<Briefcase className="w-6 h-6 text-indigo-500" />}
          color="bg-indigo-500/10"
        />
        <MetricCard
          title="Blog Articles"
          value={stats.blogs}
          icon={<FileText className="w-6 h-6 text-purple-500" />}
          color="bg-purple-500/10"
        />
        <MetricCard
          title="Unread Inquiries"
          value={stats.unreadMessages}
          icon={<MessageSquare className="w-6 h-6 text-pink-500" />}
          color="bg-pink-500/10"
        />
        <MetricCard
          title="Testimonials"
          value={stats.testimonials}
          icon={<Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
          color="bg-yellow-500/10"
        />
      </div>

      {/* Analytics Chart section */}
      <div className="glass-panel p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text flex items-center">
              <TrendingUp className="w-5 h-5 text-indigo-500 mr-2" /> Traffic & Engagement
            </h3>
            <span className="text-xs text-light-muted dark:text-dark-muted font-sans font-medium">
              Comparison between website pageviews and contact form inquiries.
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold font-sans">
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1.5" /> Pageviews
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-1.5" /> Inquiries
            </span>
          </div>
        </div>

        {/* Recharts responsive wrapper */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#888888" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="#888888" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(13, 13, 20, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff'
                }}
              />
              <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
              <Area type="monotone" dataKey="inquiries" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorInquiries)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
