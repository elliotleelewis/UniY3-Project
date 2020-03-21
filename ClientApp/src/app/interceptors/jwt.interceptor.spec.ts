import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{ provide: 'LOCAL_STORAGE', useValue: window.localStorage },
				{
					provide: HTTP_INTERCEPTORS,
					useClass: JwtInterceptor,
					multi: true,
				},
			],
		}),
	);

	it('should be created', () => {
		const service: JwtInterceptor = TestBed.inject(
			HTTP_INTERCEPTORS,
		)[0] as JwtInterceptor;
		expect(service).toBeTruthy();
	});
});
