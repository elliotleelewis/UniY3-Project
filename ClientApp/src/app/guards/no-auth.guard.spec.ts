import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { NoAuthGuard } from './no-auth.guard';

describe('NoAuthGuard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				NoAuthGuard,
				{ provide: 'LOCAL_STORAGE', useValue: window.localStorage },
			],
		});
	});

	it('should ...', inject([NoAuthGuard], (guard: NoAuthGuard) => {
		expect(guard).toBeTruthy();
	}));
});
