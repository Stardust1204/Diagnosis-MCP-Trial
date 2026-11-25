# DemoBlaze MCP + BYOK Diagnosis

## Setup
npm install
cp .env.example .env   # add your provider API key as OPENAI_API_KEY
npx playwright install chromium

For Gemini, set `LLM_MODEL` to a Gemini model name (for example,
`gemini-3.8-flash`). The diagnosis client selects Gemini's OpenAI-compatible
endpoint automatically. Set `LLM_BASE_URL` to override the endpoint if needed.

## Run
npm test
npm run diagnose

Diagnosis reuses snapshots for repeated URLs and runs up to two model requests
at a time. Each model request times out after 45 seconds, with one retry for
transient API errors.
