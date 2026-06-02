-- ============================================================
-- Complete Supabase Migration for SP Associates Configurator
-- Run this in the Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/ntaedkwivzdnximgisvp/sql/new
-- ============================================================

-- 0. Projects table (core entity, referenced by other tables)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  target_audience TEXT DEFAULT '',
  location TEXT DEFAULT '',
  application_type TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  theme TEXT DEFAULT 'corporate-blue',
  custom_colors JSONB DEFAULT NULL,
  status TEXT DEFAULT 'Draft',
  latest_schema_id UUID DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 1. Users sync table (for requireAuth upsert)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 2. AI settings per user
CREATE TABLE IF NOT EXISTS ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'anthropic',
  model TEXT DEFAULT 'claude-sonnet-4-20250514',
  max_tokens INTEGER DEFAULT 4096,
  temperature REAL DEFAULT 0.3,
  prompt_configuration JSONB DEFAULT '{"enforceRegistry": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own ai_settings" ON ai_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Generated schemas
CREATE TABLE IF NOT EXISTS generated_schemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  schema JSONB NOT NULL,
  pages JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  theme_configuration JSONB DEFAULT '{}'::jsonb,
  variation TEXT DEFAULT 'layout',
  prompt JSONB DEFAULT '{}'::jsonb,
  token_usage JSONB DEFAULT '{"input": 0, "output": 0, "total": 0}'::jsonb,
  processing_time_ms INTEGER DEFAULT 0,
  provider TEXT DEFAULT 'anthropic',
  fallback_reason TEXT,
  parent_schema_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE generated_schemas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own generated_schemas" ON generated_schemas
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Project versions (snapshots of generated schemas scoped to a project)
CREATE TABLE IF NOT EXISTS project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_schema_id UUID REFERENCES generated_schemas(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  schema JSONB NOT NULL,
  prompt JSONB DEFAULT '{}'::jsonb,
  token_usage JSONB DEFAULT '{"input": 0, "output": 0, "total": 0}'::jsonb,
  processing_time_ms INTEGER DEFAULT 0,
  provider TEXT DEFAULT 'anthropic',
  fallback_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own project_versions" ON project_versions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. AI generations audit log
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  generated_schema_id UUID REFERENCES generated_schemas(id) ON DELETE SET NULL,
  operation TEXT NOT NULL,
  provider TEXT,
  model TEXT,
  prompt_config JSONB DEFAULT '{}'::jsonb,
  request_payload JSONB DEFAULT '{}'::jsonb,
  response_payload JSONB DEFAULT '{}'::jsonb,
  token_usage JSONB DEFAULT '{"input": 0, "output": 0, "total": 0}'::jsonb,
  status TEXT DEFAULT 'succeeded',
  error_message TEXT,
  processing_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ai_generations" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own audit_logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- 7. Templates table (for reusable project templates)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  application_type TEXT,
  category TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  theme TEXT DEFAULT 'corporate-blue',
  custom_colors JSONB DEFAULT NULL,
  schema JSONB DEFAULT NULL,
  is_public BOOLEAN DEFAULT false,
  source_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read templates" ON templates
  FOR SELECT USING (true);
CREATE POLICY "Users can manage own templates" ON templates
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. Schemas table (general-purpose schema storage, separate from generated_schemas)
CREATE TABLE IF NOT EXISTS schemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT DEFAULT 'generated',
  schema JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE schemas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own schemas" ON schemas
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_generated_schemas_user_id ON generated_schemas(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_schemas_project_id ON generated_schemas(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);

-- Create storage bucket for exports
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated user access to the exports bucket
DROP POLICY IF EXISTS "Authenticated Access" ON storage.objects;
CREATE POLICY "Authenticated Access" ON storage.objects
  FOR ALL USING (bucket_id = 'exports' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'exports' AND auth.role() = 'authenticated');

-- Seed sample templates
INSERT INTO templates (name, description, category, schema, is_public) VALUES
('Business Website', 'Professional corporate website template', 'website', '{"pages":[{"name":"Home","path":"/","type":"landing","components":[{"type":"hero","props":{"title":"Welcome to Our Business","subtitle":"Professional solutions for modern enterprises","cta":"Get Started"}},{"type":"features","props":{"items":[{"title":"Consulting","description":"Expert advice tailored to your needs"},{"title":"Development","description":"Custom software solutions"},{"title":"Support","description":"24/7 technical support"}]}},{"type":"footer","props":{"text":"© 2024 Your Business. All rights reserved."}}]},{"name":"About","path":"/about","type":"page","components":[{"type":"hero","props":{"title":"About Us","subtitle":"Our story and mission"}},{"type":"content","props":{"body":"<p>We are a team of dedicated professionals...</p>"}}]},{"name":"Contact","path":"/contact","type":"page","components":[{"type":"hero","props":{"title":"Contact Us","subtitle":"Get in touch"}},{"type":"form","props":{"fields":[{"label":"Name","type":"text","required":true},{"label":"Email","type":"email","required":true},{"label":"Message","type":"textarea","required":true}]}}]}],"theme":{"primary":"#2563eb","secondary":"#64748b","background":"#ffffff","text":"#0f172a","borderRadius":"8px","fontFamily":"Inter, sans-serif"}}', true)
ON CONFLICT DO NOTHING;
