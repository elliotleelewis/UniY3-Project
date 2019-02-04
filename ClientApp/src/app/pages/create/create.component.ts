import { Component, HostBinding, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Options } from 'ng5-slider';

import { DeformationCreate } from '../../models/api/deformation-create';
import { DeformationsService } from '../../services/deformations.service';

@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
	@HostBinding('class')
	class = 'd-flex h-100';
	@ViewChild('form')
	form: NgForm;

	formData = {
		name: '',
		data: {
			0: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
			10: 0,
			11: 0,
			12: 0,
			13: 0,
			14: 0,
			15: 0,
			16: 0,
			17: 0,
		},
	};
	sliderOptions: Options = {
		floor: -20,
		ceil: 20,
		showSelectionBarFromValue: 0,
	};

	constructor(
		private deformations: DeformationsService,
		private _router: Router,
	) {}

	get deformation(): DeformationCreate {
		return {
			...this.formData,
			data: Object.values(this.formData.data),
		};
	}

	save(): void {
		if (!this.form.valid) {
			return;
		}
		this.deformations
			.saveDeformation(this.deformation)
			.subscribe((deformation) => {
				this._router.navigate(['/view/', deformation.id]);
			});
	}
}
