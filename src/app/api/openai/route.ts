import { ChatGPTMessage, OpenAIStream } from "@/lib/openai-stream"
import {MessageArraySchema } from "@/lib/validators/MessageType"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    const requestBody = await req.json();
    if (!requestBody) {
        return new Response("Invalid request body");
    }

    const ParsedrequestBody = MessageArraySchema.parse(requestBody);

    const outboundMessages: ChatGPTMessage[] = ParsedrequestBody.map((message) => ({
        role: message.isUser ? "user" : "system",
        content: message.text,
    }));

    outboundMessages.unshift({
        role: "system",
        content: process.env.CHATBOT_TEMPLATE || "",
    });

    const payload = {
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: outboundMessages,
        temperature: 0.5,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payload)
    console.log("from /api/openai", stream)

    return new Response(stream, {
        headers: { "Content-Type": "text/event-stream"},
    });
}