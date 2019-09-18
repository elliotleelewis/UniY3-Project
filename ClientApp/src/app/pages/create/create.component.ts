import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from 'ng5-slider';
import { filter, finalize } from 'rxjs/operators';

import { DeformationCreate } from '../../models/api/deformation-create';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

/**
 * Component for create page of application.
 */
@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
	@HostBinding('class')
	private class = 'd-flex h-100';
	@ViewChild('form', { static: true })
	private form: NgForm;

	/**
	 * Create form data.
	 */
	formData: DeformationCreate = {
		name: '',
		data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	};
	/**
	 * `ng5-slider` options.
	 */
	sliderOptions: Options = {
		floor: -20,
		ceil: 20,
		showSelectionBarFromValue: 0,
	};

	constructor(
		private deformationService: DeformationService,
		private loadingService: LoadingService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.activatedRoute.params
			.pipe(filter((params) => !!params.id))
			.subscribe((params) => {
				this.loadingService.setState(true);
				this.deformationService
					.getDeformation(params.id)
					.pipe(finalize(() => this.loadingService.setState(false)))
					.subscribe((deformation) => {
						this.formData.data = deformation.data;
					});
			});
	}

	/**
	 * Handles submit action on the form.
	 */
	onSubmit(): void {
		if (!this.form.valid) {
			return;
		}
		this.loadingService.setState(true);
		this.deformationService
			.createDeformation(this.formData)
			.pipe(finalize(() => this.loadingService.setState(false)))
			.subscribe((deformation) => {
				this.router.navigate(['/view/', deformation.id]);
			});
	}

	/**
	 * Randomizes a set of data points in the `formData.data` array, sets the rest to 0.
	 */
	randomize(): void {
		const data: number[] = [];
		for (let i = 0; i < this.formData.data.length; i++) {
			const doRandom = Math.random() < 0.2;
			data[i] = doRandom ? Math.round(Math.random() * 40 - 20) : 0;
		}
		this.formData.data = data;
	}

	/**
	 * Indexer used by Angular to track values in `ngFor` array.
	 * @param index - Index of element in `ngFor` array.
	 */
	indexer(index: number): number {
		return index;
	}
}
