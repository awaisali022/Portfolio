import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Upload, Save, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL, BACKEND_URL } from '../../context/AuthContext';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '', // Will be parsed as array
    liveLink: '',
    githubLink: '',
    category: 'Development',
    featured: false,
    order: 0,
    images: []
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/projects`);
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Upload Project Cover Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: uploadRes } = await axios.post(`${API_URL}/media/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({
        ...formData,
        images: [uploadRes.url] // Store returned image URL in array
      });
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      liveLink: project.liveLink,
      githubLink: project.githubLink,
      category: project.category,
      featured: project.featured,
      order: project.order,
      images: project.images
    });
    setEditId(project._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      liveLink: '',
      githubLink: '',
      category: 'Development',
      featured: false,
      order: 0,
      images: []
    });
    setIsEditing(false);
    setEditId(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setMessage({ type: 'error', text: 'Title and description are required.' });
      return;
    }

    // Parse tech stack comma string to array
    const parsedTech = formData.techStack
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    const payload = {
      ...formData,
      techStack: parsedTech
    };

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/projects/${editId}`, payload);
        setMessage({ type: 'success', text: 'Project updated successfully!' });
      } else {
        await axios.post(`${API_URL}/projects`, payload);
        setMessage({ type: 'success', text: 'Project created successfully!' });
      }
      resetForm();
      await fetchProjects();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Saving project failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
            Manage Projects
          </h2>
          <p className="text-xs sm:text-sm font-sans text-light-muted dark:text-dark-muted mt-1">
            Create, update, and sort project showcase items dynamically.
          </p>
        </div>
      </div>

      {/* Editor Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl shadow-md">
        <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text mb-6 flex items-center">
          {isEditing ? <Edit2 className="w-5 h-5 mr-2 text-indigo-500" /> : <Plus className="w-5 h-5 mr-2 text-indigo-500" />}
          {isEditing ? 'Edit Project' : 'Add New Project'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 3D Web Visualizer"
                className="glass-input"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Frontend, Full Stack"
                className="glass-input"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the application features, challenges, and details..."
              className="glass-input resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Stack */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="React, Node.js, Three.js, MongoDB"
                className="glass-input"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Sort Order (ascending)
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Link */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Live URL link
              </label>
              <input
                type="url"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleChange}
                placeholder="https://example.com"
                className="glass-input"
              />
            </div>

            {/* GitHub Link */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                GitHub URL link
              </label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/profile/repo"
                className="glass-input"
              />
            </div>
          </div>

          {/* Cover image uploader */}
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
              Project Cover Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex items-center justify-center px-4 py-3 border border-indigo-500/30 rounded-lg text-indigo-500 hover:bg-indigo-500/10 cursor-pointer transition-all">
                <Upload className="w-4 h-4 mr-2" /> Upload Cover Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {uploading && <div className="text-xs text-indigo-400">Uploading file...</div>}

              {formData.images.length > 0 && (
                <div className="flex items-center space-x-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1.5 rounded-lg">
                  <img
                    src={formData.images[0].startsWith('http') ? formData.images[0] : `${BACKEND_URL}${formData.images[0]}`}
                    alt="preview"
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <span className="text-xs font-mono truncate max-w-xs">{formData.images[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-black/10 dark:border-white/10 bg-transparent"
            />
            <label htmlFor="featured" className="text-sm font-sans font-semibold text-light-text dark:text-dark-text">
              Feature this project on the homepage
            </label>
          </div>

          {/* Message notification */}
          {message.text && (
            <div className={`p-3 rounded-lg text-xs sm:text-sm border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2" /> Save Project
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center justify-center px-6 py-2.5 bg-transparent border border-black/15 dark:border-white/15 text-light-text dark:text-dark-text rounded-lg text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects Table List */}
      <div className="glass-panel rounded-xl overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5">
          <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text">
            Existing Projects ({projects.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 font-display text-xs uppercase font-bold text-light-muted dark:text-dark-muted border-b border-black/5 dark:border-white/5">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
              {projects.map((proj) => (
                <tr key={proj._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={proj.images[0]
                        ? (proj.images[0].startsWith('http') ? proj.images[0] : `${BACKEND_URL}${proj.images[0]}`)
                        : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=100'}
                      alt="icon"
                      className="w-12 h-12 object-cover rounded-md border border-black/10 dark:border-white/10"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-light-text dark:text-dark-text">
                    {proj.title}
                  </td>
                  <td className="px-6 py-4 text-light-muted dark:text-dark-muted">
                    {proj.category}
                  </td>
                  <td className="px-6 py-4 text-light-muted dark:text-dark-muted">
                    {proj.order}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {proj.featured ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(proj)}
                      className="p-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id)}
                      className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-light-muted dark:text-dark-muted">
                    No projects found. Create one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProjects;
