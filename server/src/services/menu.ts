import { GoogleAuth } from "google-auth-library";
import { MenuItem } from "../types";
import { SheetsService } from "./sheets";

const MENU_SHEET_RANGE = "Menu";

export class MenuService {
  private readonly sheetsService: SheetsService;

  constructor(auth: GoogleAuth) {
    this.sheetsService = new SheetsService(auth);
  }

  async getMenuItems(spreadsheetId: string): Promise<MenuItem[]> {
    const data = await this.sheetsService.readSpreadsheet(spreadsheetId, MENU_SHEET_RANGE);
    return this.parseMenuItems(data.values);
  }

  parseMenuItems(rows: string[][]): MenuItem[] {
    return rows
      .slice(1)
      .filter((row) => row[0]?.trim() !== "" && row[0] !== undefined)
      .map((row) => ({
        title: row[0]?.trim() ?? "",
        description: row[1]?.trim() ?? "",
        price1Description: row[2]?.trim() ?? "",
        price1: row[3]?.trim() ?? "",
        price2Description: row[4]?.trim() || undefined,
        price2: row[5]?.trim() || undefined,
        imageUrl: row[6]?.trim() ?? "",
      }));
  }
}
