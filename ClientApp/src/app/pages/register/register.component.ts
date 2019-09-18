import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { UserRegister } from '../../models/api/user-register';
import { AccountService } from '../../services/account.service';
import { LoadingService } from '../../services/loading.service';

/**
 * Component for register page of application.
 */
@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
	@HostBinding('class')
	private class = 'container-fluid d-block my-5';
	@ViewChild('form', { static: true })
	private form: NgForm;

	/**
	 * Register form data.
	 */
	formData: UserRegister = {
		email: '',
		password: '',
		passwordConfirm: '',
	};

	constructor(
		private accountService: AccountService,
		private loadingService: LoadingService,
		private router: Router,
	) {}

	/**
	 * Handles submit action on the form.
	 */
	onSubmit(): void {
		if (this.form.invalid) {
			return;
		}
		this.loadingService.setState(true);
		this.accountService
			.register(this.formData)
			.pipe(finalize(() => this.loadingService.setState(false)))
			.subscribe(
				() => {
					this.router.navigate(['/']);
				},
				(error: HttpErrorResponse) => {
					for (const e of error.error) {
						switch (e.code) {
							case 'DuplicateUserName':
								this.form.controls.email.setErrors({
									unique: true,
								});
								break;
						}
					}
				},
			);
	}
}
