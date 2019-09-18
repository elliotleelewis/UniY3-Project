import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Deformation } from '../../models/deformation';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

/**
 * Component for account page of application.
 */
@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
	@HostBinding('class')
	private class = 'd-block my-3 m-sm-5';

	/**
	 * Current user.
	 */
	user: User;
	/**
	 * Deformations created by the current user.
	 */
	deformations: Deformation[];

	constructor(
		private accountService: AccountService,
		private deformationService: DeformationService,
		private loadingService: LoadingService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.loadingService.setState(true);
		this.accountService.user.subscribe((user) => (this.user = user));
		this.deformationService
			.getMyDeformations()
			.pipe(finalize(() => this.loadingService.setState(false)))
			.subscribe((deformations) => {
				this.deformations = deformations;
			});
	}

	/**
	 * Logs out the user.
	 */
	logout(): void {
		this.accountService.logout();
		this.router.navigate(['/']);
	}
}
