/**
 * Mock transport — routes API calls to in-process handlers with a tiny
 * artificial latency so the UI exercises real loading states.
 */

import type { RequestOptions, Transport } from "../api-client";
import { ApiException } from "../api-client";
import { handle } from "./handlers";

const DEFAULT_LATENCY_MS = 120;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const mockTransport: Transport = {
  async request<T>(path: string, options: RequestOptions): Promise<T> {
    await delay(options.mockLatencyMs ?? DEFAULT_LATENCY_MS);
    try {
      const result = await handle(path, options);
      return result as T;
    } catch (e) {
      if (e instanceof ApiException) throw e;
      const msg = e instanceof Error ? e.message : "Unknown error";
      throw new ApiException({ code: "internal_error", message: msg }, 500);
    }
  },
};
