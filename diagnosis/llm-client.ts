import OpenAI, { APIError } from 'openai';

const model = process.env.LLM_MODEL || 'gpt-4o-mini';
const baseURL = process.env.LLM_BASE_URL
  || (model.startsWith('gemini-') ? 'https://generativelanguage.googleapis.com/v1beta/openai/' : undefined);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL,
  timeout: 45_000,
  maxRetries: 1
});

export async function diagnoseWithLLM(prompt: string): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a senior Playwright test engineer. Diagnose the failure and suggest a concrete fix.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });
    return res.choices[0]?.message?.content ?? 'No diagnosis returned.';
  } catch (error) {
    if (error instanceof APIError && error.status === 404) {
      throw new Error(
        `LLM API returned 404 for model "${model}". Check that the model name is available for your API key and that LLM_BASE_URL points to the correct provider endpoint.`,
        { cause: error }
      );
    }
    throw error;
  }
}
