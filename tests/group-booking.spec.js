const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// === SETUP: Znovupoužiteľná prihlasovacia funkcia ===
async function loginAndGoToBooking(page) {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('you@email.com').fill('mcirik19@gmail.com');
    await page.getByPlaceholder('••••••').fill('Karol050290*');
    await page.getByRole('button', { name: 'Sign In' }).click(); 

    const browseEventsLink = page.getByRole('main');
    await expect(browseEventsLink).toContainText('Browse Events →');
}

// === SAMOTNÝ TEST 2 ===
test('Test 2 — Group ticket booking is NOT eligible for refund', async ({ page }) => {
    
    // Krok 1 — Prihlásenie
    await loginAndGoToBooking(page);
    console.log('Krok 1 úspešne dokončený.');

    // Krok 2 — Prechod na udalosti a výber prvej karty
    await page.goto(`${BASE_URL}/events`);
    const firstEventCard = page.locator('[data-testid="event-card"]').first();
    await firstEventCard.locator('[data-testid="book-now-btn"]').click();

    // Zvýšenie počtu lístkov na 3 (podľa inštrukcií z click + button twice)
    const incrementButton = page.locator('button:has-text("+")');
    await incrementButton.click(); // 1. klik (máme 2 lístky)
    await incrementButton.click(); // 2. klik (máme 3 lístky)

    // Vyplnenie formulára
    await page.getByLabel('Full Name').fill('Martin Čirik');
    await page.getByLabel('Email').fill('mcirik19@gmail.com');
    await page.getByPlaceholder('+91 98765 43210').fill('+421910982039');

    // Odoslanie rezervácie
    await page.locator('.confirm-booking-btn').click();
    console.log('Krok 2 úspešne dokončený (3 lístky).');

    // Krok 3 — Prechod na detail najnovšej objednávky
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(/.*\/bookings/);
    await page.getByRole('link', { name: 'View Details' }).first().click();

    const bookingInfoText = page.getByText('Booking Information');
    await expect(bookingInfoText).toBeVisible();
    console.log('Krok 3 úspešne dokončený.');

    // Krok 4 — Validácia kódu rezervácie s nadpisom
    const cleanedBookingRef = await page.getByText('-').nth(1).textContent();
    const finalBookingRef = cleanedBookingRef.trim();
    const eventTitleText = await page.locator('h1').textContent();
    const cleanedEventTitle = eventTitleText.trim();

    const firstCharBookingRef = finalBookingRef.charAt(0);
    const firstCharEventTitle = cleanedEventTitle.charAt(0);
    expect(firstCharBookingRef).toBe(firstCharEventTitle);
    console.log('Krok 4 úspešne dokončený.');

    // Krok 5 — Kontrola okamžitej viditeľnosti a zmiznutia spinnera
    await page.getByTestId('check-refund-btn').click();
    const spinner = page.locator('#refund-spinner');
    await expect(spinner).toBeVisible();
    await expect(spinner).toBeHidden({ timeout: 6000 });
    console.log('Krok 5 úspešne dokončený.');

    // Krok 6 — Validácia negatívneho výsledku (skupina nemá nárok)
    const resultElement = page.locator('#refund-result');
    await expect(resultElement).toBeVisible();
    await expect(resultElement).toContainText('Not eligible for refund');
    await expect(resultElement).toContainText('Group bookings (3 tickets) are non-refundable');
    
    console.log('Krok 6 úspešne dokončený! Test 2 úspešne prešiel.');
    
    // Dočasná pauza pre debug mód
    await page.waitForTimeout(3000);
});
