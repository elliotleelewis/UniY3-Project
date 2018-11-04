import { Component, HostBinding, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';
	@ViewChild('form')
	form: NgForm;
	formData = {
		email: '',
		password: '',
	};
}
