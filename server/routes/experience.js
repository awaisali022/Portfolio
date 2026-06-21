import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all experience entries
// @route   GET /api/experience
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: experiences, error } = await supabase
      .from('experiences')
      .select('*')
      .order('startDate', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(experiences));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create an experience entry
// @route   POST /api/experience
// @access  Private
router.post(
  '/',
  protect,
  [
    body('company').notEmpty().withMessage('Company is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('startDate').notEmpty().withMessage('Start date is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, role, location, description, startDate, endDate, current } = req.body;

    try {
      const { data: createdExp, error } = await supabase
        .from('experiences')
        .insert([{
          company,
          role,
          location: location || '',
          description: description || [],
          startDate,
          endDate: endDate || 'Present',
          current: current || false
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      return res.status(201).json(mapId(createdExp));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Update an experience entry
// @route   PUT /api/experience/:id
// @access  Private
router.put(
  '/:id',
  protect,
  async (req, res) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !existing) {
        return res.status(404).json({ message: 'Experience entry not found' });
      }

      const updates = {
        company: req.body.company || existing.company,
        role: req.body.role || existing.role,
        location: req.body.location !== undefined ? req.body.location : existing.location,
        description: req.body.description !== undefined ? req.body.description : existing.description,
        startDate: req.body.startDate || existing.startDate,
        endDate: req.body.endDate !== undefined ? req.body.endDate : existing.endDate,
        current: req.body.current !== undefined ? req.body.current : existing.current,
        updated_at: new Date().toISOString()
      };

      const { data: updatedExp, error: updateError } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Database error', error: updateError.message });
      }

      return res.json(mapId(updatedExp));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete an experience entry
// @route   DELETE /api/experience/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }

    const { error: deleteError } = await supabase
      .from('experiences')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Experience entry removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
