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
  const snapshots = new Map<string, string | null>();
  const prompts = [];

  for (const [index, failure] of failures.entries()) {
    console.log(`[${index + 1}/${failures.length}] Preparing: ${failure.title}`);
    let domSnapshot: string | null = null;
    if (failure.url) {
      if (!snapshots.has(failure.url)) {
        snapshots.set(failure.url, await fetchDomSnapshot(failure.url));
      }
      domSnapshot = snapshots.get(failure.url) ?? null;
    }
    prompts.push({
      index: index + 1,
      title: failure.title,
      prompt: buildPrompt({
        testTitle: failure.title,
        errorMessage: failure.errorMessage,
        errorStack: failure.errorStack,
        domSnapshot
      })
    });
  }

  let hadDiagnosisErrors = false;
  for (let start = 0; start < prompts.length; start += 2) {
    const batch = prompts.slice(start, start + 2);
    await Promise.all(batch.map(async ({ index, title, prompt }) => {
      console.log(`[${index}/${failures.length}] Requesting diagnosis: ${title}`);
      try {
        const diagnosis = await diagnoseWithLLM(prompt);
        console.log(`\nTest: ${title}\nDiagnosis:\n${diagnosis}\n`);
      } catch (error) {
        hadDiagnosisErrors = true;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`\nTest: ${title}\nDiagnosis failed: ${message}\n`);
      }
    }));
  }

  if (hadDiagnosisErrors) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
