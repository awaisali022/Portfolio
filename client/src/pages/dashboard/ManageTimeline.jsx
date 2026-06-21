import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { API_URL } from '../../context/AuthContext';

const ManageTimeline = () => {
  const [timelineType, setTimelineType] = useState('experience'); // 'experience' | 'education'
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Experience Form Fields
  const [expData, setExpData] = useState({
    company: '',
    role: '',
    location: '',
    description: '', // parses on split by line breaks
    startDate: '',
    endDate: '',
    current: false
  });

  // Education Form Fields
  const [eduData, setEduData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [expRes, eduRes] = await Promise.all([
        axios.get(`${API_URL}/experience`),
        axios.get(`${API_URL}/education`)
      ]);
      setExperiences(expRes.data);
      setEducations(eduRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpData({
      ...expData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEduChange = (e) => {
    setEduData({
      ...eduData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (item, type) => {
    setEditId(item._id);
    setIsEditing(true);
    setTimelineType(type);
    
    if (type === 'experience') {
      setExpData({
        company: item.company,
        role: item.role,
        location: item.location,
        description: item.description.join('\n'),
        startDate: item.startDate,
        endDate: item.endDate,
        current: item.current
      });
    } else {
      setEduData({
        institution: item.institution,
        degree: item.degree,
        fieldOfStudy: item.fieldOfStudy,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForms = () => {
    setExpData({
      company: '',
      role: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false
    });
    setEduData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setIsEditing(false);
    setEditId(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (timelineType === 'experience') {
        if (!expData.company || !expData.role || !expData.startDate) {
          setMessage('Company, Role and Start Date are required.');
          setLoading(false);
          return;
        }

        // Split paragraph lines into array strings
        const descArray = expData.description
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line !== '');

        const payload = {
          ...expData,
          description: descArray,
          endDate: expData.current ? 'Present' : expData.endDate
        };

        if (isEditing) {
          await axios.put(`${API_URL}/experience/${editId}`, payload);
          setMessage('Experience entry updated successfully!');
        } else {
          await axios.post(`${API_URL}/experience`, payload);
          setMessage('Experience entry created successfully!');
        }
      } else {
        if (!eduData.institution || !eduData.degree || !eduData.startDate) {
          setMessage('Institution, Degree and Start Date are required.');
          setLoading(false);
          return;
        }

        if (isEditing) {
          await axios.put(`${API_URL}/education/${editId}`, eduData);
          setMessage('Education entry updated successfully!');
        } else {
          await axios.post(`${API_URL}/education`, eduData);
          setMessage('Education entry created successfully!');
        }
      }

      resetForms();
      await fetchData();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} entry?`)) return;
    try {
      await axios.delete(`${API_URL}/${type}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-light-text dark:text-dark-text">
          Manage Timeline
        </h2>
        <p className="text-xs sm:text-sm font-sans text-light-muted dark:text-dark-muted mt-1">
          Add or edit professional experiences and academic timeline qualifications.
        </p>
      </div>

      {/* Timeline Type Selector */}
      <div className="flex space-x-4 border-b border-black/5 dark:border-white/5 pb-2">
        <button
          onClick={() => { setTimelineType('experience'); resetForms(); }}
          className={`flex items-center pb-3 text-sm font-medium border-b-2 px-1 transition-all ${
            timelineType === 'experience'
              ? 'border-indigo-500 text-indigo-500 font-semibold'
              : 'border-transparent text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
          }`}
        >
          <Briefcase className="w-4 h-4 mr-2" /> Work Experience
        </button>
        <button
          onClick={() => { setTimelineType('education'); resetForms(); }}
          className={`flex items-center pb-3 text-sm font-medium border-b-2 px-1 transition-all ${
            timelineType === 'education'
              ? 'border-purple-500 text-purple-500 font-semibold'
              : 'border-transparent text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
          }`}
        >
          <GraduationCap className="w-4 h-4 mr-2" /> Academic Education
        </button>
      </div>

      {/* Editor Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl shadow-md">
        <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text mb-6">
          {isEditing ? 'Edit' : 'Add'} {timelineType === 'experience' ? 'Experience Entry' : 'Education Qualification'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {timelineType === 'experience' ? (
            /* Experience fields */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Company / Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={expData.company}
                    onChange={handleExpChange}
                    placeholder="e.g. Vertex Tech"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Designation Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={expData.role}
                    onChange={handleExpChange}
                    placeholder="e.g. Lead Software Architect"
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={expData.location}
                    onChange={handleExpChange}
                    placeholder="e.g. Remote / Lahore"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={expData.startDate}
                    onChange={handleExpChange}
                    placeholder="e.g. Jan 2024"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={expData.endDate}
                    onChange={handleExpChange}
                    placeholder="e.g. Dec 2024"
                    disabled={expData.current}
                    className="glass-input disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="current"
                  id="current"
                  checked={expData.current}
                  onChange={handleExpChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-black/10 dark:border-white/10 bg-transparent"
                />
                <label htmlFor="current" className="text-sm font-sans font-semibold text-light-text dark:text-dark-text">
                  This is my current role
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                  Key Achievements / Responsibilities (One item per line)
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={expData.description}
                  onChange={handleExpChange}
                  placeholder="Led development of dashboard integrations.&#10;Decreased loading lag by 20%.&#10;Handled relational database setups."
                  className="glass-input font-sans resize-none"
                />
              </div>
            </>
          ) : (
            /* Education fields */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Institution / University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={eduData.institution}
                    onChange={handleEduChange}
                    placeholder="e.g. NUST"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Degree Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={eduData.degree}
                    onChange={handleEduChange}
                    placeholder="e.g. Bachelor of Science"
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={eduData.fieldOfStudy}
                    onChange={handleEduChange}
                    placeholder="e.g. Computer Science"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={eduData.startDate}
                    placeholder="e.g. Sep 2018"
                    onChange={handleEduChange}
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={eduData.endDate}
                    placeholder="e.g. Jul 2022"
                    onChange={handleEduChange}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                  Academic Details / Summary
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={eduData.description}
                  onChange={handleEduChange}
                  placeholder="Graduated with Honors. Special focus on Web Design..."
                  className="glass-input resize-none"
                />
              </div>
            </>
          )}

          {/* Status Message */}
          {message && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs sm:text-sm rounded-lg">
              {message}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4.5 h-4.5 mr-2" /> Save Entry
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForms}
                className="flex items-center justify-center px-6 py-2.5 bg-transparent border border-black/15 dark:border-white/15 text-light-text dark:text-dark-text rounded-lg text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Grid of Listings */}
      <div className="glass-panel rounded-xl overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5">
          <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text">
            {timelineType === 'experience' ? 'Work Experiences' : 'Education Qualifications'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 font-display text-xs uppercase font-bold text-light-muted dark:text-dark-muted border-b border-black/5 dark:border-white/5">
                <th className="px-6 py-4">{timelineType === 'experience' ? 'Role / Company' : 'Degree / Institution'}</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
              {timelineType === 'experience'
                ? experiences.map((exp) => (
                    <tr key={exp._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="block font-semibold text-light-text dark:text-dark-text">{exp.role}</span>
                        <span className="text-xs text-light-muted dark:text-dark-muted font-medium">{exp.company}</span>
                      </td>
                      <td className="px-6 py-4 text-light-muted dark:text-dark-muted font-mono text-xs">
                        {exp.startDate} - {exp.endDate}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-light-muted dark:text-dark-muted">
                        {exp.description.join(', ')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(exp, 'experience')}
                          className="p-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id, 'experience')}
                          className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                : educations.map((edu) => (
                    <tr key={edu._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="block font-semibold text-light-text dark:text-dark-text">{edu.degree}</span>
                        <span className="text-xs text-light-muted dark:text-dark-muted font-medium">{edu.institution}</span>
                      </td>
                      <td className="px-6 py-4 text-light-muted dark:text-dark-muted font-mono text-xs">
                        {edu.startDate} - {edu.endDate}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-light-muted dark:text-dark-muted">
                        {edu.description}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(edu, 'education')}
                          className="p-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(edu._id, 'education')}
                          className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              {((timelineType === 'experience' && experiences.length === 0) ||
                (timelineType === 'education' && educations.length === 0)) && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-light-muted dark:text-dark-muted">
                    No entries found.
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

export default ManageTimeline;
