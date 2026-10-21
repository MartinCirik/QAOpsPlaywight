import { test, expect } from '@playwright/test';

// 1. Oficiálny mock objekt so 6 eventami (podľa zadania)
const SIX_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
    { id: 6, title: 'AI & ML Expo',    category: 'Conference',  eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};

// 2. Oficiálny mock objekt so 4 eventami (podľa zadania)
const FOUR_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};

// 3. Opravená helper funkcia presne podľa zadania (iba s jednou BASE_URL)
async function loginAndGoToEvents(page) {
  await page.goto('https://eventhub.rahulshettyacademy.com/login'); 
  await page.locator('#email').fill('mcirik19@gmail.com');
  await page.locator('#password').fill('Karol050290*');
  
  // Počkáme na sieťovú odpoveď po kliknutí na prihlásenie, aby sme mali istotu, že sme prihlásení
  await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/') && response.status() === 200),
    page.locator('button[type="submit"]').click()
  ]);

  // Až po úspešnom prihlásení prejdeme priamo na events podstránku
  await page.goto('https://eventhub.rahulshettyacademy.com/events');
}

test.describe('Sandbox Banner Visibility with API Mocking', () => {

  test('Test 1 — Banner IS visible when 6 events are returned', async ({ page }) => {
    // Step 1 – Nastavenie API mockovania pred akoukoľvek akciou
    await page.route('**/api/events**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(SIX_EVENTS_RESPONSE),
      });
    });

    // Step 2 – Prihlásenie
    await loginAndGoToEvents(page);

    // Krok navyše pre SPA aplikácie: Klikneme na záložku Events v menu, ak nás tam nehodilo automaticky
    

    // Step 3 – Overenie, že sa načítali karty z mocku
    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards.first()).toBeVisible();
    await expect(eventCards).toHaveCount(6);

    // Step 4 – Overenie, že sandbox banner je viditeľný a obsahuje správny text
    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('9 bookings');
  });

  test('Test 2 — Banner is NOT visible when 4 events are returned', async ({ page }) => {
    // Step 1 – Nastavenie API mockovania pre 4 eventy
    await page.route('**/api/events**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(FOUR_EVENTS_RESPONSE),
      });
    });

    // Step 2 – Prihlásenie
    await loginAndGoToEvents(page);

    // Klikneme na záložku Events v menu

    // Step 3 – Overenie kariet
    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards.first()).toBeVisible();
    await expect(eventCards).toHaveCount(4);

    // Step 4 – Overenie, že banner je skrytý
    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).toBeHidden();
  });

});
