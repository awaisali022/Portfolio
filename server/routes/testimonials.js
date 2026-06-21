import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get testimonials
// @route   GET /api/testimonials
// @access  Public / Private (Admin gets all, public gets approved only)
router.get('/', async (req, res) => {
  try {
    let showAll = false;
    
    // Check if auth token exists to determine if we should return all for the admin dashboard
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'secret12345');
        showAll = true;
      } catch (err) {
        // invalid token, show approved only
      }
    }

    let queryBuilder = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (!showAll) {
      queryBuilder = queryBuilder.eq('approved', true);
    }

    const { data: testimonials, error } = await queryBuilder;

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(testimonials));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a testimonial (Public submission)
// @route   POST /api/testimonials
// @access  Public / Private (Autoset approved: false for public, admin can override)
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('role').notEmpty().withMessage('Role/Position is required'),
    body('message').notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, role, company, message, avatar, rating, approved } = req.body;

    try {
      let isApproved = false;
      if (approved !== undefined && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
          jwt.verify(token, process.env.JWT_SECRET || 'secret12345');
          isApproved = approved;
        } catch (err) {
          // invalid token
        }
      }

      const { data: createdTestimonial, error } = await supabase
        .from('testimonials')
        .insert([{
          name,
          role,
          company: company || '',
          message,
          avatar: avatar || '',
          rating: rating || 5,
          approved: isApproved
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      return res.status(201).json(mapId(createdTestimonial));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Update a testimonial (Approve/Edit)
// @route   PUT /api/testimonials/:id
// @access  Private
router.put(
  '/:id',
  protect,
  async (req, res) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !existing) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }

      const updates = {
        name: req.body.name || existing.name,
        role: req.body.role || existing.role,
        company: req.body.company !== undefined ? req.body.company : existing.company,
        message: req.body.message || existing.message,
        avatar: req.body.avatar !== undefined ? req.body.avatar : existing.avatar,
        rating: req.body.rating !== undefined ? req.body.rating : existing.rating,
        approved: req.body.approved !== undefined ? req.body.approved : existing.approved,
        updated_at: new Date().toISOString()
      };

      const { data: updatedTestimonial, error: updateError } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Database error', error: updateError.message });
      }

      return res.json(mapId(updatedTestimonial));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const { error: deleteError } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Testimonial removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
