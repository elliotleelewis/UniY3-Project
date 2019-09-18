import { Component, HostBinding, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { Deformation } from '../../models/deformation';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

/**
 * Component for home page of application.
 */
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	@HostBinding('class')
	private class = 'd-block my-3 m-sm-5';

	/**
	 * Array of deformations to display.
	 */
	deformations: Deformation[];

	constructor(
		private deformationService: DeformationService,
		private loadingService: LoadingService,
	) {}

	ngOnInit(): void {
		this.loadingService.setState(true);
		this.deformationService
			.getAllDeformations()
			.pipe(finalize(() => this.loadingService.setState(false)))
			.subscribe((deformations) => {
				this.deformations = deformations;
			});
	}
}
