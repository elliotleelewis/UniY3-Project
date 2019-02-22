import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { LoadingService } from '../../services/loading.service';

/**
 * Component for layout of application.
 */
@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
	@HostBinding('class')
	private class = 'd-flex position-relative w-100 flex-column';

	/**
	 * Current user.
	 */
	user: User = null;
	/**
	 * Current loading state.
	 */
	loading = false;
	/**
	 * Redirect parameter for the login link.
	 */
	redirect: string = null;
	/**
	 * Current navbar state.
	 */
	navbar = false;

	constructor(
		private _account: AccountService,
		private _loading: LoadingService,
		private _router: Router,
	) {}

	ngOnInit(): void {
		this._account.user.subscribe((user) => (this.user = user));
		this._loading.loading.subscribe((state) => (this.loading = state));
		this._router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				const blacklistUrls = ['/', '/login', '/register'];
				// TODO - Remove query parameters and anchors from URL before check...
				this.redirect = blacklistUrls.includes(event.urlAfterRedirects)
					? null
					: event.urlAfterRedirects;
			});
	}

	/**
	 * Toggles the navbar.
	 */
	toggleNavbar(): void {
		this.navbar = !this.navbar;
	}
}
