import { GoogleAuth } from "google-auth-library";
import { MenuItem, MenuSection } from "../types";
import { SheetsService } from "./sheets";

const MENU_SHEET_RANGE = "Menu";
const HEADER_ROW_MARKER = "title";

const COL_TITLE = 0;
const COL_DESCRIPTION = 1;
const COL_PRICE1_DESC = 2;
const COL_PRICE1 = 3;
const COL_PRICE2_DESC = 4;
const COL_PRICE2 = 5;
const COL_IMAGE_URL = 6;
const COL_INGREDIENTS = 7;
const MIN_DATA_ROW_COLUMNS = 2;

export class MenuService {
  private readonly sheetsService: SheetsService;

  constructor(auth: GoogleAuth) {
    this.sheetsService = new SheetsService(auth);
  }

  async getMenuSections(spreadsheetId: string): Promise<MenuSection[]> {
    const data = await this.sheetsService.readSpreadsheet(spreadsheetId, MENU_SHEET_RANGE);
    return this.parseMenuSections(data.values);
  }

  async getMenuItems(spreadsheetId: string): Promise<MenuItem[]> {
    const sections = await this.getMenuSections(spreadsheetId);
    return sections.flatMap((section) => section.items);
  }

  parseMenuSections(rows: string[][]): MenuSection[] {
    const sections: MenuSection[] = [];
    let currentSection: MenuSection | null = null;

    for (const row of rows) {
      if (this.isEmptyRow(row)) continue;

      if (this.isSectionTitleRow(row)) {
        if (currentSection && currentSection.items.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { name: row[COL_TITLE].trim(), items: [] };
        continue;
      }

      if (this.isHeaderRow(row)) continue;

      if (this.isDataRow(row)) {
        if (!currentSection) {
          currentSection = { name: "", items: [] };
        }
        currentSection.items.push(this.mapRowToMenuItem(row));
      }
    }

    if (currentSection && currentSection.items.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  }

  // Kept for backward compatibility with existing tests
  parseMenuItems(rows: string[][]): MenuItem[] {
    return rows
      .slice(1)
      .filter((row) => row[COL_TITLE]?.trim() !== "" && row[COL_TITLE] !== undefined)
      .map((row) => this.mapRowToMenuItem(row));
  }

  private mapRowToMenuItem(row: string[]): MenuItem {
    return {
      title: row[COL_TITLE]?.trim() ?? "",
      description: row[COL_DESCRIPTION]?.trim() ?? "",
      price1Description: row[COL_PRICE1_DESC]?.trim() ?? "",
      price1: row[COL_PRICE1]?.trim() ?? "",
      price2Description: row[COL_PRICE2_DESC]?.trim() || undefined,
      price2: row[COL_PRICE2]?.trim() || undefined,
      imageUrl: row[COL_IMAGE_URL]?.trim() ?? "",
      ingredients: row[COL_INGREDIENTS]?.trim() || undefined,
    };
  }

  private isSectionTitleRow(row: string[]): boolean {
    if (!row[COL_TITLE]?.trim()) return false;
    return row.length === 1 || row.slice(1).every((cell) => !cell?.trim());
  }

  private isHeaderRow(row: string[]): boolean {
    return row[COL_TITLE]?.trim().toLowerCase() === HEADER_ROW_MARKER;
  }

  private isEmptyRow(row: string[]): boolean {
    return row.length === 0 || row.every((cell) => !cell?.trim());
  }

  private isDataRow(row: string[]): boolean {
    return (
      !this.isEmptyRow(row) &&
      !this.isSectionTitleRow(row) &&
      !this.isHeaderRow(row) &&
      row.length >= MIN_DATA_ROW_COLUMNS
    );
  }
}
