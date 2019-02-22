/**
 * DTO model for creating a deformation.
 */
export interface DeformationCreate {
	/**
	 * Deformation's name.
	 */
	name: string;
	/**
	 * Deformation's data.
	 */
	data: number[];
}
