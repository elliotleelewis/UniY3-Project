/**
 * DTO model for registering a user.
 */
export interface UserRegister {
	/**
	 * Register email.
	 */
	email: string;
	/**
	 * Register password.
	 */
	password: string;
	/**
	 * Register password confirmation.
	 */
	passwordConfirm: string;
}
