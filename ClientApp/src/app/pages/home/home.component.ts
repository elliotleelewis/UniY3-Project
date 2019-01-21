import { Component, HostBinding, OnInit } from '@angular/core';

import { TransformationsService } from '../../services/transformations.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';

	allTransformations: object[];

	constructor(private transformations: TransformationsService) {}

	ngOnInit(): void {
		this.transformations.getAllTransformations().subscribe((data) => {
			console.log(data);
		});
	}
}
