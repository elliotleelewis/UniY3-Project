import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AccountService } from '../services/account.service';

@Injectable({
	providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
	constructor(private _account: AccountService) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<boolean> | Promise<boolean> | boolean {
		return !this._account.isAuthenticated();
	}
}
