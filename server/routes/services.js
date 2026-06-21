import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(services));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Service title is required'),
    body('description').notEmpty().withMessage('Service description is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, icon, price, order } = req.body;

    try {
      const { data: createdService, error } = await supabase
        .from('services')
        .insert([{
          title,
          description,
          icon: icon || '',
          price: price || '',
          order: order || 0
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      return res.status(201).json(mapId(createdService));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
router.put(
  '/:id',
  protect,
  async (req, res) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !existing) {
        return res.status(404).json({ message: 'Service not found' });
      }

      const updates = {
        title: req.body.title || existing.title,
        description: req.body.description || existing.description,
        icon: req.body.icon !== undefined ? req.body.icon : existing.icon,
        price: req.body.price !== undefined ? req.body.price : existing.price,
        order: req.body.order !== undefined ? req.body.order : existing.order,
        updated_at: new Date().toISOString()
      };

      const { data: updatedService, error: updateError } = await supabase
        .from('services')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Database error', error: updateError.message });
      }

      return res.json(mapId(updatedService));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Service removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
