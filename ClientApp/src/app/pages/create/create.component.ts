import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from 'ng5-slider';
import { filter, finalize } from 'rxjs/operators';

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

	formData: DeformationCreate = {
		name: '',
		data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
		private _activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this._activatedRoute.params
			.pipe(filter((params: { id: string }) => !!params.id))
			.subscribe((params: { id: string }) => {
				this._loading.setState(true);
				this._deformation
					.getDeformation(params.id)
					.pipe(finalize(() => this._loading.setState(false)))
					.subscribe((deformation) => {
						this.formData.data = deformation.data;
					});
			});
	}

	onSubmit(): void {
		if (!this.form.valid) {
			return;
		}
		this._loading.setState(true);
		this._deformation
			.saveDeformation(this.formData)
			.pipe(finalize(() => this._loading.setState(false)))
			.subscribe((deformation) => {
				this._router.navigate(['/view/', deformation.id]);
			});
	}

	randomize(): void {
		const data: number[] = [];
		for (let i = 0; i < this.formData.data.length; i++) {
			const doRandom = Math.random() < 0.2;
			data[i] = doRandom ? Math.round(Math.random() * 40 - 20) : 0;
		}
		this.formData.data = data;
	}

	indexer(index: number): number {
		return index;
	}
}
