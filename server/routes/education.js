import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all education entries
// @route   GET /api/education
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: educations, error } = await supabase
      .from('educations')
      .select('*')
      .order('startDate', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(educations));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create an education entry
// @route   POST /api/education
// @access  Private
router.post(
  '/',
  protect,
  [
    body('institution').notEmpty().withMessage('Institution is required'),
    body('degree').notEmpty().withMessage('Degree is required'),
    body('startDate').notEmpty().withMessage('Start date is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;

    try {
      const { data: createdEdu, error } = await supabase
        .from('educations')
        .insert([{
          institution,
          degree,
          fieldOfStudy: fieldOfStudy || '',
          startDate,
          endDate: endDate || 'Present',
          description: description || ''
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      return res.status(201).json(mapId(createdEdu));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Update an education entry
// @route   PUT /api/education/:id
// @access  Private
router.put(
  '/:id',
  protect,
  async (req, res) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('educations')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !existing) {
        return res.status(404).json({ message: 'Education entry not found' });
      }

      const updates = {
        institution: req.body.institution || existing.institution,
        degree: req.body.degree || existing.degree,
        fieldOfStudy: req.body.fieldOfStudy !== undefined ? req.body.fieldOfStudy : existing.fieldOfStudy,
        startDate: req.body.startDate || existing.startDate,
        endDate: req.body.endDate !== undefined ? req.body.endDate : existing.endDate,
        description: req.body.description !== undefined ? req.body.description : existing.description,
        updated_at: new Date().toISOString()
      };

      const { data: updatedEdu, error: updateError } = await supabase
        .from('educations')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Database error', error: updateError.message });
      }

      return res.json(mapId(updatedEdu));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete an education entry
// @route   DELETE /api/education/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('educations')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    const { error: deleteError } = await supabase
      .from('educations')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Education entry removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
