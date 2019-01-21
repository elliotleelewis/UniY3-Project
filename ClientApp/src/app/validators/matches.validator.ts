import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	FormControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';

@Directive({
	//tslint:disable-next-line:directive-selector
	selector: '[matches][ngModel]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: MatchesValidator, multi: true },
	],
})
export class MatchesValidator implements Validator {
	@Input()
	matches: FormControl;

	validate(control: AbstractControl): ValidationErrors | null {
		if (control.value !== this.matches.value) {
			return {
				matches: true,
			};
		}
	}
}
