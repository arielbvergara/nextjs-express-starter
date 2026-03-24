import { describe, it, expect } from "vitest";
import { MenuService } from "./menu";
import { GoogleAuth } from "google-auth-library";

// MenuService is instantiated with a GoogleAuth, but parseMenuItems is pure —
// no Google API calls are made in these tests.
const service = new MenuService({} as GoogleAuth);

const HEADER_ROW = ["Title", "description", "Price_1_description", "Price_1", "Price_2_description", "Price_2", "ImageUrl", "Ingredients"];

describe("MenuService.parseMenuItems", () => {
  it("parseMenuItems_ShouldReturnEmptyArray_WhenOnlyHeaderRowProvided", () => {
    const result = service.parseMenuItems([HEADER_ROW]);
    expect(result).toEqual([]);
  });

  it("parseMenuItems_ShouldMapAllFields_WhenRowIsComplete", () => {
    const rows = [
      HEADER_ROW,
      ["Burger", "Juicy beef burger", "Single", "8.99", "Double", "14.99", "https://example.com/burger.jpg", "Beef patty, bun, lettuce, tomato"],
    ];
    const result = service.parseMenuItems(rows);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      title: "Burger",
      description: "Juicy beef burger",
      price1Description: "Single",
      price1: "8.99",
      price2Description: "Double",
      price2: "14.99",
      imageUrl: "https://example.com/burger.jpg",
      ingredients: "Beef patty, bun, lettuce, tomato",
    });
  });

  it("parseMenuItems_ShouldOmitOptionalPriceFields_WhenPrice2ColumnsAreEmpty", () => {
    const rows = [
      HEADER_ROW,
      ["Pizza", "Margherita pizza", "Slice", "3.50", "", "", "https://example.com/pizza.jpg"],
    ];
    const result = service.parseMenuItems(rows);
    expect(result[0].price2Description).toBeUndefined();
    expect(result[0].price2).toBeUndefined();
  });

  it("parseMenuItems_ShouldSkipBlankRows_WhenTitleIsEmpty", () => {
    const rows = [
      HEADER_ROW,
      ["", "no title row", "Price", "5.00", "", "", ""],
      ["Salad", "Fresh salad", "Small", "4.00", "", "", "https://example.com/salad.jpg"],
    ];
    const result = service.parseMenuItems(rows);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Salad");
  });

  it("parseMenuItems_ShouldTrimWhitespace_WhenCellsHaveLeadingOrTrailingSpaces", () => {
    const rows = [
      HEADER_ROW,
      ["  Burger  ", "  Juicy  ", "  Single  ", "  8.99  ", "", "", "  https://example.com/burger.jpg  "],
    ];
    const result = service.parseMenuItems(rows);
    expect(result[0].title).toBe("Burger");
    expect(result[0].description).toBe("Juicy");
    expect(result[0].price1Description).toBe("Single");
    expect(result[0].price1).toBe("8.99");
    expect(result[0].imageUrl).toBe("https://example.com/burger.jpg");
  });

  it("parseMenuItems_ShouldHandleMissingOptionalColumns_WhenRowHasFewerThan7Cells", () => {
    const rows = [
      HEADER_ROW,
      ["Soup", "Hot soup", "Bowl", "5.00"],
    ];
    const result = service.parseMenuItems(rows);
    expect(result[0].price2Description).toBeUndefined();
    expect(result[0].price2).toBeUndefined();
    expect(result[0].imageUrl).toBe("");
  });

  it("parseMenuItems_ShouldReturnMultipleItems_WhenMultipleDataRowsProvided", () => {
    const rows = [
      HEADER_ROW,
      ["Burger", "Beef burger", "Single", "8.99", "", "", "https://example.com/burger.jpg"],
      ["Pizza", "Margherita", "Slice", "3.50", "Whole", "18.00", "https://example.com/pizza.jpg"],
      ["Salad", "Fresh salad", "Small", "4.00", "Large", "7.00", "https://example.com/salad.jpg"],
    ];
    const result = service.parseMenuItems(rows);
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("Burger");
    expect(result[1].title).toBe("Pizza");
    expect(result[2].title).toBe("Salad");
  });

  it("parseMenuItems_ShouldIncludeIngredients_WhenRow7IsPresent", () => {
    const rows = [
      HEADER_ROW,
      ["Burger", "Beef burger", "Single", "8.99", "", "", "https://example.com/burger.jpg", "  Beef, bun, lettuce  "],
    ];
    const result = service.parseMenuItems(rows);
    expect(result[0].ingredients).toBe("Beef, bun, lettuce");
  });

  it("parseMenuItems_ShouldSetIngredientsToUndefined_WhenRow7IsEmpty", () => {
    const rows = [
      HEADER_ROW,
      ["Burger", "Beef burger", "Single", "8.99", "", "", "https://example.com/burger.jpg", ""],
    ];
    const result = service.parseMenuItems(rows);
    expect(result[0].ingredients).toBeUndefined();
  });

  it("parseMenuItems_ShouldSetIngredientsToUndefined_WhenRowHasFewerThan8Cells", () => {
    const rows = [
      HEADER_ROW,
      ["Burger", "Beef burger", "Single", "8.99", "", "", "https://example.com/burger.jpg"],
    ];
    const result = service.parseMenuItems(rows);
    expect(result[0].ingredients).toBeUndefined();
  });
});
