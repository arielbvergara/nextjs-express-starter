import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { SheetData } from "../types";

export class SheetsService {
  private sheets: sheets_v4.Sheets;

  constructor(auth: GoogleAuth) {
    this.sheets = google.sheets({ version: "v4", auth });
  }

  async readSpreadsheet(
    spreadsheetId: string,
    range = "Sheet1"
  ): Promise<SheetData> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return {
      range: response.data.range || range,
      values: (response.data.values as string[][]) || [],
    };
  }

  async appendRow(spreadsheetId: string, values: string[]): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  }
}
