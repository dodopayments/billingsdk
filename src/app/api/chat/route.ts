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
    // Safe JSON parsing
    let reqJson;
    try {
      reqJson = await req.json();
    } catch (error) {
      // 400 = Client sent bad JSON
      return Response.json(
        { error: { message: "Invalid JSON in request body" } },
        { status: 400 }
      );
    }

    // Validate messages array
    if (!Array.isArray(reqJson.messages) || reqJson.messages.length === 0) {
      // 400 = Client sent invalid data
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
    // Distinguish between error types
    console.error("Chat API Error:", error);

    // If it's a known error type, return appropriate status
    if (error instanceof SyntaxError) {
      // JSON parse error caught by outer try
      return Response.json(
        { error: { message: "Invalid JSON in request body" } },
        { status: 400 }
      );
    }

    // For all other errors (AI SDK, Inkeep API, network, etc.)
    // These are SERVER errors, not CLIENT errors
    //  Return 500 for unexpected server-side failures
    return Response.json(
      {
        error: {
          message: "An error occurred while processing your request",
          code: "INTERNAL_SERVER_ERROR",
        },
      },
      { status: 500 }  // 500 = Server error (Inkeep down, timeout, etc.)
    );
  }
}
