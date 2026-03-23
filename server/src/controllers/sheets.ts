import { Request, Response } from "express";
import { googleAuth } from "../config/google";
import { config } from "../config";
import { SheetsService } from "../services/sheets";
import { cache } from "../lib/cache";
import { ApiResponse, ContactRow } from "../types";

export async function readSpreadsheet(
  req: Request,
  res: Response<ApiResponse>
): Promise<void> {
  try {
    const spreadsheetId = req.params.spreadsheetId as string;
    const range = (req.query.range as string) || "Sheet1";
    const cacheKey = `sheets:${spreadsheetId}:${range}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached });
      return;
    }

    const sheetsService = new SheetsService(googleAuth);
    const data = await sheetsService.readSpreadsheet(spreadsheetId, range);

    cache.set(cacheKey, data);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Sheets read error:", error.message);
    res.status(500).json({ success: false, error: "Failed to read spreadsheet" });
  }
}

export async function appendRow(
  req: Request,
  res: Response<ApiResponse>
): Promise<void> {
  try {
    const { name, email, phone, message }: ContactRow = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: "name, email, and message are required" });
      return;
    }

    if (!config.google.sheetsId) {
      res.status(500).json({ success: false, error: "GOOGLE_SHEETS_ID is not configured" });
      return;
    }

    const timestamp = new Date().toISOString();
    const values = [timestamp, name, email, phone || "", message];

    const sheetsService = new SheetsService(googleAuth);
    await sheetsService.appendRow(config.google.sheetsId, values);

    // Invalidate cached reads for this sheet so the next GET reflects the new row
    cache.invalidatePrefix(`sheets:${config.google.sheetsId}:`);

    res.status(201).json({ success: true, message: "Contact registered successfully" });
  } catch (error: any) {
    console.error("Sheets appendRow error:", error.message);
    res.status(500).json({ success: false, error: "Failed to register contact" });
  }
}
