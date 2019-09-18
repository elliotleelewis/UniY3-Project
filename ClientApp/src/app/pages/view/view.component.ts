import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Deformation } from '../../models/deformation';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

/**
 * Component for view page of application.
 */
@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
	@HostBinding('class')
	private class = 'd-flex h-100';

	/**
	 * Deformation to view.
	 */
	deformation: Deformation;

	constructor(
		private deformationService: DeformationService,
		private loadingService: LoadingService,
		private activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			this.loadingService.setState(true);
			this.deformationService
				.getDeformation(params.id)
				.pipe(finalize(() => this.loadingService.setState(false)))
				.subscribe((deformation) => {
					this.deformation = deformation;
				});
		});
	}
}
