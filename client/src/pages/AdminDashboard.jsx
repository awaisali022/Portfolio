import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Award,
  Calendar,
  FileText,
  Mail,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CustomCursor from '../components/UX/CustomCursor';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

// Import subpanels
import DashboardOverview from './dashboard/DashboardOverview';
import ManageProjects from './dashboard/ManageProjects';
import ManageSkills from './dashboard/ManageSkills';
import ManageTimeline from './dashboard/ManageTimeline';
import ManageBlogs from './dashboard/ManageBlogs';
import ManageMessages from './dashboard/ManageMessages';
import SettingsPanel from './dashboard/SettingsPanel';

const AdminDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Protected route check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  // Unread message notifier check
  useEffect(() => {
    if (!user) return;
    const checkInbox = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/contact`);
        const count = data.filter((m) => !m.read).length;
        setUnreadCount(count);
      } catch (err) {
        console.error(err);
      }
    };
    checkInbox();
    // Poll notifications every 45 seconds
    const interval = setInterval(checkInbox, 45000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'projects', name: 'Projects', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'skills', name: 'Skills', icon: <Award className="w-5 h-5" /> },
    { id: 'timeline', name: 'Timeline', icon: <Calendar className="w-5 h-5" /> },
    { id: 'blogs', name: 'Blogs', icon: <FileText className="w-5 h-5" /> },
    {
      id: 'messages',
      name: 'Messages',
      icon: <Mail className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : null
    },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'projects':
        return <ManageProjects />;
      case 'skills':
        return <ManageSkills />;
      case 'timeline':
        return <ManageTimeline />;
      case 'blogs':
        return <ManageBlogs />;
      case 'messages':
        return <ManageMessages />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-[#050508] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-[#050508] text-light-text dark:text-dark-text transition-colors duration-500 flex font-sans">
      <CustomCursor />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0c0c12] border-r border-black/5 dark:border-white/5 transform lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/5">
            <span className="font-display font-extrabold text-lg tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              ADMIN.PORTAL
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-light-muted dark:text-dark-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-none ${
                  activeTab === item.id
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'text-light-muted dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-2">
          {/* Admin User Info */}
          <div className="px-4 py-2 flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-display font-extrabold text-sm shadow">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="block font-semibold text-xs truncate">{user.username}</span>
              <span className="block text-[10px] text-light-muted dark:text-dark-muted truncate">{user.email}</span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-none"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header toolbar */}
        <header className="h-16 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#050508]/50 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-light-muted dark:text-dark-muted cursor-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h1 className="font-display font-extrabold text-lg sm:text-xl text-light-text dark:text-dark-text capitalize">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live website link */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2 border border-black/10 dark:border-white/10 text-light-muted dark:text-dark-muted rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-none"
            >
              <Globe className="w-4.5 h-4.5 mr-2" /> Live Portfolio
            </button>

            {/* Theme Toggle in Admin Panel */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-light-muted dark:text-dark-muted transition-colors cursor-none"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-yellow-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-900" />}
            </button>
          </div>
        </header>

        {/* Sub-view Content Frame */}
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto pb-16">
          {renderActivePanel()}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs"
        />
      )}
    </div>
  );
};

export default AdminDashboard;
