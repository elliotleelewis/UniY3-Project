import { Component, Input } from '@angular/core';

import { Deformation } from '../../models/deformation';

/**
 * Component that renders a list of deformations with links to view each.
 */
@Component({
	selector: 'app-deformation-list',
	templateUrl: './deformation-list.component.html',
	styleUrls: ['./deformation-list.component.scss'],
})
export class DeformationListComponent {
	/**
	 * List of deformations to render.
	 */
	@Input()
	deformations: Deformation[];
}
