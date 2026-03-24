# nextjs-express-starter

A full-stack monorepo with **Next.js** (frontend) + **Express** (backend API), pre-configured with Google services integration — Calendar, Sheets, Drive via a **service account**, and Gmail for transactional email via **OAuth2**.

## Tech Stack

| Layer       | Technology                           |
| ----------- | ------------------------------------ |
| Frontend    | Next.js 16, React 19, TypeScript     |
| Backend     | Express 5, TypeScript, Node 20       |
| Auth        | Google Service Account + Gmail OAuth2 |
| Google APIs | Calendar, Sheets, Drive, Gmail       |
| Package Mgr | pnpm (workspaces)                    |
| Containers  | Docker & Docker Compose              |

## Project Structure

```
├── client/                  # Next.js frontend (port 3000)
│   └── src/
│       ├── app/             # App Router pages
│       ├── lib/             # API client (api.ts)
│       └── types/           # TypeScript types
├── server/                  # Express backend (port 4000)
│   └── src/
│       ├── config/          # App config & Google Auth setup
│       ├── controllers/     # Route controllers
│       ├── lib/             # In-memory cache
│       ├── middleware/      # Rate limiter & error handler
│       ├── routes/          # API route definitions
│       ├── services/        # Google API service classes
│       ├── types/           # TypeScript types
│       └── index.ts         # Entry point
├── docker/
│   ├── client.Dockerfile
│   └── server.Dockerfile
├── docker-compose.yml
├── pnpm-workspace.yaml
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- A Google Cloud project with a service account

### 1. Clone & Install

```bash
git clone https://github.com/arielbvergara/nextjs-express-starter.git
cd nextjs-express-starter
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. See [Google Cloud Setup](#google-cloud-setup) and [Gmail OAuth2 Setup](#gmail-oauth2-setup) below.

### 3. Run Development

```bash
# Run both client and server concurrently
pnpm dev

# Or run individually
pnpm dev:client    # http://localhost:3000
pnpm dev:server    # http://localhost:4000
```

### 4. Run with Docker

```bash
docker compose up --build
```

## Environment Variables

```bash
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Google Service Account (Calendar, Sheets, Drive)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Resource IDs
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_SHEETS_ID=your-spreadsheet-id

# Gmail OAuth2 (transactional email)
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_SENDER_EMAIL=your-gmail-address@gmail.com
```

## Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the following APIs:
   - Google Calendar API
   - Google Sheets API
   - Google Drive API
4. Create a **Service Account**:
   - Go to **IAM & Admin → Service Accounts**
   - Click **Create Service Account**
   - Generate a JSON key and copy the `client_email` and `private_key` into your `.env.local`
5. Share your resources with the service account email:
   - **Google Calendar**: open calendar settings → share with the service account email (give it "Make changes to events" permission)
   - **Google Sheet**: click Share → add the service account email as an Editor

## Gmail OAuth2 Setup

The Gmail integration uses OAuth2 user credentials (not a service account) to send email on behalf of a real Gmail account.

1. In [Google Cloud Console](https://console.cloud.google.com/), enable the **Gmail API**
2. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URI: `https://developers.google.com/oauthplayground`
3. Go to **APIs & Services → OAuth consent screen**
   - Add your Gmail address as a **Test user**
4. Open [OAuth2 Playground](https://developers.google.com/oauthplayground)
   - Click the gear icon → enable **Use your own OAuth credentials** → paste your Client ID and Secret
   - Authorize the scope: `https://www.googleapis.com/auth/gmail.send`
   - Exchange the authorization code for tokens and copy the **Refresh token**
5. Add all four values to your `.env.local`

## API Endpoints

All endpoints are prefixed with `/api`.

### Health

| Method | Path      | Description  |
| ------ | --------- | ------------ |
| `GET`  | `/health` | Health check |

### Calendar

| Method | Path               | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| `GET`  | `/calendar/events` | List upcoming events from `GOOGLE_CALENDAR_ID`. Query: `maxResults` (default: 10) |
| `POST` | `/calendar/events` | Create a calendar event. Body: `{ summary, description?, start: { dateTime }, end: { dateTime }, attendees? }` |

### Sheets

| Method | Path                     | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| `GET`  | `/sheets/:spreadsheetId` | Read spreadsheet data. Query: `range` (default: Sheet1) |
| `POST` | `/sheets/rows`           | Append a row to `GOOGLE_SHEETS_ID`. Body: `{ name, email, phone?, message }`. Writes: `[timestamp, name, email, phone, message]` |

### Drive

| Method | Path                   | Description             |
| ------ | ---------------------- | ----------------------- |
| `GET`  | `/drive/files`         | List files. Query: `pageSize` (default: 20), `q` (search) |
| `GET`  | `/drive/files/:fileId` | Download a file         |

### Email

| Method | Path           | Description                              |
| ------ | -------------- | ---------------------------------------- |
| `POST` | `/email/send`  | Send an email via Gmail API. Body: `{ to, subject, body }` |

## Rate Limiting & Cache

**Rate limits** are applied per route:
- Read endpoints (`GET`): 60 requests / minute
- Write endpoints (`POST`): 10 requests / minute

**In-memory cache** (5-minute TTL) is applied to all `GET` responses for Calendar and Sheets to avoid hammering the Google APIs. Cache is automatically invalidated when a write to the same resource succeeds.

## Example Pages

Four usage example pages are included to demonstrate all services end-to-end:

| Page                | Route               | Description                                            |
| ------------------- | ------------------- | ------------------------------------------------------ |
| Calendar Events     | `/calendar`         | Lists upcoming events from `GOOGLE_CALENDAR_ID`        |
| Book an Appointment | `/book-appointment` | Form that creates a doctor appointment in the calendar |
| Contact Us          | `/contact`          | Form that appends a row to `GOOGLE_SHEETS_ID`          |
| Send Email          | `/email`            | Form that sends a transactional email via the Gmail API |

## Scripts

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `pnpm dev`            | Run client + server in dev mode    |
| `pnpm dev:client`     | Run Next.js dev server             |
| `pnpm dev:server`     | Run Express dev server             |
| `pnpm build`          | Build both client and server       |
| `pnpm build:client`   | Build Next.js                      |
| `pnpm build:server`   | Build Express                      |
| `pnpm start`          | Start production builds            |
| `pnpm lint`           | Lint both projects                 |
| `pnpm type-check`     | TypeScript check both projects     |
| `pnpm test`           | Run server unit tests              |

## License

MIT
