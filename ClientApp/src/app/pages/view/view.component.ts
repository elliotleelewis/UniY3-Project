import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Deformation } from '../../models/deformation';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
	@HostBinding('class')
	class = 'd-flex h-100';

	deformation: Deformation;

	constructor(
		private _deformation: DeformationService,
		private _loading: LoadingService,
		private _activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this._activatedRoute.params.subscribe((params: { id: string }) => {
			this._loading.setState(true);
			this._deformation
				.getDeformation(params.id)
				.subscribe((deformation) => {
					this.deformation = deformation;
					this._loading.setState(false);
				});
		});
	}
}
