import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public / Private (Admin gets all draft/published, public gets published only)
router.get('/', async (req, res) => {
  try {
    let showAll = false;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'secret12345');
        showAll = true;
      } catch (err) {
        // Fall back to public
      }
    }

    let queryBuilder = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!showAll) {
      queryBuilder = queryBuilder.eq('status', 'published');
    }

    const { data: posts, error } = await queryBuilder;

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.json(mapId(posts));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', req.params.slug)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    if (post) {
      return res.json(mapId(post));
    } else {
      return res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, coverImage, tags, status } = req.body;
    const slug = slugify(title);

    try {
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existingPost) {
        return res.status(400).json({ message: 'A blog post with a similar title already exists.' });
      }

      const { data: createdPost, error } = await supabase
        .from('blog_posts')
        .insert([{
          title,
          slug,
          content,
          coverImage: coverImage || '',
          tags: tags || [],
          status: status || 'draft'
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      return res.status(201).json(mapId(createdPost));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private
router.put(
  '/:id',
  protect,
  async (req, res) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

      if (fetchError || !existing) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      const updates = {
        title: req.body.title || existing.title,
        content: req.body.content || existing.content,
        coverImage: req.body.coverImage !== undefined ? req.body.coverImage : existing.coverImage,
        tags: req.body.tags !== undefined ? req.body.tags : existing.tags,
        status: req.body.status || existing.status,
        updated_at: new Date().toISOString()
      };

      if (req.body.title) {
        updates.slug = slugify(req.body.title);
      }

      const { data: updatedPost, error: updateError } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ message: 'Database error', error: updateError.message });
      }

      return res.json(mapId(updatedPost));
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Database error', error: deleteError.message });
    }

    return res.json({ message: 'Blog post removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
