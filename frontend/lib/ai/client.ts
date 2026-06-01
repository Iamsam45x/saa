const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface AIClientOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIClientResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export class AIClient {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(options: AIClientOptions = {}) {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    this.model = options.model || 'claude-sonnet-4-20250514';
    this.maxTokens = options.maxTokens || 4096;
    this.temperature = options.temperature ?? 0.3;
  }

  async generate(prompt: string, systemPrompt?: string): Promise<AIClientResponse> {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const startTime = Date.now();

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const content = data.content
      .map((block: { type: string; text: string }) => (block.type === 'text' ? block.text : ''))
      .join('');

    return {
      content,
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
    };
  }

  async generateWithRetry(
    prompt: string,
    systemPrompt?: string,
    maxRetries = 3,
  ): Promise<AIClientResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generate(prompt, systemPrompt);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * 2 ** attempt, 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('AI generation failed after retries');
  }
}

export function buildSchemaPrompt(input: {
  name: string;
  description: string;
  targetAudience: string;
  applicationType: string;
  features: string[];
  theme: string;
}): { prompt: string; system: string } {
  const system =
    'You are an expert UI/UX architect. Generate a complete JSON UI schema for the given application. ' +
    'Output ONLY valid JSON with no markdown formatting or explanation. ' +
    'The schema must follow this structure: ' +
    '{ "layout": { "type": string, "columns": number }, ' +
    '"navigation": { "type": string, "items": Array<{label:string, href:string, icon?:string}> }, ' +
    '"pages": Array<{ name: string, path: string, sections: Array<{ type: string, title: string, content: any }> }>, ' +
    '"components": Array<{ id: string, type: string, props: Record<string,any> }>, ' +
    '"theme": { "colors": Record<string,string>, "typography": Record<string,string>, "spacing": Record<string,string> } }';

  const prompt = `Generate a UI schema for a ${input.applicationType} application.

  Project: ${input.name}
  Description: ${input.description}
  Target Audience: ${input.targetAudience}
  Theme: ${input.theme}
  Required Features: ${input.features.join(', ')}

  Return a complete JSON schema including layout, navigation, pages, components, and theme configuration.`;

  return { prompt, system };
}
