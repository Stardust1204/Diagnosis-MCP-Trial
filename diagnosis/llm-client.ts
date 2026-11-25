import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function diagnoseWithLLM(prompt: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a senior Playwright test engineer. Diagnose the failure and suggest a concrete fix.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2
  });
  return res.choices[0]?.message?.content ?? 'No diagnosis returned.';
}
