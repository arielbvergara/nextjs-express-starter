/**
 * One-time script to seed the "Menu" Google Sheet with sample menu items.
 * Run with: pnpm --filter server tsx src/scripts/seed-menu.ts
 */
import { config } from "../config";
import { googleAuth } from "../config/google";
import { SheetsService } from "../services/sheets";

const MENU_ITEMS: string[][] = [
  ["Caesar Salad", "Crispy romaine lettuce, parmesan, croutons, and Caesar dressing", "Regular", "9.50", "", "", ""],
  ["Margherita Pizza", "Classic tomato base, fresh mozzarella, and basil", "Personal (8\")", "12.00", "Large (14\")", "20.00", ""],
  ["Beef Burger", "Angus beef patty with lettuce, tomato, onion, and house sauce", "Single", "11.00", "Double", "14.50", ""],
  ["Grilled Salmon", "Atlantic salmon fillet with seasonal vegetables and lemon butter", "Portion", "22.00", "", "", ""],
  ["Chocolate Lava Cake", "Warm chocolate cake with a molten center, served with vanilla ice cream", "Individual", "7.50", "", "", ""],
];

async function seedMenu(): Promise<void> {
  const sheetsId = config.google.sheetsId;

  if (!sheetsId) {
    console.error("GOOGLE_SHEETS_ID is not configured");
    process.exit(1);
  }

  const sheetsService = new SheetsService(googleAuth);

  console.log(`Seeding ${MENU_ITEMS.length} menu items into sheet: ${sheetsId}`);

  for (const row of MENU_ITEMS) {
    await sheetsService.appendRow(sheetsId, row);
    console.log(`  ✓ Added: ${row[0]}`);
  }

  console.log("Done.");
}

seedMenu().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
