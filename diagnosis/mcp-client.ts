import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

let client: Client | null = null;

export async function getMcpClient(): Promise<Client> {
  if (client) return client;
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['@playwright/mcp@latest', '--config', 'mcp/playwright-mcp.config.json']
  });
  client = new Client({ name: 'demoblaze-diagnoser', version: '1.0.0' }, {});
  await client.connect(transport);
  return client;
}

export async function fetchDomSnapshot(url: string): Promise<string | null> {
  try {
    const mcp = await getMcpClient();
    await mcp.callTool({ name: 'browser_navigate', arguments: { url } });
    const result = await mcp.callTool({ name: 'browser_snapshot', arguments: {} });
    return (result as any).content?.[0]?.text ?? null;
  } catch (e) {
    console.error('[MCP] Failed to fetch DOM snapshot:', e);
    return null;
  }
}
