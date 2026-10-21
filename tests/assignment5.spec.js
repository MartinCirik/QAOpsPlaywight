import { test, expect } from './custom-fixtures';

test('Task 3 — Novovytvorený event cez API musí byť viditeľný na UI stránke', async ({ authenticatedPage, createEvent }) => {
  await authenticatedPage.reload({ waitUntil: 'networkidle' });
  await expect(authenticatedPage.getByText(createEvent.title)).toBeVisible();
});
