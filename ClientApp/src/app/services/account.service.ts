import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserLogin } from '../models/api/user-login';
import { UserRegister } from '../models/api/user-register';
import { Jwt } from '../models/jwt';
import { JwtPayload } from '../models/jwt-payload';
import { User } from '../models/user';

/**
 * Service to handle account actions.
 */
@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private static readonly CURRENT_USER = 'CURRENT_USER';

	/**
	 * BehaviorSubject to track current user.
	 */
	readonly user: BehaviorSubject<User>;

	constructor(
		@Inject('LOCAL_STORAGE') private _localStorage: Storage,
		private _http: HttpClient,
	) {
		const token = this.getToken();
		const jwt = AccountService.parseToken(token);
		if (jwt && AccountService.isValidToken(token)) {
			this.user = new BehaviorSubject<User>(<User>{
				email: jwt.payload.sub,
			});
		} else {
			this.user = new BehaviorSubject<User>(null);
			this.removeToken();
		}
	}

	/**
	 * Gets a value indicating whether the JWT is valid.
	 * @param token - JWT string
	 */
	static isValidToken(token: string): boolean {
		const jwt = AccountService.parseToken(token);
		const date = new Date(0).setUTCSeconds(jwt.payload.exp);
		return date.valueOf() > new Date().valueOf();
	}

	/**
	 * Parses a JWT string into a [[Jwt]]
	 * @param token - JWT string
	 */
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

	/**
	 * Gets the JWT stored in Local Storage.
	 */
	getToken(): string {
		return this._localStorage.getItem(AccountService.CURRENT_USER);
	}

	/**
	 * Sets the JWT stored in Local Storage.
	 * @param token - JWT
	 */
	setToken(token: string): void {
		this._localStorage.setItem(AccountService.CURRENT_USER, token);
	}

	/**
	 * Removes the JWT stored in Local Storage.
	 */
	removeToken(): void {
		this._localStorage.removeItem(AccountService.CURRENT_USER);
	}

	/**
	 * Gets a value indicating whether the user is authenticated or not.
	 */
	isAuthenticated(): boolean {
		return !!this.user.getValue();
	}

	/**
	 * Attempts to log in user with credentials passed into the method.
	 * @param credentials - Login credentials
	 */
	login(credentials: UserLogin): Observable<Jwt> {
		return this._http
			.post('/api/accounts/login', credentials, { responseType: 'text' })
			.pipe(
				map((token) => {
					const jwt = AccountService.parseToken(token);
					if (jwt) {
						this.setToken(token);
					}
					this.user.next(<User>{
						email: jwt.payload.sub,
					});
					return jwt;
				}),
			);
	}

	/**
	 * Logs out the user.
	 */
	logout(): void {
		this.removeToken();
		this.user.next(null);
	}

	/**
	 * Attempts to register and then login user with credentials passed into the method.
	 * @param credentials - Register credentials.
	 */
	register(credentials: UserRegister): Observable<Jwt> {
		return this._http
			.post('/api/accounts/register', credentials, {
				responseType: 'text',
			})
			.pipe(
				map((token) => {
					const jwt = AccountService.parseToken(token);
					if (jwt) {
						this.setToken(token);
					}
					this.user.next(<User>{
						email: jwt.payload.sub,
					});
					return jwt;
				}),
			);
	}
}
