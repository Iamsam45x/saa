import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  requireAuth,
  validateBody,
} from '@/lib/api-utils';
import { GenerateSchemaSchema } from '@/lib/schemas';
import { SolutionSchema } from '@/lib/solution-schema';
import { AIClient } from '@/lib/ai/client';
import { buildLocalPreview } from '@/lib/ai/local-preview';
import type { SolutionSchemaType } from '@/lib/solution-schema';
import type { GeneratedFile } from '@/store/builder-store';

const SYSTEM_PROMPT = `You are an expert senior frontend engineer building a compact single-page demo UI. You ONLY use Alpine.js.

Output complete HTML inside \`\`\`html ... \`\`\` fences. No JSON, no extra text.

RULES:
- ONE self-contained index.html. Tailwind CSS + Alpine.js CDNs.
- NO React, JSX, Babel, imports, or build tools.
- Keep code CONCISE — use compact Alpine.js syntax (x-data, x-text, x-show, x-for).
- Inline mock data inside arrays — do NOT use localStorage (saves tokens).
- MAX 3 views: Dashboard (KPI cards), one data table with search/add/edit/delete modal, and a third content view.
- Modal: overlay + centered card with x-show, x-model inputs, save/close buttons.
- Use theme colors EXACTLY as provided.
- Complete valid HTML ending with &lt;/html&gt;.
- Output ONLY the code fence. No explanation.`;

const APP_TEMPLATES: Record<string, string> = {
  Website: `Marketing website landing page: hero section, features grid, contact form.`,
  CRM: `CRM dashboard: KPI cards (leads, deals, revenue), lead table with status, customer profiles.`,
  ERP: `ERP dashboard: inventory summary, order table with status badges, billing snapshot.`,
  'Mobile App': `Mobile app home screen: user profile card, activity feed, quick actions grid.`,
  'SaaS Platform': `SaaS dashboard: usage metrics, user management table, billing overview.`,
};

function isHtmlComplete(html: string): boolean {
  const s = html.trim();
  if (!s.endsWith('</html>')) return false;
  const openScripts = (s.match(/<script\b/gi) || []).length;
  const closeScripts = (s.match(/<\/script\s*>/gi) || []).length;
  if (openScripts !== closeScripts) return false;
  return true;
}

