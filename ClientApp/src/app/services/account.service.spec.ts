import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';

describe('AccountService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{ provide: 'LOCAL_STORAGE', useValue: window.localStorage },
			],
		}),
	);

	it('should be created', () => {
		const service: AccountService = TestBed.inject(AccountService);
		expect(service).toBeTruthy();
	});
});
