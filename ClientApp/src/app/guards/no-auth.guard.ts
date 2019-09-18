import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AccountService } from '../services/account.service';

/**
 * Guard to check that there isn't a currently authenticated user.
 */
@Injectable({
	providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
	constructor(private accountService: AccountService) {}

	/**
	 * Checks if the next route can activate or not.
	 * @param next - The next route.
	 * @param state - The current router state.
	 */
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<boolean> | Promise<boolean> | boolean {
		return !this.accountService.isAuthenticated();
	}
}
