import { Component, HostBinding, OnInit } from '@angular/core';

import { Deformation } from '../../models/deformation';
import { DeformationsService } from '../../services/deformations.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';

	allDeformations: Deformation[];

	constructor(private deformations: DeformationsService) {}

	ngOnInit(): void {
		this.deformations
			.getAllDeformations()
			.subscribe((deformations) => (this.allDeformations = deformations));
	}
}
