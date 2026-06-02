import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getSupabaseClientWithToken } from '../services/supabase';

const router = Router();

const ApplicationTypeEnum = z.enum(['Website', 'CRM', 'ERP', 'Mobile App', 'SaaS Platform']);

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  targetAudience: z.string().min(1).max(500),
  location: z.string().max(200).optional().default(''),
  applicationType: ApplicationTypeEnum,
  features: z.array(z.string().min(1)).min(1),
  theme: z.enum(['corporate-blue', 'dark-mode', 'minimal-white', 'neon-gradient', 'custom-brand']),
  status: z.enum(['Draft', 'In Progress', 'Completed']).optional().default('Draft'),
});

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const supabase = getSupabaseClientWithToken(req.accessToken!);
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize as string) || 20, 1), 100);
  const status = req.query.status as string | undefined;

  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('user_id', req.userId);

  if (status) {
    query = query.eq('status', status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query
    .order('updated_at', { ascending: false })
    .range(from, to);

  if (error) {
    return res.status(500).json({ error: { code: 'DB_ERROR', message: error.message } });
  }

  return res.json({ projects: data || [], total: count || 0, page, pageSize });
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const supabase = getSupabaseClientWithToken(req.accessToken!);

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
  }

  return res.json(data);
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const body = CreateProjectSchema.parse(req.body);
    const supabase = getSupabaseClientWithToken(req.accessToken!);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: body.name,
        description: body.description,
        target_audience: body.targetAudience,
        location: body.location,
        application_type: body.applicationType,
        features: body.features,
        theme: body.theme,
        status: body.status,
        user_id: req.userId,
      })
      .select()
      .single();

    if (error || !data) {
      return res.status(500).json({ error: { code: 'DB_ERROR', message: error?.message || 'Failed to create project' } });
    }

    return res.status(201).json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: err.flatten().fieldErrors } });
    }
    throw err;
  }
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const supabase = getSupabaseClientWithToken(req.accessToken!);

  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single();

  if (!existing) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
  }

  const { data, error } = await supabase
    .from('projects')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: { code: 'DB_ERROR', message: error.message } });
  }

  return res.json(data);
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const supabase = getSupabaseClientWithToken(req.accessToken!);

  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single();

  if (!existing) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    return res.status(500).json({ error: { code: 'DB_ERROR', message: error.message } });
  }

  return res.json({ message: 'Project deleted' });
});

export default router;
