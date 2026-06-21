import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Helper to send emails using Nodemailer
const sendMailNotification = async (messageData, replyTo = null, replyText = null) => {
  const isReply = !!replyTo;
  
  // Set up transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.EMAIL_PORT) || 2525,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || ''
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Portfolio Website" <portfolio@example.com>',
    to: isReply ? replyTo.email : (process.env.ADMIN_EMAIL || 'admin@portfolio.com'),
    subject: isReply ? `Re: ${replyTo.subject}` : `New Portfolio Inquiry: ${messageData.subject || 'No Subject'}`,
    text: isReply
      ? `Hi ${replyTo.name},\n\n${replyText}\n\n---\nOriginal Message:\n"${replyTo.message}"`
      : `You have received a new message from your portfolio website:\n\nName: ${messageData.name}\nEmail: ${messageData.email}\nSubject: ${messageData.subject}\nMessage:\n${messageData.message}`
  };

  // If no credentials, log details to console as a fallback
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n--- [Nodemailer Fallback - No Credentials Configured] ---');
    console.log(`From: ${mailOptions.from}`);
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body:\n${mailOptions.text}`);
    console.log('-------------------------------------------------------\n');
    return true;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    return true;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return false;
  }
};

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('message').notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      const { data: savedMessage, error } = await supabase
        .from('messages')
        .insert([{
          name,
          email,
          subject: subject || 'No Subject',
          message
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      // Trigger asynchronous email dispatch (non-blocking)
      sendMailNotification(savedMessage);

      return res.status(201).json({ success: true, message: 'Message sent and stored successfully!', data: mapId(savedMessage) });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(messages));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update a message state (Read/Unread)
// @route   PUT /api/contact/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updates = {
      read: req.body.read !== undefined ? req.body.read : existing.read,
      updated_at: new Date().toISOString()
    };

    const { data: updatedMessage, error: updateError } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: 'Database error', error: updateError.message });
    }

    return res.json(mapId(updatedMessage));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Reply to a contact message via email
// @route   POST /api/contact/:id/reply
// @access  Private
router.post(
  '/:id/reply',
  protect,
  [
    body('replyText').notEmpty().withMessage('Reply text cannot be empty')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { data: msg, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !msg) {
        return res.status(404).json({ message: 'Message not found' });
      }

      const mailSent = await sendMailNotification(null, msg, req.body.replyText);
      if (mailSent) {
        const { data: updatedMsg, error: updateErr } = await supabase
          .from('messages')
          .update({
            replySent: true,
            read: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', req.params.id)
          .select()
          .single();

        if (updateErr) {
          return res.status(500).json({ message: 'Error updating message reply state', error: updateErr.message });
        }

        return res.json({ success: true, message: 'Reply sent successfully!' });
      } else {
        return res.status(500).json({ message: 'Failed to send email. Check SMTP settings.' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Message removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
