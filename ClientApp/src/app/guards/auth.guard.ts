import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AccountService } from '../services/account.service';

/**
 * Guard to check that there is a currently authenticated user.
 */
@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private _account: AccountService, private _router: Router) {}

	/**
	 * Checks if the next route can activate or not.
	 * @param next - The next route.
	 * @param state - The current router state.
	 */
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<boolean> | Promise<boolean> | boolean {
		const isAuthenticated = this._account.isAuthenticated();
		if (!isAuthenticated) {
			this._router.navigate(['/login'], {
				queryParams: {
					redirect: '/' + next.url.join('/'),
					authRequired: true,
				},
			});
		}
		return isAuthenticated;
	}
}
