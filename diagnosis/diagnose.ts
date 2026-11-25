import 'dotenv/config';
import { parsePlaywrightReport } from './report.js';
import { buildPrompt } from './prompts.js';
import { diagnoseWithLLM } from './llm-client.js';
import { fetchDomSnapshot } from './mcp-client.js';

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY. Copy .env.example to .env and set your key.');
    process.exit(1);
  }
  const failures = await parsePlaywrightReport('test-results/results.json');
  if (failures.length === 0) { console.log('No failed tests found.'); return; }
  console.log(`Found ${failures.length} failure(s). Diagnosing...\n`);
  for (const failure of failures) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Test: ${failure.title}`);
    const domSnapshot = failure.url ? await fetchDomSnapshot(failure.url) : null;
    const prompt = buildPrompt({
      testTitle: failure.title,
      errorMessage: failure.errorMessage,
      errorStack: failure.errorStack,
      domSnapshot
    });
    const diagnosis = await diagnoseWithLLM(prompt);
    console.log(`\nDiagnosis:\n${diagnosis}\n`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
