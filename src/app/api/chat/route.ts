import { ProvideLinksToolSchema } from '../../../lib/inkeep-qa-schema';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText } from 'ai';

export const runtime = 'edge';

if (!process.env.INKEEP_API_KEY) {
  console.log('INKEEP_API_KEY environment variable is required for chat functionality');
}

const openai = createOpenAICompatible({
  name: 'inkeep',
  apiKey: process.env.INKEEP_API_KEY,
  baseURL: 'https://api.inkeep.com/v1',
});

export async function POST(req: Request) {
  const reqJson = await req.json();

  const result = streamText({
    model: openai('inkeep-qa-sonnet-4'),
    tools: {
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
    messages: convertToModelMessages(reqJson.messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}
