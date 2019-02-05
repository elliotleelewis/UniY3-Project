import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Options } from 'ng5-slider';

import { DeformationCreate } from '../../models/api/deformation-create';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
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
		private _deformation: DeformationService,
		private _loading: LoadingService,
		private _router: Router,
	) {}

	get deformation(): DeformationCreate {
		return {
			...this.formData,
			data: Object.values(this.formData.data),
		};
	}

	ngOnInit(): void {
		// TODO - load named edit from route params
	}

	onSubmit(): void {
		if (!this.form.valid) {
			return;
		}
		this._loading.setState(true);
		this._deformation
			.saveDeformation(this.deformation)
			.subscribe((deformation) => {
				this._loading.setState(false);
				this._router.navigate(['/view/', deformation.id]);
			});
	}
}
