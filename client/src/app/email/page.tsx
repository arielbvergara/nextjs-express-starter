"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { api, SendEmailPayload } from "@/lib/api";

export default function EmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: SendEmailPayload = { to, subject, body };
    const res = await api.email.send(payload);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Failed to send email");
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <div className="text-4xl mb-3">✉️</div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Email Sent!</h1>
            <p className="text-green-700 mb-6">
              Your email to <strong>{to}</strong> was sent successfully.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setTo("");
                  setSubject("");
                  setBody("");
                }}
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
          <h1 className="text-3xl font-bold text-gray-900">Send Email</h1>
          <p className="mt-1 text-gray-500">
            Send a transactional email via the Gmail API using OAuth2 credentials
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Hello from the starter!"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email body here…"
              rows={5}
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
            {loading ? "Sending…" : "Send Email"}
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
