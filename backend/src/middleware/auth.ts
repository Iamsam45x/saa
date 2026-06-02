import { Request, Response, NextFunction } from 'express';
import { getSupabaseClientWithToken } from '../services/supabase';

export interface AuthRequest extends Request {
  userId?: string;
  accessToken?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  }

  const accessToken = authHeader.slice(7).trim();
  if (!accessToken) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }

  try {
    const supabase = getSupabaseClientWithToken(accessToken);
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid authentication token' } });
    }

    req.userId = data.user.id;
    req.accessToken = accessToken;
    next();
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Auth check failed' } });
  }
}
