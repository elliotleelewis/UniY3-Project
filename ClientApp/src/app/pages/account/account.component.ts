import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../../services/account.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
	constructor(private account: AccountService, private _router: Router) {}

	logout(): void {
		this.account.logout();
		this._router.navigate(['/']);
	}
}
