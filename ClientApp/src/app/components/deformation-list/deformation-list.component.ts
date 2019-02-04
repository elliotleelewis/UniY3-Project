import { Component, Input } from '@angular/core';

import { Deformation } from '../../models/deformation';

@Component({
	selector: 'app-deformation-list',
	templateUrl: './deformation-list.component.html',
	styleUrls: ['./deformation-list.component.scss'],
})
export class DeformationListComponent {
	@Input()
	deformations: Deformation[];
}
