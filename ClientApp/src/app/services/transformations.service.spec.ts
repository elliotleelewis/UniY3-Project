import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TransformationsService } from './transformations.service';

describe('TransformationsService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		}),
	);

	it('should be created', () => {
		const service: TransformationsService = TestBed.get(
			TransformationsService,
		);
		expect(service).toBeTruthy();
	});
});
