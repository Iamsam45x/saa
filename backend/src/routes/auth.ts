import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getSupabaseClient } from '../services/supabase';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1).max(200).optional(),
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: { code: 'AUTH_ERROR', message: error.message } });
    }

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || null,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: err.flatten().fieldErrors } });
    }
    throw err;
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = SignupSchema.parse(req.body);
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || null } },
    });

    if (error) {
      return res.status(400).json({ error: { code: 'AUTH_ERROR', message: error.message } });
    }

    return res.status(201).json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      message: 'Account created. Check your email for verification.',
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: err.flatten().fieldErrors } });
    }
    throw err;
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const supabase = getSupabaseClient();
  const { data: user } = await supabase.auth.admin.getUserById(req.userId!);

  if (!user.user) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  }

  return res.json({
    id: user.user.id,
    email: user.user.email,
    fullName: user.user.user_metadata?.full_name || null,
    createdAt: user.user.created_at,
  });
});

router.post('/logout', async (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

export default router;
