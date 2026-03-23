"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { api, CreateEventPayload } from "@/lib/api";

const SPECIALTIES = [
  "General Practitioner",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedist",
  "Pediatrician",
  "Psychiatrist",
];

const DURATIONS: { label: string; minutes: number }[] = [
  { label: "30 minutes", minutes: 30 },
  { label: "60 minutes", minutes: 60 },
  { label: "90 minutes", minutes: 90 },
];

interface SuccessData {
  summary: string;
  start: string;
  end: string;
  htmlLink?: string;
}

export default function BookAppointmentPage() {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

    const event: CreateEventPayload = {
      summary: `Dr. Appointment – ${specialty} (${name})`,
      description: notes || `Patient: ${name}\nSpecialty: ${specialty}`,
      start: { dateTime: startDateTime.toISOString() },
      end: { dateTime: endDateTime.toISOString() },
    };

    const res = await api.calendar.createEvent(event);
    setLoading(false);

    if (res.success && res.data) {
      const data = res.data as any;
      setSuccess({
        summary: data.summary,
        start: data.start?.dateTime,
        end: data.end?.dateTime,
        htmlLink: data.htmlLink,
      });
    } else {
      setError(res.error || "Failed to book appointment");
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Appointment Booked!</h1>
            <p className="text-green-700 font-medium mb-1">{success.summary}</p>
            <p className="text-sm text-green-600 mb-1">
              {new Date(success.start).toLocaleString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-green-500 mb-6">
              until{" "}
              {new Date(success.end).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            {success.htmlLink && (
              <a
                href={success.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-4 text-sm text-blue-600 underline"
              >
                View in Google Calendar →
              </a>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSuccess(null)}
                className="rounded-lg border border-green-300 px-4 py-2 text-sm text-green-700 hover:bg-green-100 transition-colors"
              >
                Book another
              </button>
              <Link
                href="/calendar"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800 transition-colors"
              >
                View calendar
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="mt-1 text-gray-500">Schedule a doctor appointment and block your calendar</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Specialty <span className="text-red-500">*</span>
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SPECIALTIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DURATIONS.map((d) => (
                <option key={d.minutes} value={d.minutes}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or reason for visit…"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Booking…" : "Book Appointment"}
          </button>
        </form>

        <div className="mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
