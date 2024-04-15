import { OpenAIStream } from "ai";
import type OpenAI from "openai";
import zodToJsonSchema from "zod-to-json-schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

/**
 * Any array of ToolDefinitions.
 */
export type TAnyToolDefinitionArray = Array<
  ToolDefinition<string, z.AnyZodObject>
>;

/**
 * A map of ToolDefinitions, indexed by name.
 */
export type TAnyToolDefinitionMap = Readonly<{
  [K in string]: ToolDefinition<any, any>;
}>;

/**
 * Helper type to create a map of ToolDefinitions, indexed by name, from an array of ToolDefinitions.
 */
export type TToolDefinitionMap<
  TToolDefinitionArray extends TAnyToolDefinitionArray,
> = TToolDefinitionArray extends [infer TFirst, ...infer Rest]
  ? TFirst extends TAnyToolDefinitionArray[number]
    ? Rest extends TAnyToolDefinitionArray
      ? Readonly<{ [K in TFirst["name"]]: TFirst }> & TToolDefinitionMap<Rest>
      : never
    : never
  : Readonly<{}>;

/**
 * A tool definition contains all information required for a language model to generate tool calls.
 */
export interface ToolDefinition<
  NAME extends string,
  PARAMETERS extends z.AnyZodObject,
> {
  /**
   * The name of the tool.
   * Should be understandable for language models and unique among the tools that they know.
   *
   * Note: Using generics to enable result type inference when there are multiple tool calls.
   */
  name: NAME;

  /**
   * A optional description of what the tool does. Will be used by the language model to decide whether to use the tool.
   */
  description?: string;

  /**
   * The schema of the input that the tool expects. The language model will use this to generate the input.
   * Use descriptions to make the input understandable for the language model.
   */
  parameters: PARAMETERS;
}

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
