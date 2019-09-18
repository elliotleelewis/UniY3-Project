import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { UserLogin } from '../../models/api/user-login';
import { AccountService } from '../../services/account.service';
import { LoadingService } from '../../services/loading.service';

/**
 * Component for login page of application.
 */
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	@HostBinding('class')
	private class = 'container-fluid d-block my-5';
	@ViewChild('form', { static: true })
	private form: NgForm;

	/**
	 * Login form data.
	 */
	formData: UserLogin = {
		email: '',
		password: '',
	};
	/**
	 * Path to redirect to after successful login.
	 */
	redirect = '/';
	/**
	 * Displays warning alert if auth is required for the route that triggered the login redirect.
	 */
	authRequired = false;

	constructor(
		private accountService: AccountService,
		private loadingService: LoadingService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {}

	/**
	 * Lifecycle hook that runs when the view is initialized.
	 */
	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe((params) => {
			this.redirect = params.redirect || '/';
			this.authRequired = !!params.authRequired;
		});
	}

	/**
	 * Handles submit action on the form.
	 */
	onSubmit(): void {
		if (this.form.invalid) {
			return;
		}
		this.loadingService.setState(true);
		this.accountService
			.login(this.formData)
			.pipe(finalize(() => this.loadingService.setState(false)))
			.subscribe(
				() => {
					this.router.navigateByUrl(this.redirect);
				},
				() => {
					this.form.controls.email.setErrors({ invalid: true });
				},
			);
	}
}
