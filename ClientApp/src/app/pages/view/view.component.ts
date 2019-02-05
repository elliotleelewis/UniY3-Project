import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Deformation } from '../../models/deformation';
import { DeformationsService } from '../../services/deformations.service';

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
		private deformations: DeformationsService,
		private _activatedRoute: ActivatedRoute,
	) {}

	ngOnInit() {
		this._activatedRoute.params.subscribe((params: { id: string }) => {
			this.deformations
				.getDeformation(params.id)
				.subscribe((deformation) => (this.deformation = deformation));
		});
	}
}
