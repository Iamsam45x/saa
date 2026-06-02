import type { GenerateSchemaInput } from '@/lib/schemas';
import { validateSolutionSchema } from '@/lib/solution-schema';
import { buildLocalSolutionSchema, buildOrchestrationPrompt } from '@/lib/ai/orchestrator';

const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

interface AIClientOptions {
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
}

interface AIClientResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  provider: 'anthropic';
}

function extractOutputText(data: any): string {
  if (!Array.isArray(data?.content)) return '';

  return data.content
    .map((item: any) => {
      if (item?.type === 'text' && typeof item.text === 'string') return item.text;
      return '';
    })
    .join('')
    .trim();
}

function stripJsonFences(value: string) {
  return value
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export class AIClient {
  private apiKey: string;
  private model: string;
  private maxOutputTokens: number;
  private temperature: number;

  constructor(options: AIClientOptions = {}) {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    this.model = options.model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    this.maxOutputTokens = options.maxOutputTokens || 4096;
    this.temperature = options.temperature ?? 0.3;
  }

  getModel() {
    return this.model;
  }

  async generate(prompt: string, systemPrompt?: string): Promise<AIClientResponse> {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const response = await fetch(ANTHROPIC_MESSAGES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxOutputTokens,
        temperature: this.temperature,
        system: systemPrompt || 'Return valid JSON only.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const content = extractOutputText(data);

    return {
      content,
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
      provider: 'anthropic',
    };
  }

  async generateWithRetry(
    prompt: string,
    systemPrompt?: string,
    maxRetries = 3,
  ): Promise<AIClientResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        return await this.generate(prompt, systemPrompt);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * 2 ** (attempt - 1), 4000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('AI generation failed after retries');
  }
}

export function buildSchemaPrompt(input: GenerateSchemaInput) {
  return buildOrchestrationPrompt(input);
}

export function parseAIJson(content: string) {
  return JSON.parse(stripJsonFences(content));
}

export async function generateSolutionSchema(
  input: GenerateSchemaInput,
  options: AIClientOptions = {},
) {
  const { prompt, system } = buildSchemaPrompt(input);
  const startTime = Date.now();

  try {
    const ai = new AIClient(options);
    const result = await ai.generateWithRetry(prompt, system);
    const parsed = parseAIJson(result.content);
    const validation = validateSolutionSchema(parsed);

    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    return {
      schema: validation.data,
      tokenUsage: {
        input: result.inputTokens,
        output: result.outputTokens,
        total: result.inputTokens + result.outputTokens,
      },
      processingTimeMs: Date.now() - startTime,
      provider: result.provider,
      fallbackReason: null as string | null,
      model: new AIClient(options).getModel(),
    };
  } catch (err) {
    const fallbackSchema = buildLocalSolutionSchema(input);

    return {
      schema: fallbackSchema,
      tokenUsage: {
        input: 0,
        output: 0,
        total: 0,
      },
      processingTimeMs: Date.now() - startTime,
      provider: 'local' as const,
      fallbackReason: err instanceof Error ? err.message : 'AI generation unavailable',
      model: options.model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    };
  }
}
