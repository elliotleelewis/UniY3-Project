import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserLogin } from '../models/api/user-login';
import { UserRegister } from '../models/api/user-register';
import { Jwt } from '../models/jwt';
import { JwtPayload } from '../models/jwt-payload';
import { User } from '../models/user';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	static CURRENT_USER = 'CURRENT_USER';
	readonly user: BehaviorSubject<User>;

	constructor(
		@Inject('LOCAL_STORAGE') private _localStorage: Storage,
		private _http: HttpClient,
	) {
		const jwt = this.getParsedToken();
		// TODO - Check for token expiration
		if (jwt) {
			this.user = new BehaviorSubject<User>(<User>{
				email: jwt.payload.sub,
			});
		} else {
			this.user = new BehaviorSubject<User>(null);
		}
	}

	static parseToken(token: string): Jwt {
		if (!token) {
			return null;
		}
		const tokenParts = token.split('.');
		return <Jwt>{
			payload: <JwtPayload>JSON.parse(atob(tokenParts[1])),
			token,
		};
	}

	getToken(): string {
		return this._localStorage.getItem(AccountService.CURRENT_USER);
	}

	getParsedToken(): Jwt {
		const token = this.getToken();
		return AccountService.parseToken(token);
	}

	setToken(token: string): void {
		this._localStorage.setItem(AccountService.CURRENT_USER, token);
	}

	isAuthenticated(): boolean {
		return !!this.user.getValue();
	}

	login(credentials: UserLogin): Observable<Jwt> {
		return this._http
			.post('/api/accounts/login', credentials, { responseType: 'text' })
			.pipe(
				map((token) => {
					const jwt = AccountService.parseToken(token);
					if (jwt) {
						this._localStorage.setItem(
							'CURRENT_USER',
							token,
						);
					}
					this.user.next(<User>{
						email: jwt.payload.sub,
					});
					return jwt;
				}),
			);
	}

	logout(): void {
		this._localStorage.removeItem('CURRENT_USER');
		this.user.next(null);
	}

	register(credentials: UserRegister): Observable<Jwt> {
		return this._http
			.post('/api/accounts/register', credentials, {
				responseType: 'text',
			})
			.pipe(
				map((token) => {
					const jwt = AccountService.parseToken(token);
					if (jwt) {
						this.setToken(JSON.stringify(jwt));
					}
					this.user.next(<User>{
						email: jwt.payload.sub,
					});
					return jwt;
				}),
			);
	}
}
