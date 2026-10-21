const { expect } = require('@playwright/test');

class EventHubPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://eventhub.rahulshettyacademy.com';
        
        // --- Selektory pre Prihlásenie ---
        this.emailInput = page.getByPlaceholder('you@email.com');
        this.passwordInput = page.getByPlaceholder('••••••');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.mainContent = page.getByRole('main');

        // --- Selektory pre Rezerváciu ---
        this.firstEventCard = page.locator('[data-testid="event-card"]').first();
        this.bookNowButton = this.firstEventCard.locator('[data-testid="book-now-btn"]');
        this.incrementTicketsButton = page.locator('button:has-text("+")');
        this.fullNameInput = page.getByLabel('Full Name');
        this.emailFormInput = page.getByLabel('Email');
        this.phoneInput = page.getByPlaceholder('+91 98765 43210');
        this.confirmBookingButton = page.locator('.confirm-booking-btn');

        // --- Selektory pre Moje rezervácie a Detail ---
        this.viewMyBookingsLink = page.getByRole('link', { name: 'View My Bookings' });
        this.viewDetailsFirstLink = page.getByRole('link', { name: 'View Details' }).first();
        this.bookingInfoText = page.getByText('Booking Information');
        this.bookingRefElement = page.getByText('-').nth(1);
        this.eventTitleHeader = page.locator('h1');

        // --- Selektory pre Verifikáciu a Spinner ---
        this.checkRefundButton = page.getByTestId('check-refund-btn');
        this.refundSpinner = page.locator('#refund-spinner');
        this.refundResult = page.locator('#refund-result');
    }

    // --- Akcia: Prihlásenie ---
    async login(email, password) {
        await this.page.goto(this.baseUrl);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await expect(this.mainContent).toContainText('Browse Events →');
    }

    // --- Akcia: Výber prvej udalosti a nastavenie počtu lístkov ---
    async bookFirstEvent(name, email, phone, ticketCount = 1) {
        await this.page.goto(`${this.baseUrl}/events`);
        await this.bookNowButton.click();

        // Ak chceme viac lístkov, naklikáme ich (predvolene je 1, preto ideme od i = 1)
        for (let i = 1; i < ticketCount; i++) {
            await this.incrementTicketsButton.click();
        }

        await this.fullNameInput.fill(name);
        await this.emailFormInput.fill(email);
        await this.phoneInput.fill(phone);
        await this.confirmBookingButton.click();
    }

    // --- Akcia: Prechod na detail najnovšej objednávky ---
    async navigateToLatestBookingDetail() {
        await this.viewMyBookingsLink.click();
        await expect(this.page).toHaveURL(/.*\/bookings/);
        await this.viewDetailsFirstLink.click();
        await expect(this.bookingInfoText).toBeVisible();
    }

    // --- Akcia: Validácia prvého písmena kódu a názvu ---
    async validateBookingRefMatchesTitle() {
        const rawRef = await this.bookingRefElement.textContent();
        const rawTitle = await this.eventTitleHeader.textContent();
        
        const firstCharRef = rawRef.trim().charAt(0);
        const firstCharTitle = rawTitle.trim().charAt(0);

        console.log(`[POM] Porovnávam kód (${firstCharRef}) s názvom (${firstCharTitle})`);
        expect(firstCharRef).toBe(firstCharTitle);
    }

    // --- Akcia: Kontrola načítavacieho kolieska ---
    async checkRefundSpinner() {
        await this.checkRefundButton.click();
        await expect(this.refundSpinner).toBeVisible();
        await expect(this.refundSpinner).toBeHidden({ timeout: 6000 });
    }

    // --- Akcia: Overenie finálneho textu ---
    async verifyRefundResultTexts(expectedTexts) {
        await expect(this.refundResult).toBeVisible();
        for (const text of expectedTexts) {
            await expect(this.refundResult).toContainText(text);
        }
    }
}

module.exports = { EventHubPage };
