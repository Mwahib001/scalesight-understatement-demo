import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  ["/", "Weekly Size Curve Brief"],
  ["/alpha-composition", "What is actually inside M?"],
  ["/size-curve", "One size curve. Three different signals."],
  ["/fit-movement", "Where is size demand moving?"],
  ["/sku-planning", "SKU & Size Planning"],
  ["/size-depth", "How deep should the next size curve be?"],
  ["/plus-opportunity", "Is broad alpha demand hiding a support opportunity?"],
  ["/scenario", "Test the size decision before committing the buy."],
  ["/forecast-learning", "Every launch teaches the next size curve."],
  ["/managed-intelligence", "A planning layer behind the size curve."],
  [
    "/assumptions",
    "What is real, what is assumed, and what a live workspace would use.",
  ],
] as const;

async function checkRoute(page: Page, route: string, heading: string) {
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  await expect(page.locator(".data-badge")).toBeVisible();
  await expect(page.locator(".refresh")).toHaveText(
    "Refreshed 30 Sep · 06:00 CEST",
  );
  await expect(page.locator(".page-footer")).toContainText(
    "Managed by ScaleSight.",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

for (const [route, heading] of routes) {
  test(`required content, accessibility and no runtime errors: ${route}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await checkRoute(page, route, heading);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const [width, height] of [
  [1280, 720],
  [768, 1024],
  [390, 844],
]) {
  test(`all routes remain readable at ${width}px`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height });
    for (const [route, heading] of routes)
      await checkRoute(page, route, heading);
    if (width <= 850) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(
        page.getByRole("dialog", { name: "Workspace navigation" }),
      ).toBeVisible();
      await page
        .getByRole("link", { name: "Alpha Composition", exact: true })
        .click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "What is actually inside M?",
      );
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toBeFocused();
    }
  });
}

test("brief has exactly four specified priorities and seven changes", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".priority-card")).toHaveCount(4);
  await expect(page.locator(".change-list li")).toHaveCount(7);
  await expect(page.locator(".metric>strong")).toHaveText([
    "85",
    "7",
    "2",
    "18",
    "Moderate",
  ]);
});

test("SKU table has all rows, urgency order, eight working filters and a complete Cherry L drawer", async ({
  page,
}) => {
  await page.goto("/sku-planning");
  const rows = page.locator(".variant-table tbody tr");
  await expect(rows).toHaveCount(20);
  const decisions = await rows.locator("td:nth-child(13)").allTextContents();
  expect(decisions.slice(0, 6)).toEqual(Array(6).fill("BUY DEEPER"));
  expect(decisions.slice(6, 17)).toEqual(Array(11).fill("REPLENISH"));
  expect(decisions[17]).toBe("INVESTIGATE");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".pagination")).toContainText("Page 2 of 5");
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  const filterCases = [
    ["Product", "PL-BRA", "19 of 85"],
    ["Colour", "Cherry", "14 of 85"],
    ["Product Type", "Bottom", "28 of 85"],
    ["Size System", "ALPHA", "28 of 85"],
    ["Size", "M", "4 of 85"],
    ["Decision", "BUY_DEEPER", "6 of 85"],
    ["Matching Set", "Candy Pink", "14 of 85"],
    ["Risk", "set", "4 of 85"],
  ];
  for (const [label, value, result] of filterCases) {
    await page.getByLabel(label, { exact: true }).selectOption(value);
    await expect(page.locator(".table-toolbar")).toContainText(result);
    await page.getByRole("button", { name: "Reset filters" }).click();
  }
  await page
    .getByLabel("Decision", { exact: true })
    .selectOption("INVESTIGATE");
  const trigger = page.getByRole("button", {
    name: "Review Opaque Mesh Balconette, Cherry, L",
  });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Opaque Mesh Balconette" });
  await expect(drawer).toBeVisible();
  await expect(drawer.locator(".data-badge")).toBeVisible();
  for (const section of [
    "Current Position",
    "Launch Signal",
    "Size-Curve Context",
    "Matching Set",
    "ScaleSight Analysis",
    "Recommended Decision",
    "Assumptions",
  ]) {
    await expect(
      drawer.getByRole("heading", { name: section, exact: true }),
    ).toBeVisible();
  }
  await expect(drawer).toContainText("25");
  await expect(drawer).toContainText("86 vs plan");
  await expect(drawer).toContainText(
    "Hold additional L commitment for one review cycle.",
  );
  await expect(drawer).toContainText(
    "DATA → BUSINESS CONTEXT → PLANNING JUDGMENT",
  );
  await expect(drawer).toContainText("BUY DEEPER");
  await expect(drawer).toContainText("INVESTIGATE");
  await drawer.getByText("Public variant metadata", { exact: true }).click();
  await expect(drawer).toContainText("U-257-002-L");
  await expect(drawer).toContainText("7333468033635");
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.click();
  await drawer
    .getByRole("heading", { name: "Recommended Decision", exact: true })
    .scrollIntoViewIfNeeded();
  await expect(drawer.locator(".data-badge")).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("chart tables expose all canonical curves and the sole directional movement", async ({
  page,
}) => {
  await page.goto("/size-curve");
  await page.getByText("View chart data", { exact: true }).click();
  const table = page.locator(".chart-data table");
  await expect(table.locator("tbody tr")).toHaveCount(7);
  await expect(
    table
      .locator("tbody tr")
      .filter({ has: page.getByRole("rowheader", { name: "M", exact: true }) }),
  ).toHaveText("M24%31%33%");
  await page.goto("/alpha-composition");
  await expect(
    page
      .getByText("ILLUSTRATIVE PLANNING COMPOSITION", { exact: false })
      .first(),
  ).toBeVisible();
  await page.getByText("View composition data", { exact: true }).click();
  await expect(page.locator(".chart-data tbody tr")).toHaveCount(4);
  await page.goto("/fit-movement");
  await expect(page.locator(".fit-flow")).toContainText("4 move L → M · 67%");
  await expect(page.locator(".fit-flow")).toContainText(
    "6 Cherry L exchange-outs",
  );
  await expect(
    page.getByRole("heading", {
      name: "The apparent winner changes once fit movement is included.",
    }),
  ).toBeVisible();
  await page.goto("/size-depth");
  await expect(
    page.getByText(
      "This does not mean every future Understatement style should use this curve.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.goto("/plus-opportunity");
  await expect(
    page.getByText("ILLUSTRATIVE PLANNING HYPOTHESIS", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".interpretation")).toContainText(
    "The current collaboration does not prove M+ or L+ demand.",
  );
});

test("all five scenario presets are exact, unsupported edits are flagged, and reset restores all state across routes", async ({
  page,
}) => {
  await page.goto("/scenario");
  await page.getByText("View chart data", { exact: true }).click();
  const curves = [
    ["Base", [75, 175, 330, 220, 105, 60, 35]],
    ["M Acceleration", [70, 170, 360, 210, 100, 55, 35]],
    ["Fit Friction", [75, 175, 350, 190, 110, 60, 40]],
    ["Fuller-Cup Shift", [75, 175, 280, 80, 160, 30, 105, 60, 35]],
    ["Supplier Delay", [75, 175, 330, 220, 105, 60, 35]],
  ] as const;
  for (const [name, expected] of curves) {
    await page.getByRole("button", { name, exact: true }).click();
    const actual = await page
      .locator(".chart-data tbody tr td:last-child")
      .allTextContents();
    expect(actual.map(Number)).toEqual(expected);
    const panels = page.locator(".scenario-layout .panel");
    for (let i = 0; i < (await panels.count()); i++)
      await expect(panels.nth(i)).toContainText(
        "Illustrative assumption-based scenario.",
      );
  }
  await expect(page.locator(".scenario-results .metric>strong")).toHaveText([
    "26",
    "4",
    "Moderate",
  ]);
  await page
    .getByRole("slider", { name: "Overall Demand Uplift", exact: true })
    .focus();
  for (let i = 0; i < 20; i++) await page.keyboard.press("ArrowRight");
  await expect(page.locator(".unsupported-notice")).toBeVisible();
  await expect(page.locator(".scenario-results .metric>strong")).toHaveText([
    "Not supplied",
    "Not supplied",
    "Moderate",
  ]);
  await page.getByRole("slider", { name: "Buy Units", exact: true }).focus();
  for (let i = 0; i < 50; i++) await page.keyboard.press("ArrowRight");
  await page.getByLabel("Launch Extension").selectOption("on");
  await page.getByRole("button", { name: "13 weeks", exact: true }).click();
  await page.getByRole("link", { name: "Size Curve", exact: true }).click();
  await expect(page.locator(".scenario-banner")).toContainText(
    "Supplier Delay",
  );
  await page
    .getByRole("link", { name: "Scenario Planning", exact: true })
    .click();
  await expect(page.getByLabel("Buy Units")).toHaveValue("1500");
  await page.locator(".reset-button").click();
  await expect(page.locator(".scenario-banner")).toHaveCount(0);
  await expect(page.locator(".unsupported-notice")).toHaveCount(0);
  const defaults = {
    overallDemandUpliftPct: "0",
    mDemandAdjustmentPct: "0",
    lDemandAdjustmentPct: "0",
    returnRateAdjustmentPP: "0",
    exchangeRateAdjustmentPP: "0",
    leadTimeAdjustmentWeeks: "0",
    plannedBuyUnits: "1000",
    plusMigrationPct: "0",
    setAttachRatePct: "62",
  };
  for (const [id, value] of Object.entries(defaults))
    await expect(page.locator(`#${id}`)).toHaveValue(value);
  await expect(page.getByLabel("Launch Extension")).toHaveValue("off");
  await expect(
    page.getByRole("button", { name: "8 weeks", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".scenario-results .metric>strong")).toHaveText([
    "18",
    "2",
    "Moderate",
  ]);
  await expect(page.locator(".chart-data tbody tr td:last-child")).toHaveText([
    "75",
    "175",
    "330",
    "220",
    "105",
    "60",
    "35",
  ]);
});

test("managed service and disclosure retain decision ownership and exact closing copy", async ({
  page,
}) => {
  await page.goto("/managed-intelligence");
  await expect(page.locator(".workflow-list li")).toHaveCount(10);
  await expect(page.locator(".specialist-step")).toContainText(
    "SCALESIGHT SPECIALIST REVIEW",
  );
  await expect(page.locator(".service-callout")).toContainText(
    "ANALYSIS MAINTAINED BY SCALESIGHT.",
  );
  await expect(page.locator(".service-callout")).toContainText(
    "DECISIONS MADE WITH UNDERSTATEMENT.",
  );
  await expect(
    page.getByRole("heading", { name: "What Understatement decides" }),
  ).toBeVisible();
  await page.goto("/assumptions");
  await expect(page.locator(".classification-grid>.panel")).toHaveCount(4);
  await expect(page.locator(".module-card")).toHaveCount(8);
  await expect(page.locator(".closing-statement")).toHaveText(
    "ScaleSight should adapt to the planning problem. Understatement should not have to adapt its business to a fixed software workflow.",
  );
});
