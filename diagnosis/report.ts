import fs from 'fs/promises';

export async function parsePlaywrightReport(reportPath: string) {
  const raw = await fs.readFile(reportPath, 'utf-8');
  const report = JSON.parse(raw);
  const failures: Array<{ title: string; errorMessage: string; errorStack?: string; url?: string }> = [];
  for (const suite of report.suites ?? []) collectFailures(suite, failures);
  return failures;
}

function collectFailures(suite: any, out: any[]) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      for (const result of test.results ?? []) {
        if (result.status === 'failed') {
          out.push({
            title: spec.title,
            errorMessage: result.error?.message ?? 'Unknown error',
            errorStack: result.error?.stack,
            url: result.attachments?.find((a: any) => a.name === 'url')?.body
          });
        }
      }
    }
  }
  for (const child of suite.suites ?? []) collectFailures(child, out);
}
