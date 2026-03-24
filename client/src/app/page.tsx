import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          nextjs-express-starter
        </h1>
        <p className="text-lg text-[var(--muted)]">
          Next.js + Express with Google Calendar, Sheets, Drive &amp; Gmail
          pre-configured.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--accent)] px-6 py-3 text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Dashboard
          </Link>
          <a
            href="https://github.com/arielbvergara/nextjs-express-starter/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--border)] px-6 py-3 font-medium hover:bg-[var(--border)] transition-colors"
          >
            Documentation
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8 text-left text-sm">
          {[
            {
              title: "Google Calendar",
              desc: "Read events via Calendar API using a service account",
            },
            {
              title: "Google Sheets",
              desc: "Read spreadsheet data via Sheets API",
            },
            {
              title: "Google Drive",
              desc: "List and download files via Drive API",
            },
            {
              title: "Service Account",
              desc: "Server-side auth — no user login required",
            },
            {
              title: "Gmail API",
              desc: "Send transactional emails via OAuth2 user credentials",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-[var(--border)] p-4"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-[var(--muted)] mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 text-left">
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
            Usage Examples
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                href: "/calendar",
                label: "View Calendar Events",
                desc: "Browse upcoming events from your Google Calendar",
                icon: "📅",
              },
              {
                href: "/book-appointment",
                label: "Book an Appointment",
                desc: "Simulate booking a doctor visit — creates a real calendar event",
                icon: "🩺",
              },
              {
                href: "/contact",
                label: "Contact Us",
                desc: "Submit a contact request — appends a row to a Google Sheet",
                icon: "📋",
              },
              {
                href: "/email",
                label: "Send Email",
                desc: "Send a transactional email via the Gmail API using OAuth2",
                icon: "✉️",
              },
              {
                href: "/menu",
                label: "Restaurant Menu",
                desc: "Display a restaurant menu fetched from a Google Sheet",
                icon: "🍽️",
              },
            ].map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="flex items-center gap-4 rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--border)] transition-colors"
              >
                <span className="text-2xl">{example.icon}</span>
                <div>
                  <h3 className="font-semibold">{example.label}</h3>
                  <p className="text-[var(--muted)] mt-0.5">{example.desc}</p>
                </div>
                <span className="ml-auto text-[var(--muted)]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
