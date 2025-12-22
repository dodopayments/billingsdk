import { ProvideLinksToolSchema } from "../../../lib/inkeep-qa-schema";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText } from "ai";

export const runtime = "edge";

const openai = createOpenAICompatible({
  name: "inkeep",
  apiKey: process.env.INKEEP_API_KEY || "",
  baseURL: "https://api.inkeep.com/v1",
});

export async function POST(req: Request) {
  if (!process.env.INKEEP_API_KEY) {
    return Response.json(
      { error: { message: "INKEEP_API_KEY is required" } },
      { status: 500 }
    );
  }

  try {
    const reqJson = await req.json();

    /
    if (!Array.isArray(reqJson.messages) || reqJson.messages.length === 0) {
      return Response.json(
        { error: { message: "messages array is required" } },
        { status: 400 }
      );
    }

    const result = streamText({
      model: openai("inkeep-qa-sonnet-4"),
      tools: {
        provideLinks: {
          inputSchema: ProvideLinksToolSchema,
        },
      },
      messages: convertToModelMessages(reqJson.messages, {
        ignoreIncompleteToolCalls: true,
      }),
      toolChoice: "auto",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { error: { message: "Invalid request" } },
      { status: 400 }
    );
  }
}