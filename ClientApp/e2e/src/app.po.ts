import { browser, by, element } from 'protractor';

/**
 * Protractor Model for the root page of the application.
 */
export class AppPage {
	/**
	 * Navigates to the page.
	 */
	navigateTo() {
		return browser.get('/');
	}

	/**
	 * Gets the `app-root` element.
	 */
	getElement() {
		return element(by.css('app-root'));
	}
}
