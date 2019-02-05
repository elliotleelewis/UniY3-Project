import { Component, HostBinding, OnInit } from '@angular/core';

import { Deformation } from '../../models/deformation';
import { DeformationService } from '../../services/deformation.service';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';

	deformations: Deformation[];

	constructor(
		private _deformation: DeformationService,
		private _loading: LoadingService,
	) {}

	ngOnInit(): void {
		this._loading.setState(true);
		this._deformation.getAllDeformations().subscribe((deformations) => {
			this.deformations = deformations;
			this._loading.setState(false);
		});
	}
}
