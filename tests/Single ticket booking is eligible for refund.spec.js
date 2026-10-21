const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// === SETUP PODĽA ZADANIA ===
// Vytvorenie znovupoužiteľnej pomocnej funkcie
async function loginAndGoToBooking(page) {
    // Navigácia na adresu aplikácie
    await page.goto(BASE_URL);

    // Vyplnenie prihlasovacích údajov
    await page.getByPlaceholder('you@email.com').fill('mcirik19@gmail.com');
    await page.getByPlaceholder('••••••').fill('Karol050290*');
    
    // Kliknutie na prihlásenie
    await page.getByRole('button', { name: 'Sign In' }).click(); 

    // Potvrdenie, že odkaz "Browse Events →" je viditeľný
    const browseEventsLink = page.getByRole('main');
    await expect(browseEventsLink).toContainText('Browse Events →');
}

// === TEST 1 — Single ticket booking is eligible for refund ===
test('Test 1 — Single ticket booking is eligible for refund', async ({ page }) => {
    
    // Step 1 — Call your login helper (Zavolanie prihlasovacej funkcie)
    await loginAndGoToBooking(page);

    // Tu budeme pokračovať na Step 2 (výber 1 lístka a kontrola spinnera)
    console.log('Krok 1 úspešne dokončený podla zadania.');

    // === STEP 2 — Book first event with 1 ticket (default) ===
    
    // 1. Prechod na /events
    await page.goto(`${BASE_URL}/events`);

    // 2. Kliknutie na "Book Now" na úplne prvej karte udalosti (podľa zadania)
    const firstEventCard = page.locator('[data-testid="event-card"]').first();
    await firstEventCard.locator('[data-testid="book-now-btn"]').click();

    // 3. Vyplnenie formulára: Meno, Email, Telefón (použijeme placeholdery/label podľa štandardu)
    await page.getByLabel('Full Name').fill('Martin Čirik');
    await page.getByLabel('Email').fill('mcirik19@gmail.com');
    await page.getByPlaceholder('+91 98765 43210').fill('+421910982039'); // placeholder sme videli vo vašom Practise súbore

    // 4. Kliknutie na potvrdzujúce tlačidlo (.confirm-booking-btn)
    await page.locator('.confirm-booking-btn').click();

    console.log('Krok 2 úspešne dokončený. Rezervácia bola odoslaná.');
    
    // === STEP 3 — Navigate to booking detail ===
    
    // 1. Kliknutie na odkaz "View My Bookings"
    await page.getByRole('link', { name: 'View My Bookings' }).click();

    // 2. Overenie (Assert), že URL adresa obsahuje /bookings
    await expect(page).toHaveURL(/.*\/bookings/);

    // 3. Kliknutie na úplne prvý odkaz "View Details"
    await page.getByRole('link', { name: 'View Details' }).first().click();

    // 4. Overenie (Assert), že text "Booking Information" je viditeľný na stránke
    const bookingInfoText = page.getByText('Booking Information');
    await expect(bookingInfoText).toBeVisible();

    console.log('Krok 3 úspešne dokončený.');

    // === STEP 4 — Validate booking ref ===
    
    // 1. Využijeme lokalizáciu, ktorú ti našiel terčík. 
    // Hľadáme text, ktorý sa skladá z veľkých písmen, čísel a pomlčky (napr. D-TR0GA0) a vezmeme druhý výskyt (.nth(1))
    const cleanedBookingRef = await page.getByText('-').nth(1).textContent();
    const finalBookingRef = cleanedBookingRef.trim();

    // 2. Prečítame názov udalosti z hlavného nadpisu h1
    const eventTitleText = await page.locator('h1').textContent();
    const cleanedEventTitle = eventTitleText.trim();

    // 3. Získame prvé znaky oboch textov
    const firstCharBookingRef = finalBookingRef.charAt(0);
    const firstCharEventTitle = cleanedEventTitle.charAt(0);

    console.log(`Porovnávam: Kód [${finalBookingRef}] (písmeno ${firstCharBookingRef}) s názvom [${cleanedEventTitle}] (písmeno ${firstCharEventTitle})`);

    // 4. Assert: Overenie, že prvé znaky sa rovnajú (D == D)
    expect(firstCharBookingRef).toBe(firstCharEventTitle);

    console.log('Krok 4 úspešne dokončený. Prvé znaky sa zhodujú!');

    // === STEP 5 — Check refund eligibility ===

    // 1. Kliknutie na tlačidlo podľa jeho data-testid (zistené terčíkom)
    await page.getByTestId('check-refund-btn').click();


    // 2. Assert: Overenie, že spinner element (#refund-spinner) je OKAMŽITE viditeľný
    // Použijeme .toBeVisible(), no bez predĺženého čakania, aby sme overili okamžitý stav
    const spinner = page.locator('#refund-spinner');
    await expect(spinner).toBeVisible();

    // 3. Assert: Overenie, že spinner zmizne (is no longer visible) do 6 sekúnd
    // V Playwrighte použijeme .toBeHidden() a do nastavenia pridáme timeout 6000 milisekúnd (6 sekúnd)
    await expect(spinner).toBeHidden({ timeout: 6000 });

    console.log('Krok 5 úspešne dokončený. Spinner sa zobrazil a do 6 sekúnd zmizol!');

    // === STEP 6 — Validate result ===

    // 1. Nájdeme element s výsledkom pomocou ID #refund-result
    const resultElement = page.locator('#refund-result');

    // 2. Assert: Overenie, že element je viditeľný
    await expect(resultElement).toBeVisible();

    // 3. Assert: Overenie, že obsahuje text "Eligible for refund"
    await expect(resultElement).toContainText('Eligible for refund');

    // 4. Assert: Overenie, že obsahuje text "Single-ticket bookings qualify for a full refund"
    await expect(resultElement).toContainText('Single-ticket bookings qualify for a full refund');

    console.log('Krok 6 úspešne dokončený. Všetky texty výsledku sedia!');

    // Dočasný timeout pre debug režim
    await page.waitForTimeout(3000);

});
