import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Upload, Key, User, FileText, Globe, Share2 } from 'lucide-react';
import { useAuth, API_URL, BACKEND_URL } from '../../context/AuthContext';

const SettingsPanel = () => {
  const { updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'socials' | 'seo' | 'security'

  // Settings State
  const [settings, setSettings] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroRoles: '',
    aboutBio: '',
    aboutImage: '',
    yearsExperience: 0,
    projectsCompleted: 0,
    happyClients: 0,
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    emailAddress: '',
    resumeUrl: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  // Security Credentials State
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ avatar: false, resume: false });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings`);
      setSettings({
        ...data,
        heroRoles: data.heroRoles ? data.heroRoles.join(', ') : '',
        seoKeywords: data.seoKeywords ? data.seoKeywords.join(', ') : ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingsChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Upload Avatar or PDF Resume
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading((prev) => ({ ...prev, [type]: true }));
    setMessage({ type: '', text: '' });

    try {
      const { data: uploadRes } = await axios.post(`${API_URL}/media/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSettings((prev) => ({
        ...prev,
        [type === 'avatar' ? 'aboutImage' : 'resumeUrl']: uploadRes.url
      }));
      setMessage({ type: 'success', text: `${type === 'avatar' ? 'Avatar' : 'Resume'} uploaded successfully!` });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'File upload failed.' });
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Parse comma strings
    const parsedRoles = settings.heroRoles
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r !== '');

    const parsedKeywords = settings.seoKeywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k !== '');

    const payload = {
      ...settings,
      heroRoles: parsedRoles,
      seoKeywords: parsedKeywords
    };

    try {
      const { data } = await axios.put(`${API_URL}/settings`, payload);
      setSettings({
        ...data,
        heroRoles: data.heroRoles ? data.heroRoles.join(', ') : '',
        seoKeywords: data.seoKeywords ? data.seoKeywords.join(', ') : ''
      });
      setMessage({ type: 'success', text: 'Site settings updated successfully!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Filter empty fields before sending updates
    const payload = {};
    if (profileData.username) payload.username = profileData.username;
    if (profileData.email) payload.email = profileData.email;
    if (profileData.password) payload.password = profileData.password;

    if (Object.keys(payload).length === 0) {
      setMessage({ type: 'error', text: 'Please fill in at least one field to update.' });
      setLoading(false);
      return;
    }

    try {
      await updateProfile(payload);
      setMessage({ type: 'success', text: 'Admin profile updated successfully!' });
      setProfileData({ username: '', email: '', password: '' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && settings.heroTitle === '') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
          Site Settings
        </h2>
        <p className="text-xs sm:text-sm font-sans text-light-muted dark:text-dark-muted mt-1">
          Customize site copywriting, social tags, file pathways, and administration secrets.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 dark:border-white/5 pb-2">
        <button
          onClick={() => { setActiveTab('general'); setMessage({ type: '', text: '' }); }}
          className={`flex items-center pb-3 text-sm font-medium border-b-2 px-3 transition-all ${
            activeTab === 'general'
              ? 'border-indigo-500 text-indigo-500 font-semibold'
              : 'border-transparent text-light-muted dark:text-dark-muted hover:text-light-text'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" /> General Copy
        </button>
        <button
          onClick={() => { setActiveTab('socials'); setMessage({ type: '', text: '' }); }}
          className={`flex items-center pb-3 text-sm font-medium border-b-2 px-3 transition-all ${
            activeTab === 'socials'
              ? 'border-indigo-500 text-indigo-500 font-semibold'
              : 'border-transparent text-light-muted dark:text-dark-muted hover:text-light-text'
          }`}
        >
          <Share2 className="w-4 h-4 mr-2" /> Socials & Files
        </button>
        <button
          onClick={() => { setActiveTab('seo'); setMessage({ type: '', text: '' }); }}
          className={`flex items-center pb-3 text-sm font-medium border-b-2 px-3 transition-all ${
            activeTab === 'seo'
              ? 'border-indigo-500 text-indigo-500 font-semibold'
              : 'border-transparent text-light-muted dark:text-dark-muted hover:text-light-text'
          }`}
        >
          <Globe className="w-4 h-4 mr-2" /> SEO & Meta
        </button>
        <button
          onClick={() => { setActiveTab('security'); setMessage({ type: '', text: '' }); }}
          className={`flex items-center pb-3 text-sm font-medium border-b-2 px-3 transition-all ${
            activeTab === 'security'
              ? 'border-indigo-500 text-indigo-500 font-semibold'
              : 'border-transparent text-light-muted dark:text-dark-muted hover:text-light-text'
          }`}
        >
          <Key className="w-4 h-4 mr-2" /> Security
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl shadow-md">
        {activeTab !== 'security' ? (
          /* Site settings configurations form */
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            {activeTab === 'general' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Hero Name Title
                    </label>
                    <input
                      type="text"
                      name="heroTitle"
                      value={settings.heroTitle}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Hero Subtitle / Description
                    </label>
                    <input
                      type="text"
                      name="heroSubtitle"
                      value={settings.heroSubtitle}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Hero Rotating Roles (comma separated)
                  </label>
                  <input
                    type="text"
                    name="heroRoles"
                    value={settings.heroRoles}
                    onChange={handleSettingsChange}
                    className="glass-input"
                    placeholder="Full Stack Developer, UX Specialist"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    About Biography Summary
                  </label>
                  <textarea
                    name="aboutBio"
                    rows="5"
                    value={settings.aboutBio}
                    onChange={handleSettingsChange}
                    className="glass-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsExperience"
                      value={settings.yearsExperience}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Projects Completed
                    </label>
                    <input
                      type="number"
                      name="projectsCompleted"
                      value={settings.projectsCompleted}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Happy Clients
                    </label>
                    <input
                      type="number"
                      name="happyClients"
                      value={settings.happyClients}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'socials' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      GitHub URL link
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={settings.githubUrl}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      LinkedIn URL link
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={settings.linkedinUrl}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Twitter URL link
                    </label>
                    <input
                      type="url"
                      name="twitterUrl"
                      value={settings.twitterUrl}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Instagram URL link
                    </label>
                    <input
                      type="url"
                      name="instagramUrl"
                      value={settings.instagramUrl}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Contact Email Coordinates
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={settings.emailAddress}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-black/5 dark:border-white/5 pt-6">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Profile Biography Picture
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center px-4 py-2.5 border border-indigo-500/30 rounded-lg text-indigo-500 hover:bg-indigo-500/10 cursor-pointer transition-all">
                        <Upload className="w-4 h-4 mr-2" /> Upload Avatar
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'avatar')}
                          className="hidden"
                        />
                      </label>
                      {uploading.avatar && <span className="text-xs text-indigo-400">Uploading avatar...</span>}
                      {settings.aboutImage && (
                        <img
                          src={settings.aboutImage.startsWith('http') ? settings.aboutImage : `${BACKEND_URL}${settings.aboutImage}`}
                          alt="avatar"
                          className="w-10 h-10 object-cover rounded-full border border-black/10 dark:border-white/10"
                        />
                      )}
                    </div>
                  </div>
 
                  {/* Resume PDF Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      PDF Resume File (Max 5MB)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center px-4 py-2.5 border border-indigo-500/30 rounded-lg text-indigo-500 hover:bg-indigo-500/10 cursor-pointer transition-all">
                        <Upload className="w-4 h-4 mr-2" /> Upload Resume PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, 'resume')}
                          className="hidden"
                        />
                      </label>
                      {uploading.resume && <span className="text-xs text-indigo-400">Uploading resume...</span>}
                      {settings.resumeUrl && (
                        <a
                          href={settings.resumeUrl.startsWith('http') ? settings.resumeUrl : `${BACKEND_URL}${settings.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-500 hover:text-green-600 underline font-medium truncate max-w-xs"
                        >
                          {settings.resumeUrl}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'seo' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      SEO Title Header Tag
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={settings.seoTitle}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      SEO Index Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      name="seoKeywords"
                      value={settings.seoKeywords}
                      onChange={handleSettingsChange}
                      className="glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    SEO Meta Description
                  </label>
                  <textarea
                    name="seoDescription"
                    rows="3"
                    value={settings.seoDescription}
                    onChange={handleSettingsChange}
                    className="glass-input resize-none"
                  />
                </div>
              </>
            )}

            {/* Notification alert */}
            {message.text && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="flex items-center justify-center px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4.5 h-4.5 mr-2" /> Save Global Settings
              </button>
            </div>
          </form>
        ) : (
          /* Profile credentials form */
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h3 className="font-display font-bold text-base text-light-text dark:text-dark-text mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-500" /> Edit Admin Profile Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                  Update Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  placeholder="admin"
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                  Update Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="admin@portfolio.com"
                  className="glass-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Update Admin Password (Min 6 chars)
              </label>
              <input
                type="password"
                name="password"
                value={profileData.password}
                onChange={handleProfileChange}
                placeholder="••••••••"
                className="glass-input"
              />
            </div>

            {/* Notification alert */}
            {message.text && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex items-center justify-center px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md transition-colors cursor-pointer"
              >
                <Key className="w-4.5 h-4.5 mr-2" /> Update Profile Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
