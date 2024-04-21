import {
  TAnyToolDefinitionArray,
  TToolDefinitionMap,
} from "@/lib/utils/tool-definition";
import { OpenAIStream } from "ai";
import type OpenAI from "openai";
import zodToJsonSchema from "zod-to-json-schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
};

export function runOpenAICompletion<
  T extends Omit<
    Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
    "functions"
  >,
  const TFunctions extends TAnyToolDefinitionArray,
>(
  openai: OpenAI,
  params: T & {
    functions: TFunctions;
  },
) {
  let text = "";
  let hasFunction = false;

  type TToolMap = TToolDefinitionMap<TFunctions>;
  let onTextContent: (text: string, isFinal: boolean) => void = () => {};

  const functionsMap: Record<string, TFunctions[number]> = {};
  for (const fn of params.functions) {
    functionsMap[fn.name] = fn;
  }

  let onFunctionCall = {} as any;

  const { functions, ...rest } = params;

  (async () => {
    consumeStream(
      OpenAIStream(
        (await openai.chat.completions.create({
          ...rest,
          stream: true,
          functions: functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters) as Record<
              string,
              unknown
            >,
          })),
        })) as any,
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;

            if (!onFunctionCall[functionCallPayload.name]) {
              return;
            }

            // we need to convert arguments from z.input to z.output
            // this is necessary if someone uses a .default in their schema
            const zodSchema = functionsMap[functionCallPayload.name].parameters;
            const parsedArgs = zodSchema.safeParse(
              functionCallPayload.arguments,
            );

            if (!parsedArgs.success) {
              throw new Error(
                `Invalid function call in message. Expected a function call object`,
              );
            }

            onFunctionCall[functionCallPayload.name]?.(parsedArgs.data);
          },
          onToken(token) {
            text += token;
            if (text.startsWith("{")) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        },
      ),
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>,
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: <TName extends TFunctions[number]["name"]>(
      name: TName,
      callback: (
        args: z.output<
          TName extends keyof TToolMap
            ? TToolMap[TName] extends infer TToolDef
              ? TToolDef extends TAnyToolDefinitionArray[number]
                ? TToolDef["parameters"]
                : never
              : never
            : never
        >,
      ) => void | Promise<void>,
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>,
) => {
  fn();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Fake data
export function getStockPrice(name: string) {
  let total = 0;
  for (let i = 0; i < name.length; i++) {
    total = (total + name.charCodeAt(i) * 9999121) % 9999;
  }
  return total / 100;
}

export function runMistralCompletion<
  T extends Omit<Parameters<typeof fetch>[1], "functions">,
  const TFunctions extends TAnyToolDefinitionArray,
>(params: T & { functions: TFunctions }) {
  let text = "";
  let hasFunction = false;
  type TToolMap = TToolDefinitionMap<TFunctions>;
  let onTextContent: (text: string, isFinal: boolean) => void = () => {};
  const functionsMap: Record<string, TFunctions[number]> = {};
  for (const fn of params.functions) {
    functionsMap[fn.name] = fn;
  }
  let onFunctionCall = {} as any;

  (async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/mistral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: params.messages }),
      });

      if (response.ok) {
        const reader = response.body!.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (!hasFunction) {
              onTextContent(text, true);
            }
            break;
          }

          const chunks = new TextDecoder("utf-8").decode(value).split('"');
          const chunk = chunks.filter((_, index) => index % 2 !== 0).join("");
          text += chunk;

          if (chunk.startsWith("{")) {
            hasFunction = true;
            const functionCallPayload = JSON.parse(chunk);
            if (!onFunctionCall[functionCallPayload.name]) {
              return;
            }

            const zodSchema = functionsMap[functionCallPayload.name].parameters;
            const parsedArgs = zodSchema.safeParse(
              functionCallPayload.arguments,
            );
            if (!parsedArgs.success) {
              throw new Error(
                "Invalid function call in message. Expected a function call object",
              );
            }
            onFunctionCall[functionCallPayload.name]?.(parsedArgs.data);
          } else {
            onTextContent(text, false);
          }
        }
      } else {
        console.error("Error calling /api/mistral");
        // Handle error case
      }
    } catch (error) {
      console.error("Error calling /api/mistral");
      // Handle error case
    }
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>,
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: <TName extends TFunctions[number]["name"]>(
      name: TName,
      callback: (
        args: z.output<
          TName extends keyof TToolMap
            ? TToolMap[TName] extends infer TToolDef
              ? TToolDef extends TAnyToolDefinitionArray[number]
                ? TToolDef["parameters"]
                : never
              : never
            : never
        >,
      ) => void | Promise<void>,
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}
