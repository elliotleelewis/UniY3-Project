import { Directive, Input } from '@angular/core';
import {
	AbstractControl,
	FormControl,
	NG_VALIDATORS,
	ValidationErrors,
	Validator,
} from '@angular/forms';

/**
 * Validator to check if two form elements have the same value.
 */
@Directive({
	// tslint:disable-next-line:directive-selector
	selector: '[matches][ngModel]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: MatchesValidator, multi: true },
	],
})
export class MatchesValidator implements Validator {
	/**
	 * Form element to match.
	 */
	@Input()
	matches: FormControl;

	/**
	 * Validates the control
	 * @param control - Control to validate
	 */
	validate(control: AbstractControl): ValidationErrors | null {
		if (control.value !== this.matches.value) {
			return {
				matches: true,
			};
		}
	}
}
