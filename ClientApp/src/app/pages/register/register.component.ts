import { Component, HostBinding, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserRegister } from '../../models/api/user-register';
import { AccountService } from '../../services/account.service';

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

	constructor(private account: AccountService, private _router: Router) {}

	onSubmit(): void {
		if (this.form.invalid) {
			return;
		}
		this.account.register(this.formData).subscribe(
			(data) => {
				console.log(data);
				this._router.navigate(['/']);
			},
			(error) => {
				console.error(error);
			},
		);
	}
}
