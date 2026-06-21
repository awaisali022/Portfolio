import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(skills));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('proficiency').isInt({ min: 0, max: 100 }).withMessage('Proficiency must be an integer between 0 and 100')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, proficiency, icon } = req.body;

    try {
      const { data: createdSkill, error } = await supabase
        .from('skills')
        .insert([{
          name,
          category,
          proficiency,
          icon: icon || ''
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      return res.status(201).json(mapId(createdSkill));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
router.put(
  '/:id',
  protect,
  [
    body('proficiency').optional().isInt({ min: 0, max: 100 }).withMessage('Proficiency must be an integer between 0 and 100')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('skills')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !existing) {
        return res.status(404).json({ message: 'Skill not found' });
      }

      const updates = {
        name: req.body.name || existing.name,
        category: req.body.category || existing.category,
        proficiency: req.body.proficiency !== undefined ? req.body.proficiency : existing.proficiency,
        icon: req.body.icon !== undefined ? req.body.icon : existing.icon,
        updated_at: new Date().toISOString()
      };

      const { data: updatedSkill, error: updateError } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Database error', error: updateError.message });
      }

      return res.json(mapId(updatedSkill));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('skills')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const { error: deleteError } = await supabase
      .from('skills')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Skill removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
