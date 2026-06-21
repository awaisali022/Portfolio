import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { API_URL } from '../../context/AuthContext';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 80,
    icon: ''
  });

  const [message, setMessage] = useState('');

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/skills`);
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon
    });
    setEditId(skill._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Frontend',
      proficiency: 80,
      icon: ''
    });
    setIsEditing(false);
    setEditId(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      setMessage('Name and Category are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/skills/${editId}`, formData);
        setMessage('Skill updated successfully!');
      } else {
        await axios.post(`${API_URL}/skills`, formData);
        setMessage('Skill created successfully!');
      }
      resetForm();
      await fetchSkills();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Saving skill failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await axios.delete(`${API_URL}/skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
          Manage Skills
        </h2>
        <p className="text-xs sm:text-sm font-sans text-light-muted dark:text-dark-muted mt-1">
          Adjust skill proficiencies, categories, and icons dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl shadow-md">
          <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text mb-6 flex items-center">
            {isEditing ? <Edit2 className="w-5 h-5 mr-2 text-indigo-500" /> : <Plus className="w-5 h-5 mr-2 text-indigo-500" />}
            {isEditing ? 'Edit Skill' : 'Add New Skill'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Skill Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. React.js, Node.js"
                className="glass-input"
                required
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="glass-input cursor-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Tools">Tools</option>
                <option value="Design">Design</option>
              </select>
            </div>

            {/* Proficiency slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider">
                  Proficiency Level
                </label>
                <span className="text-sm font-display font-bold text-indigo-500">
                  {formData.proficiency}%
                </span>
              </div>
              <input
                type="range"
                name="proficiency"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={handleChange}
                className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-none accent-indigo-500"
              />
            </div>

            {/* Icon String */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Design Icon identifier (optional)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g. ReactIcon, JsIcon"
                className="glass-input"
              />
            </div>

            {/* Message notice */}
            {message && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs sm:text-sm rounded-lg">
                {message}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="flex items-center justify-center px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4.5 h-4.5 mr-2" /> Save Skill
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

        {/* Existing Skills Table List */}
        <div className="lg:col-span-7 glass-panel rounded-xl overflow-hidden shadow-md">
          <div className="px-6 py-4 border-b border-black/5 dark:border-white/5">
            <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text">
              Skill Entries ({skills.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 font-display text-xs uppercase font-bold text-light-muted dark:text-dark-muted border-b border-black/5 dark:border-white/5">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Proficiency</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                {skills.map((skill) => (
                  <tr key={skill._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-light-text dark:text-dark-text">
                      {skill.name}
                    </td>
                    <td className="px-6 py-4 text-light-muted dark:text-dark-muted">
                      {skill.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="font-mono text-xs">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(skill)}
                        className="p-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {skills.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-light-muted dark:text-dark-muted">
                      No skills found. Add some above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSkills;
