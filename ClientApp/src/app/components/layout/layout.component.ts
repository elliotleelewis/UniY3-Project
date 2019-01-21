import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
	navbarCollapsed = true;
	user: User = null;
	redirect: string = null;

	constructor(private account: AccountService, private _router: Router) {}

	get queryParams(): { redirect?: string } {
		return {
			redirect: this.redirect,
		};
	}

	ngOnInit(): void {
		this.account.user.subscribe((user) => (this.user = user));
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
