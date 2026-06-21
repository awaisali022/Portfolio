import jwt from 'jsonwebtoken';
import { supabase, mapId } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret12345');
      
      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email')
        .eq('id', decoded.id)
        .single();

      if (!user || error) {
        return res.status(401).json({ message: 'User not found, access denied' });
      }
      
      req.user = mapId(user);
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
