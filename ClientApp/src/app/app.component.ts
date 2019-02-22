import { Component, HostBinding } from '@angular/core';

/**
 * Root component for application.
 */
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	@HostBinding('class')
	private class = 'd-flex h-100';
}
