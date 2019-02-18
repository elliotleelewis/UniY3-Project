import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Deformation } from '../../models/deformation';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';

	user: User;
	deformations: Deformation[];

	constructor(
		private _account: AccountService,
		private _deformation: DeformationService,
		private _loading: LoadingService,
		private _router: Router,
	) {}

	ngOnInit(): void {
		this._loading.setState(true);
		this._account.user.subscribe((user) => (this.user = user));
		this._deformation
			.getMyDeformations()
			.pipe(finalize(() => this._loading.setState(false)))
			.subscribe((deformations) => {
				this.deformations = deformations;
			});
	}

	logout(): void {
		this._account.logout();
		this._router.navigate(['/']);
	}
}
