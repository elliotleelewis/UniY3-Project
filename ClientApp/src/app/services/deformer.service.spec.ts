import { TestBed } from '@angular/core/testing';

import { DeformerService } from './deformer.service';

describe('DeformerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: DeformerService = TestBed.get(DeformerService);
		expect(service).toBeTruthy();
	});
});
