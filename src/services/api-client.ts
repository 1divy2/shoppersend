/**
 * Central API client abstraction.
 *
 * All data requests in the app go through this client. The default
 * implementation routes calls to an in-memory mock backend (see
 * `./mock/handlers.ts`). To swap in a real backend (e.g. Spring Boot),
 * replace the `transport` implementation — every service file already
 * uses this client, so no UI code needs to change.
 */

import { mockTransport } from "./mock/transport";
import type { ApiError } from "@/lib/types";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
  /** Optional artificial delay override for the mock backend (ms) */
  mockLatencyMs?: number;
}

export interface Transport {
  request<T>(path: string, options: RequestOptions): Promise<T>;
}

let transport: Transport;

export function setTransport(next: Transport) {
  transport = next;
}

export class ApiException extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(error: ApiError, status = 400) {
    super(error.message);
    this.code = error.code;
    this.status = status;
    this.details = error.details;
  }
}

export const api = {
  get: <T>(path: string, opts: Omit<RequestOptions, "method" | "body"> = {}) =>
    transport.request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, "method" | "body"> = {}) =>
    transport.request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, "method" | "body"> = {}) =>
    transport.request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, "method" | "body"> = {}) =>
    transport.request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts: Omit<RequestOptions, "method" | "body"> = {}) =>
    transport.request<T>(path, { ...opts, method: "DELETE" }),
};

export const httpTransport: Transport = {
  async request(path, { method = "GET", body, query, headers }) {
    // 1. Construct URL
    const isBrowser = typeof window !== "undefined";
    const envApiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = envApiUrl ? envApiUrl : (isBrowser ? window.location.origin : "http://localhost:8081");
    const url = new URL(path, baseUrl);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v != null) url.searchParams.set(k, String(v));
      }
    }

    // 2. Attach JWT token
    const token = isBrowser ? localStorage.getItem("shoppersend_auth_token") : null;
    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };
    if (token) {
      fetchHeaders["Authorization"] = `Bearer ${token}`;
    }

    // 3. Make the fetch request
    const res = await fetch(url.toString(), {
      method,
      headers: fetchHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errData;
      try {
        errData = await res.json();
      } catch (e) {
        if (res.status === 401 || res.status === 403) {
          errData = { message: "Please log in to continue", code: "unauthorized" };
          if (typeof window !== "undefined") {
            localStorage.removeItem("shoppersend_auth_token");
          }
        } else {
          errData = { message: "Server error", code: "error" };
        }
      }
      throw new ApiException(errData, res.status);
    }

    // 4. Handle Spring Boot ApiResponse<T> Wrapper
    let json = await res.json();
    
    // If backend wrapped it in { success: true, data: { ... } }, extract it!
    if (json && typeof json === "object" && "success" in json && "data" in json) {
      json = json.data;
    }

    // Map Spring Boot Page<T> to Frontend Page<T>
    if (json && typeof json === "object" && "content" in json && "totalElements" in json) {
      json.items = json.content;
      json.total = json.totalElements;
    }

    // 5. Intercept auth responses to automatically save/clear the token
    if (path.includes("/auth/login") || path.includes("/auth/register")) {
      // Map Spring Boot's access_token to the frontend's expected token
      if (json && json.access_token) {
        json.token = json.access_token;
      }
      if (json && json.token && typeof window !== "undefined") {
        localStorage.setItem("shoppersend_auth_token", json.token);
      }
    } else if (path.includes("/auth/logout")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("shoppersend_auth_token");
      }
    }

    return json;
  },
};

// WE ARE LIVE! Switching to the real backend HTTP transport.
transport = httpTransport;
