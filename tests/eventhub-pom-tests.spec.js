const { test } = require('@playwright/test');
const { EventHubPage } = require('./EventHubPage');

test.describe('EventHub – Testovacia sada upravená do Page Object Modelu', () => {

    test('Test 1 — Single ticket booking is eligible for refund (POM)', async ({ page }) => {
        const eventHub = new EventHubPage(page);

        // 1. Prihlásenie
        await eventHub.login('mcirik19@gmail.com', 'Karol050290*');

        // 2. Rezervácia 1 lístka (predvolené nastavenie)
        await eventHub.bookFirstEvent('Martin Čirik', 'mcirik19@gmail.com', '+421910982039', 1);

        // 3. Prechod na detail objednávky
        await eventHub.navigateToLatestBookingDetail();

        // 4. Validácia prvých písmen
        await eventHub.validateBookingRefMatchesTitle();

        // 5. Overenie spinnera
        await eventHub.checkRefundSpinner();

        // 6. Overenie úspešných textov pre 1 lístok
        await eventHub.verifyRefundResultTexts([
            'Eligible for refund',
            'Single-ticket bookings qualify for a full refund'
        ]);
    });

    test('Test 2 — Group ticket booking is NOT eligible for refund (POM)', async ({ page }) => {
        const eventHub = new EventHubPage(page);

        // 1. Prihlásenie
        await eventHub.login('mcirik19@gmail.com', 'Karol050290*');

        // 2. Rezervácia 3 lístkov (posledný parameter hovorí, že chceme 3 lístky)
        await eventHub.bookFirstEvent('Martin Čirik', 'mcirik19@gmail.com', '+421910982039', 3);

        // 3. Prechod na detail objednávky
        await eventHub.navigateToLatestBookingDetail();

        // 4. Validácia prvých písmen
        await eventHub.validateBookingRefMatchesTitle();

        // 5. Overenie spinnera
        await eventHub.checkRefundSpinner();

        // 6. Overenie negatívnych textov pre skupinu (3 lístky)
        await eventHub.verifyRefundResultTexts([
            'Not eligible for refund',
            'Group bookings (3 tickets) are non-refundable'
        ]);
    });

});
