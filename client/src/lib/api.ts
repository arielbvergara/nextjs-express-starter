import type { ApiResponse, MenuItem } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    return { success: false, error: error.error || "Request failed" };
  }

  return response.json();
}

// ── Types ─────────────────────────────────────────────
export interface CreateEventPayload {
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string }[];
}

export interface ContactRowPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

// ── Calendar ─────────────────────────────────────────
export const calendar = {
  listEvents: (maxResults = 10) =>
    request(`/calendar/events?maxResults=${maxResults}`),
  createEvent: (event: CreateEventPayload) =>
    request("/calendar/events", { method: "POST", body: JSON.stringify(event) }),
};

// ── Sheets ───────────────────────────────────────────
export const sheets = {
  read: (spreadsheetId: string, range?: string) =>
    request(`/sheets/${spreadsheetId}${range ? `?range=${range}` : ""}`),
  appendRow: (row: ContactRowPayload) =>
    request("/sheets/rows", { method: "POST", body: JSON.stringify(row) }),
};

// ── Drive ────────────────────────────────────────────
export const drive = {
  listFiles: (pageSize = 20) =>
    request(`/drive/files?pageSize=${pageSize}`),
  downloadFile: (fileId: string) => `${API_BASE}/drive/files/${fileId}`,
};

// ── Email ─────────────────────────────────────────────
export const email = {
  send: (payload: SendEmailPayload) =>
    request("/email/send", { method: "POST", body: JSON.stringify(payload) }),
};

// ── Menu ──────────────────────────────────────────────
export const menu = {
  list: () => request<MenuItem[]>("/menu"),
};

export const api = { calendar, sheets, drive, email, menu };
export default api;
