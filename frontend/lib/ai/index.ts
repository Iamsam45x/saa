import { getAccessToken } from '@/components/auth/auth-context';

export async function generateProjectConfig(prompt: string) {
  const token = await getAccessToken();
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}
