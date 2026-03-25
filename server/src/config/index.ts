import dotenv from "dotenv";
import path from "path";

// Load .env then .env.local from project root (.env.local overrides .env)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env.local"), override: true });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  google: {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    sheetsId: process.env.GOOGLE_SHEETS_ID || "",
  },
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID || "",
    clientSecret: process.env.GMAIL_CLIENT_SECRET || "",
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || "",
    senderEmail: process.env.GMAIL_SENDER_EMAIL || "",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  },
} as const;

// Validate required config in production
if (config.env === "production") {
  const required = [
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_PRIVATE_KEY",
    "GMAIL_CLIENT_ID",
    "GMAIL_CLIENT_SECRET",
    "GMAIL_REFRESH_TOKEN",
    "GMAIL_SENDER_EMAIL",
    "GEMINI_API_KEY",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
