import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret12345', {
    expiresIn: '30d'
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user.id,
          username: user.username,
          email: user.email,
          token: generateToken(user.id)
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(mapId(user));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Fetch existing user to get old values
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (fetchError || !user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updates = {
        username: req.body.username || user.username,
        email: req.body.email || user.email,
        updated_at: new Date().toISOString()
      };

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(req.body.password, salt);
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', req.user.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Update failed', error: updateError.message });
      }

      return res.json({
        _id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        token: generateToken(updatedUser.id)
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

export default router;
