import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeformationsService } from './deformations.service';

describe('DeformationsService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		}),
	);

	it('should be created', () => {
		const service: DeformationsService = TestBed.get(DeformationsService);
		expect(service).toBeTruthy();
	});
});
