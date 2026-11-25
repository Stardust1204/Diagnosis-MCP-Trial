export function buildPrompt(params: {
  testTitle: string;
  errorMessage: string;
  errorStack?: string;
  domSnapshot?: string | null;
}): string {
  const { testTitle, errorMessage, errorStack, domSnapshot } = params;
  return `
## Failed Test
**Title:** ${testTitle}

## Error
\`\`\`
${errorMessage}
\`\`\`

${errorStack ? `## Stack Trace\n\`\`\`\n${errorStack}\n\`\`\`\n` : ''}

${domSnapshot ? `## DOM Snapshot at Failure\n\`\`\`html\n${domSnapshot.slice(0, 8000)}\n\`\`\`\n` : '## DOM Snapshot\nNot available.\n'}

## Instructions
1. Root-cause hypothesis.
2. Most likely selector or timing issue.
3. Concrete Playwright TypeScript fix.
4. Flakiness-prevention advice.
`;
}
