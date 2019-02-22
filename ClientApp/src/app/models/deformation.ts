import { User } from './user';

/**
 * Deformation model.
 */
export interface Deformation {
	/**
	 * Deformation's id.
	 */
	id: string;
	/**
	 * Deformation's name.
	 */
	name: string;
	/**
	 * Deformation's data.
	 */
	data: number[];
	/**
	 * Deformation's view count.
	 */
	views: number;
	/**
	 * User that created the deformation.
	 */
	createdBy: User;
	/**
	 * Date/time that the deformation was created at.
	 */
	createdAt: Date;
}
