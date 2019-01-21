import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserLogin } from '../../models/api/user-login';
import { AccountService } from '../../services/account.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	@HostBinding('class')
	class = 'container-fluid d-block my-5';
	@ViewChild('form')
	form: NgForm;

	formData: UserLogin = {
		email: '',
		password: '',
	};
	redirect = '/';

	constructor(
		private account: AccountService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this._activatedRoute.queryParams.subscribe(
			(params: { redirect?: string }) => {
				this.redirect = params.redirect || '/';
			},
		);
	}

	onSubmit(): void {
		if (this.form.invalid) {
			return;
		}
		this.account.login(this.formData).subscribe(
			(data) => {
				console.log(data);
				this._router.navigateByUrl(this.redirect);
			},
			(error) => {
				console.error('ERROR:', error);
			},
		);
	}
}
