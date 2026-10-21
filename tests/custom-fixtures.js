import { test as base, expect } from '@playwright/test';

// ── SPRÁVNE ADRESY PRESNE PODĽA ZADANIA ──────────────────────────────────────
const BASE_URL   = 'https://eventhub.rahulshettyacademy.com';
const API_URL    = 'https://api.eventhub.rahulshettyacademy.com/api'; // Pridané api. na začiatok

const USER_EMAIL    = 'mcirik19@gmail.com';
const USER_PASSWORD = 'Karol050290*';

export const test = base.extend({
  // Task 1 — authenticatedPage fixture (Prihlásenie cez UI)
  authenticatedPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill(USER_EMAIL);
    await page.getByLabel('Password').fill(USER_PASSWORD);
    await page.locator('#login-btn').click();
    
    // Počkáme na úspešné prihlásenie
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
    
    // Namiesto čistého page.goto pridáme čakanie na sieť priamo sem:
    await page.goto(`${BASE_URL}/events`, { waitUntil: 'networkidle' });

    
    // Odovzdanie pripravenej stránky testu
    await use(page);
  },

    // Task 2 — createEvent fixture (Vytvorenie eventu cez API)
  createEvent: async ({ request }, use) => {
    // 1. Prihlásenie cez API pre získanie tokenu
    const loginRes = await request.post(`${API_URL}/auth/login`, {
      data: { email: USER_EMAIL, password: USER_PASSWORD },
    });
    
    expect(loginRes.ok()).toBeTruthy();
    const { token } = await loginRes.json();

    // 2. Vygenerovanie SKUTOČNE unikátneho názvu pomocou aktuálneho timestampu
    const currentTimestamp = Date.now();
    const uniqueEventName = `Moj Specialny Festival ${currentTimestamp}`;

    // 3. Vytvorenie eventu cez API s platnými dátami pre rok 2026/2027
    const eventRes = await request.post(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: uniqueEventName,
        category: 'Concert',                           // Môžeš skúsiť aj 'Conference', 'Sports', 'Workshop'
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Posunie dátum o 7 dní dopredu (na budúci týždeň)
        venue: 'Incheba Expo',                         // Zmena miesta konania
        city: 'Bratislava',                            // Zmena mesta
        price: '79',                                   // Nová cena v dolároch
        totalSeats: 500,                               // Celkový počet miest
        availableSeats: 250,                           // Voľné miesta
        imageUrl: null,
        isStatic: false
      },
    });
    
    expect(eventRes.ok()).toBeTruthy();
    const eventData = await eventRes.json();

    // 4. Odovzdanie dát o vytvorenom evente testu
    await use(eventData.data);
  },

});

export { expect };
