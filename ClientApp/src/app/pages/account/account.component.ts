import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../../services/account.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';

	constructor(private _account: AccountService, private _router: Router) {}

	logout(): void {
		this._account.logout();
		this._router.navigate(['/']);
	}
}
