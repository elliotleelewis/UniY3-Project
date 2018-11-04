import { Component, HostBinding, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';
	@ViewChild('form')
	form: NgForm;
	formData = {
		email: '',
		password: '',
		passwordConfirm: '',
	};
}
