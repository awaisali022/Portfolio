import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(projects));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    if (project) {
      return res.json(mapId(project));
    } else {
      return res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, images, techStack, liveLink, githubLink, category, featured, order } = req.body;

    try {
      const { data: createdProject, error } = await supabase
        .from('projects')
        .insert([{
          title,
          description,
          images: images || [],
          techStack: techStack || [],
          liveLink: liveLink || '',
          githubLink: githubLink || '',
          category: category || 'Development',
          featured: featured || false,
          order: order || 0
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      return res.status(201).json(mapId(createdProject));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
router.put(
  '/:id',
  protect,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if project exists
      const { data: existing, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !existing) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const updates = {
        title: req.body.title !== undefined ? req.body.title : existing.title,
        description: req.body.description !== undefined ? req.body.description : existing.description,
        images: req.body.images !== undefined ? req.body.images : existing.images,
        techStack: req.body.techStack !== undefined ? req.body.techStack : existing.techStack,
        liveLink: req.body.liveLink !== undefined ? req.body.liveLink : existing.liveLink,
        githubLink: req.body.githubLink !== undefined ? req.body.githubLink : existing.githubLink,
        category: req.body.category !== undefined ? req.body.category : existing.category,
        featured: req.body.featured !== undefined ? req.body.featured : existing.featured,
        order: req.body.order !== undefined ? req.body.order : existing.order,
        updated_at: new Date().toISOString()
      };

      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Database error', error: updateError.message });
      }

      return res.json(mapId(updatedProject));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Project removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
