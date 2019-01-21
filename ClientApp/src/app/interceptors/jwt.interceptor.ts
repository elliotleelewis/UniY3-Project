import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountService } from '../services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private account: AccountService) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		// Add authorization header with JWT Token if available
		const token = this.account.getToken();
		const jwt = AccountService.parseToken(token);
		if (jwt && jwt.token) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${jwt.token}`,
				},
			});
		}
		return next.handle(request);
	}
}
