import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeformationService } from './deformation.service';

describe('DeformationService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		}),
	);

	it('should be created', () => {
		const service: DeformationService = TestBed.get(DeformationService);
		expect(service).toBeTruthy();
	});
});
