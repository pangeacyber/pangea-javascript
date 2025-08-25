import { PangeaConfig } from "../config.js";
import type { PangeaResponse } from "../response.js";
import { AIGuard } from "../types.js";
import { BaseService } from "./base.js";

interface MessageLike {
  role?: string;
  content: unknown;
}

/**
 * Returns relevant messages and their indices in the original list.
 *
 * 1. If the last message is "assistant", then the relevant messages are all
 *    system messages that come before it, plus that last assistant message.
 * 2. Else, find the last "assistant" message. Then the relevant messages are
 *    all system messages that come before it, and all messages that come after
 *    it.
 */
function getRelevantContent<T extends MessageLike>(
  messages: readonly T[]
): { relevantMessages: T[]; originalIndices: number[] } {
  if (!messages.length) {
    return { relevantMessages: [], originalIndices: [] };
  }

  const systemMessages: T[] = [];
  const systemIndices: number[] = [];
  for (const [i, msg] of messages.entries()) {
    if (msg.role === "system") {
      systemMessages.push(msg);
      systemIndices.push(i);
    }
  }

  if (messages.at(-1)?.role === "assistant") {
    return {
      relevantMessages: [...systemMessages, messages.at(-1)!],
      originalIndices: [...systemIndices, messages.length - 1],
    };
  }

  const lastAssistantIndex = messages.findLastIndex(
    (msg) => msg.role === "assistant"
  );

  const relevantMessages: T[] = [];
  const indices: number[] = [];
  for (const [i, msg] of messages.entries()) {
    if (msg.role === "system" || i > lastAssistantIndex) {
      relevantMessages.push(msg);
      indices.push(i);
    }
  }

  return { relevantMessages, originalIndices: indices };
}

function patchMessages<T extends MessageLike>(
  original: readonly T[],
  originalIndices: readonly number[],
  transformed: T[]
): T[] {
  if (original.length === transformed.length) {
    return transformed;
  }

  const transformedMap = new Map<number, T>();
  for (const [i, originalIndex] of originalIndices.entries()) {
    if (i < transformed.length) {
      transformedMap.set(originalIndex, transformed[i]!);
    }
  }

  return original.map((orig, i) => transformedMap.get(i) ?? orig);
}

/** AI Guard API client. */
export class AIGuardService extends BaseService {
  /**
   * Creates a new `AIGuardService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const aiGuard = new AIGuardService("pangea_token", config);
   * ```
   *
   * @summary AI Guard
   */
  constructor(token: string, config: PangeaConfig) {
    super("ai-guard", token, config);
  }

  /**
   * @summary Text Guard for scanning LLM inputs and outputs
   * @description Analyze and redact text to avoid manipulation of the model,
   *   addition of malicious content, and other undesirable data transfers.
   * @operationId ai_guard_post_v1_text_guard
   * @param request Request parameters.
   * @example
   * ```ts
   * const response = await aiGuard.guardText({
   *   text: "foobar",
   * });
   * ```
   */
  guardText(
    request: { text: string } & AIGuard.TextGuardRequest
  ): Promise<PangeaResponse<AIGuard.TextGuardResult>>;

  /**
   * @summary Text Guard for scanning LLM inputs and outputs
   * @description Analyze and redact text to avoid manipulation of the model,
   *   addition of malicious content, and other undesirable data transfers.
   * @operationId ai_guard_post_v1_text_guard
   * @param request Request parameters.
   * @example
   * ```ts
   * const response = await aiGuard.guardText({
   *   messages: [
   *     { role: "user", content: "foobar" },
   *   ],
   * });
   * ```
   */
  guardText(
    request: { messages: MessageLike[] } & AIGuard.TextGuardRequest,
    options?: { onlyRelevantContent?: boolean }
  ): Promise<PangeaResponse<AIGuard.TextGuardResult>>;

  /**
   * @summary Text Guard for scanning LLM inputs and outputs
   * @description Analyze and redact text to avoid manipulation of the model,
   *   addition of malicious content, and other undesirable data transfers.
   * @operationId ai_guard_post_v1_text_guard
   * @param request Request parameters.
   */
  async guardText(
    request: ({ text: string } | { messages: MessageLike[] }) &
      AIGuard.TextGuardRequest,
    options?: { onlyRelevantContent?: boolean }
  ): Promise<PangeaResponse<AIGuard.TextGuardResult>> {
    const { onlyRelevantContent = false } = options ?? {};

    if ("messages" in request && request.messages && onlyRelevantContent) {
      const { messages: originalMessages, ...rest } = request;
      const { relevantMessages, originalIndices } =
        getRelevantContent(originalMessages);

      const response = await this.post<AIGuard.TextGuardResult>(
        "v1/text/guard",
        {
          ...rest,
          messages: relevantMessages,
        }
      );
      if (response.success && response.result.prompt_messages) {
        const transformedMessages = response.result.prompt_messages;
        // @ts-expect-error Input `role` is optional, but on output it's required?
        response.result.prompt_messages = patchMessages(
          originalMessages,
          originalIndices,
          transformedMessages
        );
      }
      return response;
    }

    return this.post("v1/text/guard", request);
  }
}
