import { test, expect } from '@playwright/test';

// ── Úvodné nastavenia zo zadania ──────────────────────────────────────────────
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL  = 'https://api.eventhub.rahulshettyacademy.com/api'; // API doména z dokumentácie

const USER_A_YAHOO = {
  email: 'mcirik19@yahoo.com', // Použi svoj Yahoo/hlavný testovací účet
  password: 'Messi1019*'
};

const USER_B_GMAIL = {
  email: 'mcirik19@gmail.com', // DOPLŇ: tvoj druhý registrovaný účet (Gmail)
  password: 'Karol050290*'        // DOPLŇ: heslo k druhému účtu
};

// ── Helper funkcia pre Step 4 (Prihlásenie cez UI) ───────────────────────────
async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.locator('#login-btn').click();
  
  // Počkáme, kým sa úspešne načítajú Events (potvrdenie úspešného loginu)
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

// ── Samotný testovací scenár ──────────────────────────────────────────────────
test('User B by nemal mať prístup k rezervácii Usera A (Access Denied)', async ({ request, page }) => {

  // ── Step 1 — Login as Yahoo user via API ────────────────────────────────────
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: {
      email: USER_A_YAHOO.email,
      password: USER_A_YAHOO.password
    }
  });
  
  expect(loginRes.ok()).toBeTruthy();
  const loginJson = await loginRes.json();
  const token = loginJson.token; // Extrahovanie autorizačného tokenu

  // ── Step 2 — Fetch events via API to get a valid event ID ───────────────────
  const eventsRes = await request.get(`${API_URL}/events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  expect(eventsRes.ok()).toBeTruthy();
  const eventsJson = await eventsRes.json();
  const eventId = eventsJson.data[0].id; // Uloženie ID prvej udalosti

  // ── Step 3 — Create a booking via API as Yahoo user ─────────────────────────
  const bookingRes = await request.post(`${API_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      eventId: eventId,
      customerName: 'Yahoo User',
      customerEmail: USER_A_YAHOO.email,
      customerPhone: '1234567890', // Akékoľvek 10-miestne číslo
      quantity: 1
    }
  });

  expect(bookingRes.ok()).toBeTruthy();
  const bookingJson = await bookingRes.json();
  const yahooBookingId = bookingJson.data.id; // Extrahovanie ID rezervácie
  console.log(`Moje ID rezervácie je: ${yahooBookingId}`);

  // ── Step 4 — Login as Gmail user via browser UI ─────────────────────────────
  await loginAs(page, USER_B_GMAIL);

  // ── Step 5 — Navigate to Yahoo's booking URL as Gmail user ──────────────────
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, { 
    waitUntil: 'networkidle' 
  });

  // ── Step 6 — Validate Access Denied ─────────────────────────────────────────
  // Overenie, že texty o zamietnutí prístupu sú viditeľné
  await expect(page.getByText('Access Denied')).toBeVisible();
  await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();
});
