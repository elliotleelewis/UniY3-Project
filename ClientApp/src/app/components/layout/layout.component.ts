import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
	@HostBinding('class')
	class = 'd-flex position-relative w-100 flex-column';
	navbarCollapsed = true;
	isLoading = false;
	user: User = null;
	redirect: string = null;

	constructor(
		private account: AccountService,
		private loading: LoadingService,
		private _router: Router,
	) {}

	get queryParams(): { redirect?: string } {
		return {
			redirect: this.redirect,
		};
	}

	ngOnInit(): void {
		this.account.user.subscribe((user) => (this.user = user));
		this.loading.loading.subscribe((state) => (this.isLoading = state));
		this._router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				const blacklistUrls = ['/', '/login', '/register'];
				this.redirect = blacklistUrls.includes(event.urlAfterRedirects)
					? null
					: event.urlAfterRedirects;
			});
	}

	toggleNavbar(): void {
		this.navbarCollapsed = !this.navbarCollapsed;
	}
}