function extractFiles(raw: string): { files: GeneratedFile[]; truncated: boolean } {
  // Step 1: strip ```html or ``` fences from start/end, then check if it's HTML
  let cleaned = raw.trim();
  // Remove leading ```html or ``` (with optional language tag)
  cleaned = cleaned.replace(/^```(?:html)?\s*/i, '');
  // Remove trailing ``` (with optional whitespace before it)
  cleaned = cleaned.replace(/\s*```\s*$/i, '');
  cleaned = cleaned.trim();
  const truncated = !isHtmlComplete(cleaned);

  if (
    cleaned.startsWith('<!DOCTYPE html>') ||
    cleaned.startsWith('<html') ||
    cleaned.startsWith('<')
  ) {
    return { files: [{ path: 'index.html', content: cleaned }], truncated };
  }

  // Step 2: Try strict JSON parse (backward compat)
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.files)) return { files: parsed.files, truncated };
    if (Array.isArray(parsed)) return { files: parsed, truncated };
  } catch {}

  // Step 3: Lenient path/content extraction from malformed JSON
  const files: GeneratedFile[] = [];
  const pathRegex = /"path"\s*:\s*"([^"]+)"/g;
  const pathEntries: { path: string; pathEnd: number }[] = [];
  let pm;
  while ((pm = pathRegex.exec(cleaned)) !== null) {
    pathEntries.push({ path: pm[1], pathEnd: pm.index + pm[0].length });
  }
  for (const { path, pathEnd } of pathEntries) {
    const contentKeyIdx = cleaned.indexOf('"content"', pathEnd);
    if (contentKeyIdx === -1) continue;
    const colonIdx = cleaned.indexOf(':', contentKeyIdx + 9);
    if (colonIdx === -1) continue;
    const quoteStart = cleaned.indexOf('"', colonIdx + 1);
    if (quoteStart === -1) continue;
    let quoteEnd = -1;
    let esc = false;
    for (let j = quoteStart + 1; j < cleaned.length; j++) {
      if (esc) {
        esc = false;
        continue;
      }
      if (cleaned[j] === '\\') {
        esc = true;
        continue;
      }
      if (cleaned[j] === '"') {
        quoteEnd = j;
        break;
      }
    }
    if (quoteEnd === -1) continue;
    files.push({ path, content: cleaned.substring(quoteStart + 1, quoteEnd) });
  }
  if (files.length > 0) return { files, truncated };

  // Step 4: Fallback — return cleaned text as index.html
  return { files: [{ path: 'index.html', content: cleaned }], truncated };
}

function buildPreviewHtml(files: GeneratedFile[]): string {
  if (files.length === 1 && files[0].path === 'index.html') {
    return files[0].content;
  }

  const headContent = files
    .filter((f) => f.path.startsWith('head') || f.path.startsWith('_head'))
    .map((f) => f.content)
    .join('\n');
  const bodyContent = files
    .filter((f) => !f.path.startsWith('head') && !f.path.startsWith('_head'))
    .map((f) => f.content)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js" defer></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;min-height:100vh}</style>
  ${headContent}
</head>
<body>
  ${bodyContent}
  <script>document.addEventListener('DOMContentLoaded',function(){if(typeof lucide!=='undefined'&&lucide.createIcons)lucide.createIcons()});</script>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    const body = await request.json();
    const input = validateBody(GenerateSchemaSchema, body);

    let schema;
    if (body.schema) {
      const parsed = SolutionSchema.safeParse(body.schema);
      if (!parsed.success) {
        return createApiError(
          {
            code: 'SCHEMA_VALIDATION_ERROR',
            message: 'Invalid schema',
            details: parsed.error.flatten(),
          },
          422,
        );
      }
      schema = parsed.data;
    } else {
      return createApiError({ code: 'MISSING_SCHEMA', message: 'schema field is required' }, 400);
    }

    const appTemplate = APP_TEMPLATES[input.applicationType] || APP_TEMPLATES.Website;

    const prompt = [
      `Build a compact ${input.applicationType.toLowerCase()} preview SPA called "${input.name}". Keep it under 400 lines.`,
      '',
      `Business: "${input.name}" — ${input.description} — for ${input.targetAudience}`,
      `Features: ${input.features.join(', ')}`,
      '',
      `Template: ${appTemplate}`,
      '',
      `Colors — primary: ${schema.theme.primary_color}, secondary: ${schema.theme.secondary_color}, accent: ${schema.theme.accent_color}. Use EXACTLY.`,
      '',
      'Structure (compact Alpine.js):',
      "- Root div with x-data=\"{activeTab:'dashboard', q:'', show:false, mode:'add', edit:{}, items:[...inline 5 mock rows]}\"",
      '- 2-3 views toggled by x-show="activeTab===\'...\'": dashboard (KPI cards), table (with search input + Add button + modal), and one more',
      '- Table: x-for over filtered rows. Inline filter getter: return items.filter(i=>JSON.stringify(i).toLowerCase().includes(this.q.toLowerCase()))',
      '- Modal (x-show="show"): overlay + centered card. Add/Edit: x-model inputs. Delete: confirm. Save: splice/push items, close modal.',
      '- Sidebar nav with 2-3 buttons, each sets activeTab. Use :class for active highlight.',
      '- Use compact Alpine syntax — no x-init, no localStorage, no x-transition. Inline mock data directly in x-data.',
      '',
      'Return ONLY the complete HTML inside ```html ... ``` fence. Must end with </html>.',
    ].join('\n');

    const ai = new AIClient({ temperature: 0.2, maxOutputTokens: 8192 });
    const startTime = Date.now();
    let content: string;
    let inputTokens = 0;
    let outputTokens = 0;
    let provider: 'anthropic' | 'local' = 'anthropic';
    let fallbackReason: string | null = null;

    try {
      const result = await ai.generateWithRetry(prompt, SYSTEM_PROMPT, 2);
      content = result.content;
      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;
    } catch (err) {
      console.warn(
        'Preview AI generation failed, using local fallback:',
        err instanceof Error ? err.message : String(err),
      );
      content = buildLocalPreview({
        name: input.name,
        description: input.description,
        targetAudience: input.targetAudience,
        location: input.location || '',
        applicationType: input.applicationType,
        features: input.features,
        theme: input.theme,
        schema: schema as SolutionSchemaType,
      });
      provider = 'local';
      fallbackReason = err instanceof Error ? err.message : 'AI generation unavailable';
    }

    const processingTimeMs = Date.now() - startTime;

    let extracted = extractFiles(content);

    if (extracted.truncated && provider === 'anthropic') {
      console.warn('Preview AI output was truncated (incomplete HTML), using local fallback');
      content = buildLocalPreview({
        name: input.name,
        description: input.description,
        targetAudience: input.targetAudience,
        location: input.location || '',
        applicationType: input.applicationType,
        features: input.features,
        theme: input.theme,
        schema: schema as SolutionSchemaType,
      });
      provider = 'local';
      fallbackReason = fallbackReason || 'AI output was truncated';
      extracted = extractFiles(content);
    }

    const files: GeneratedFile[] = [];
    const seen = new Set<string>();
    for (const f of extracted.files) {
      const key = f.path.replace(/\\/g, '/');
      if (!seen.has(key)) {
        seen.add(key);
        files.push({ path: key, content: f.content });
      }
    }
    if (files.length === 0) {
      files.push({ path: 'index.html', content: content.trim() });
    }

    const previewHtml = buildPreviewHtml(files);

    return createApiResponse({
      previewHtml,
      files,
      tokenUsage: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      processingTimeMs,
      model: ai.getModel(),
      provider,
      fallbackReason,
    });
  } catch (err) {
    return handleZodError(err);
  }
}
