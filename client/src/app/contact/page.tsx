"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { api, ContactRowPayload } from "@/lib/api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const row: ContactRowPayload = { name, email, phone: phone || undefined, message };
    const res = await api.sheets.appendRow(row);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Failed to send message");
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <div className="text-4xl mb-3">📩</div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Message Received!</h1>
            <p className="text-green-700 mb-6">
              Thanks, <strong>{name}</strong>! Your contact request has been registered. We'll get back to you at{" "}
              <strong>{email}</strong> shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSuccess(false); setName(""); setEmail(""); setPhone(""); setMessage(""); }}
                className="rounded-lg border border-green-300 px-4 py-2 text-sm text-green-700 hover:bg-green-100 transition-colors"
              >
                Send another
              </button>
              <Link
                href="/"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800 transition-colors"
              >
                Back to home
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
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-1 text-gray-500">
            Send us a message — your request will be logged to a Google Sheet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
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
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              rows={4}
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
            {loading ? "Sending…" : "Send Message"}
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
