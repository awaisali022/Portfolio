import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Plus, Edit2, Trash2, Save, Upload, FileEdit } from 'lucide-react';
import { API_URL, BACKEND_URL } from '../../context/AuthContext';

const ManageBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    status: 'draft',
    coverImage: '',
    content: ''
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/blog`);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditorChange = (value) => {
    setFormData({
      ...formData,
      content: value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    setMessage('');

    try {
      const { data: uploadRes } = await axios.post(`${API_URL}/media/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({
        ...formData,
        coverImage: uploadRes.url
      });
      setMessage('Cover image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (post) => {
    setFormData({
      title: post.title,
      tags: post.tags.join(', '),
      status: post.status,
      coverImage: post.coverImage,
      content: post.content
    });
    setEditId(post._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      tags: '',
      status: 'draft',
      coverImage: '',
      content: ''
    });
    setIsEditing(false);
    setEditId(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setMessage('Title and Content are required.');
      return;
    }

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    const payload = {
      ...formData,
      tags: parsedTags
    };

    setLoading(true);
    setMessage('');

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/blog/${editId}`, payload);
        setMessage('Blog post updated successfully!');
      } else {
        await axios.post(`${API_URL}/blog`, payload);
        setMessage('Blog post created successfully!');
      }
      resetForm();
      await fetchPosts();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Saving blog failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await axios.delete(`${API_URL}/blog/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // React Quill Editor Toolbar config
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'code-block'],
      ['clean']
    ]
  };

  if (loading && posts.length === 0) {
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
          Manage Blog Posts
        </h2>
        <p className="text-xs sm:text-sm font-sans text-light-muted dark:text-dark-muted mt-1">
          Write articles using a rich text builder and modify publication states.
        </p>
      </div>

      {/* Editor Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl shadow-md">
        <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text mb-6 flex items-center">
          {isEditing ? <FileEdit className="w-5 h-5 mr-2 text-indigo-500" /> : <Plus className="w-5 h-5 mr-2 text-indigo-500" />}
          {isEditing ? 'Edit Blog Article' : 'Draft New Article'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Navigating React Three Fiber"
                className="glass-input"
                required
              />
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Publish State
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="glass-input cursor-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, 3D, Web Development"
                className="glass-input"
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                Cover Image File
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center px-4 py-3 border border-indigo-500/30 rounded-lg text-indigo-500 hover:bg-indigo-500/10 cursor-pointer transition-all">
                  <Upload className="w-4 h-4 mr-2" /> Upload Cover
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                
                {uploading && <div className="text-xs text-indigo-400">Uploading...</div>}
                
                {formData.coverImage && (
                  <img
                    src={formData.coverImage.startsWith('http') ? formData.coverImage : `${BACKEND_URL}${formData.coverImage}`}
                    alt="preview"
                    className="w-11 h-11 object-cover rounded-md border border-black/10 dark:border-white/10"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Quill Editor */}
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider mb-3">
              Article Content <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleEditorChange}
              modules={modules}
            />
          </div>

          {/* Message notification */}
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
              <Save className="w-4.5 h-4.5 mr-2" /> Save Article
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

      {/* Blogs list Table */}
      <div className="glass-panel rounded-xl overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5">
          <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text">
            Blog Articles List ({posts.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 font-display text-xs uppercase font-bold text-light-muted dark:text-dark-muted border-b border-black/5 dark:border-white/5">
                <th className="px-6 py-4">Cover</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={post.coverImage
                        ? (post.coverImage.startsWith('http') ? post.coverImage : `${BACKEND_URL}${post.coverImage}`)
                        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100'}
                      alt="cover"
                      className="w-14 h-10 object-cover rounded border border-black/10 dark:border-white/10"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-light-text dark:text-dark-text">
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      post.status === 'published'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-light-muted dark:text-dark-muted">
                    {post.tags.join(', ')}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="p-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-light-muted dark:text-dark-muted">
                    No posts found. Add some above!
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

export default ManageBlogs;
