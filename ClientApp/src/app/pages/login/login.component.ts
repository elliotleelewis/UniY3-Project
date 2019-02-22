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
	@ViewChild('form')
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
		private _account: AccountService,
		private _loading: LoadingService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this._activatedRoute.queryParams.subscribe(
			(params) => {
				this.redirect = params.redirect || '/';
				this.authRequired = !!params.authRequired;
			},
		);
	}

	/**
	 * Handles submit action on the form.
	 */
	onSubmit(): void {
		if (this.form.invalid) {
			return;
		}
		this._loading.setState(true);
		this._account
			.login(this.formData)
			.pipe(finalize(() => this._loading.setState(false)))
			.subscribe(
				() => {
					this._router.navigateByUrl(this.redirect);
				},
				() => {
					this.form.controls['email'].setErrors({ invalid: true });
				},
			);
	}
}
