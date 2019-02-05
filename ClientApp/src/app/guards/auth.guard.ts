import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AccountService } from '../services/account.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private account: AccountService, private _router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<boolean> | Promise<boolean> | boolean {
		const isAuthenticated = this.account.isAuthenticated();
		if (!isAuthenticated) {
			this._router.navigate(['/login'], {
				queryParams: { redirect: '/' + next.url.join('/') },
			});
		}
		return isAuthenticated;
	}
}
