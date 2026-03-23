"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface CalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

function formatDateTime(dt?: string, d?: string): string {
  const raw = dt || d;
  if (!raw) return "—";
  const date = new Date(raw);
  if (dt) {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.calendar.listEvents(20).then((res) => {
      if (res.success && res.data) {
        setEvents(res.data as CalendarEvent[]);
      } else {
        setError(res.error || "Failed to load events");
      }
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar Events</h1>
            <p className="mt-1 text-gray-500">Upcoming events from your Google Calendar</p>
          </div>
          <Link
            href="/book-appointment"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            + Book Appointment
          </Link>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
            No upcoming events found.
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">
                      {event.summary || "(No title)"}
                    </h2>
                    {event.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="mt-1 text-sm text-gray-400">📍 {event.location}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500 shrink-0">
                    <div className="font-medium">
                      {formatDateTime(event.start?.dateTime, event.start?.date)}
                    </div>
                    {event.end && (
                      <div className="text-xs text-gray-400">
                        until {formatDateTime(event.end.dateTime, event.end.date)}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
