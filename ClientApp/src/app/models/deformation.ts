import { User } from './user';

export interface Deformation {
	id: string;
	name: string;
	data: number[];
	views: number;
	createdBy: User;
	createdAt: Date;
}
