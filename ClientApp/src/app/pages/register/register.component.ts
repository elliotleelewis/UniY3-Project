import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { UserRegister } from '../../models/api/user-register';
import { AccountService } from '../../services/account.service';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
	@HostBinding('class')
	class = 'container-fluid d-block my-5';
	@ViewChild('form')
	form: NgForm;

	formData: UserRegister = {
		email: '',
		password: '',
		passwordConfirm: '',
	};

	constructor(
		private _account: AccountService,
		private _loading: LoadingService,
		private _router: Router,
	) {}

	onSubmit(): void {
		if (this.form.invalid) {
			return;
		}
		this._loading.setState(true);
		this._account
			.register(this.formData)
			.pipe(finalize(() => this._loading.setState(false)))
			.subscribe(
				() => {
					this._router.navigate(['/']);
				},
				(error: HttpErrorResponse) => {
					for (const e of error.error as { code: string }[]) {
						switch (e.code) {
							case 'DuplicateUserName':
								this.form.controls['email'].setErrors({
									unique: true,
								});
								break;
						}
					}
				},
			);
	}
}
