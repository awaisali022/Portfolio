import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Trash2, MailOpen, CornerUpLeft, Clock, Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../../context/AuthContext';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Email composer values
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState('');

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/contact`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    setReplyText('');
    setReplyStatus('');

    // Mark as read immediately on selection
    if (!msg.read) {
      try {
        await axios.put(`${API_URL}/contact/${msg._id}`, { read: true });
        // Update local state list
        setMessages((prev) =>
          prev.map((item) => (item._id === msg._id ? { ...item, read: true } : item))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSendingReply(true);
    setReplyStatus('');

    try {
      await axios.post(`${API_URL}/contact/${selectedMessage._id}/reply`, { replyText });
      setReplyStatus('success');
      setReplyText('');
      // Update selected message state local
      setSelectedMessage((prev) => ({ ...prev, replySent: true }));
      // Update list state
      setMessages((prev) =>
        prev.map((item) =>
          item._id === selectedMessage._id ? { ...item, replySent: true, read: true } : item
        )
      );
    } catch (err) {
      console.error(err);
      setReplyStatus('error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${API_URL}/contact/${id}`);
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && messages.length === 0) {
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
          Messages Inbox
        </h2>
        <p className="text-xs sm:text-sm font-sans text-light-muted dark:text-dark-muted mt-1">
          Review visitor contact submissions and dispatch responses directly via email.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages List Column */}
        <div className="lg:col-span-5 glass-panel rounded-xl overflow-hidden shadow-md">
          <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
            <h3 className="font-display font-bold text-base text-light-text dark:text-dark-text">
              Inquiries ({messages.length})
            </h3>
          </div>

          <div className="divide-y divide-black/5 dark:divide-white/5 max-h-[600px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 cursor-none hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-start space-x-3 ${
                  selectedMessage?._id === msg._id ? 'bg-indigo-500/10 dark:bg-indigo-500/10' : ''
                }`}
              >
                {/* Icon marker */}
                <div className="mt-1 flex-shrink-0">
                  {msg.read ? (
                    <MailOpen className="w-4.5 h-4.5 text-light-muted dark:text-dark-muted" />
                  ) : (
                    <Mail className="w-4.5 h-4.5 text-indigo-500 animate-bounce" />
                  )}
                </div>

                {/* Text meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm truncate pr-2 ${!msg.read ? 'font-bold' : 'font-medium'}`}>
                      {msg.name}
                    </h4>
                    <span className="text-[10px] text-light-muted dark:text-dark-muted whitespace-nowrap font-mono">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h5 className={`text-xs truncate ${!msg.read ? 'font-semibold text-indigo-400' : 'text-light-muted dark:text-dark-muted'}`}>
                    {msg.subject}
                  </h5>
                  <p className="text-xs text-light-muted dark:text-dark-muted truncate mt-1">
                    {msg.message}
                  </p>

                  {/* Reply badge marker */}
                  {msg.replySent && (
                    <span className="inline-flex items-center text-[9px] font-bold uppercase mt-2 px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">
                      <CornerUpLeft className="w-2.5 h-2.5 mr-1" /> Replied
                    </span>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="p-8 text-center text-light-muted dark:text-dark-muted text-sm">
                Your inbox is currently empty.
              </div>
            )}
          </div>
        </div>

        {/* Message Reader Column */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="glass-panel p-6 sm:p-8 rounded-xl shadow-md space-y-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4 border-b border-black/5 dark:border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text">
                      {selectedMessage.subject}
                    </h3>
                    <span className="text-xs font-sans text-light-muted dark:text-dark-muted block mt-1">
                      From: <span className="font-semibold">{selectedMessage.name}</span> ({selectedMessage.email})
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Sent time */}
                <div className="flex items-center text-xs text-light-muted dark:text-dark-muted font-mono space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>

                {/* Message Body */}
                <div className="p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg">
                  <p className="font-sans text-sm sm:text-base text-light-text dark:text-dark-text leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Reply Form */}
                <div className="border-t border-black/5 dark:border-white/5 pt-6">
                  <h4 className="font-display font-bold text-sm text-light-text dark:text-dark-text mb-4 flex items-center">
                    <CornerUpLeft className="w-4 h-4 text-indigo-500 mr-2" /> Write Email Response
                  </h4>

                  {selectedMessage.replySent ? (
                    <div className="flex items-center p-3.5 bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400 text-xs sm:text-sm rounded-lg mb-4">
                      <Send className="w-4 h-4 mr-2.5 flex-shrink-0" />
                      <span>An email reply has already been sent for this inquiry. You can send another if needed.</span>
                    </div>
                  ) : null}

                  <form onSubmit={handleReplySubmit} className="space-y-4">
                    <textarea
                      rows="4"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response to email back to the visitor..."
                      className="glass-input resize-none"
                      required
                    />

                    {replyStatus === 'success' && (
                      <div className="p-3 bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400 text-xs rounded-lg">
                        Reply email sent and catalog state updated!
                      </div>
                    )}
                    {replyStatus === 'error' && (
                      <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Failed to send email. Check SMTP settings. (Fallback logged to console).</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="flex items-center justify-center px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {sendingReply ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Reply <Send className="w-3.5 h-3.5 ml-1.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-12 text-center rounded-xl text-light-muted dark:text-dark-muted font-sans flex flex-col items-center justify-center h-full min-h-[300px]">
                <Mail className="w-12 h-12 text-light-muted/30 dark:text-dark-muted/30 mb-4 animate-bounce" />
                Select a message from the inbox to read its details.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;
