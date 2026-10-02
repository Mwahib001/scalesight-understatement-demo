import { test, expect } from "@playwright/test";

test("booking, contact and pilot links open the configured Calendly popup", async ({
  page,
}) => {
  await page.route(
    "https://assets.calendly.com/assets/external/widget.js",
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `
      window.Calendly = { initPopupWidget({ url }) {
        const popup = document.createElement('div');
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-label', 'Calendly test popup');
        popup.textContent = url;
        document.body.appendChild(popup);
      } };
    `,
      }),
  );
  await page.goto("/managed-intelligence");
  for (const name of [
    "Book a call",
    "Contact",
    "Discuss an Understatement Planning Pilot",
  ]) {
    const link = page.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute(
      "href",
      /^https:\/\/calendly\.com\/\S+$/,
    );
    const url = await link.getAttribute("href");
    await link.click();
    await expect(page.getByRole("dialog")).toHaveText(url!);
    await page.getByRole("dialog").evaluate((element) => element.remove());
    await expect(page).toHaveURL(/\/managed-intelligence$/);
  }
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
});

test("booking keeps a direct scheduling link if the widget cannot load", async ({
  page,
}) => {
  await page.route(
    "https://assets.calendly.com/assets/external/widget.js",
    (route) => route.abort(),
  );
  await page.goto("/");
  const link = page.getByRole("link", { name: "Book a call", exact: true });
  await expect(link).toHaveAttribute("href", /^https:\/\/calendly\.com\/\S+$/);
  await expect(link).toHaveAttribute("target", "_blank");
});
