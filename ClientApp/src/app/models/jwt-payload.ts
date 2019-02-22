/**
 * JWT Payload model.
 */
export interface JwtPayload {
	/**
	 * JWT's issuer.
	 */
	iss: string;
	/**
	 * JWT's subject.
	 */
	sub: string;
	/**
	 * JWT's audience.
	 */
	aud: string;
	/**
	 * JWT's expiration UNIX timestamp.
	 */
	exp: number;
	/**
	 * JWT's unique identifier.
	 */
	jti: string;
}
