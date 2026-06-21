import express from 'express';
import { supabase, mapId } from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get current site settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: settingsList, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    let settings = settingsList && settingsList[0];
    
    // Create default settings if none exist
    if (!settings) {
      const defaultRecord = {
        heroTitle: 'Awais Ali',
        heroSubtitle: 'Full Stack Developer',
        heroRoles: ['Full Stack Developer', 'React & Node Architect', '3D UI Designer'],
        aboutBio: 'Hi, I am Awais Ali, a software engineer specializing in modern web animations and high-throughput server backends.'
      };

      const { data: newSettings, error: insertError } = await supabase
        .from('settings')
        .insert([defaultRecord])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ message: 'Database error on init', error: insertError.message });
      }
      settings = newSettings;
    }
    
    return res.json(mapId(settings));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { data: settingsList, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (fetchError) {
      return res.status(500).json({ message: 'Database error', error: fetchError.message });
    }

    let settings = settingsList && settingsList[0];
    const updates = {};
    const fields = [
      'heroTitle', 'heroSubtitle', 'heroRoles', 'aboutBio', 'aboutImage', 
      'yearsExperience', 'projectsCompleted', 'happyClients', 'githubUrl', 
      'linkedinUrl', 'twitterUrl', 'instagramUrl', 'emailAddress', 'resumeUrl', 
      'seoTitle', 'seoDescription', 'seoKeywords'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    updates.updated_at = new Date().toISOString();

    let result;
    if (!settings) {
      const { data, error: insertError } = await supabase
        .from('settings')
        .insert([updates])
        .select()
        .single();
      if (insertError) {
        return res.status(500).json({ message: 'Insert failed', error: insertError.message });
      }
      result = data;
    } else {
      const { data, error: updateError } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();
      if (updateError) {
        return res.status(500).json({ message: 'Update failed', error: updateError.message });
      }
      result = data;
    }

    return res.json(mapId(result));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
