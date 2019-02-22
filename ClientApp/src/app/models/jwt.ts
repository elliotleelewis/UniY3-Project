import { JwtPayload } from './jwt-payload';

/**
 * JWT model.
 */
export interface Jwt {
	/**
	 * JWT's payload.
	 */
	payload: JwtPayload;
	/**
	 * JWT string.
	 */
	token: string;
}
