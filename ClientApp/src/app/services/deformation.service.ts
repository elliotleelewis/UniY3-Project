import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DeformationCreate } from '../models/api/deformation-create';
import { Deformation } from '../models/deformation';

/**
 * Service to handle deformation actions.
 */
@Injectable({
	providedIn: 'root',
})
export class DeformationService {
	constructor(private _http: HttpClient) {}

	/**
	 * Gets all deformations.
	 * @param params - Optional HTTP parameters
	 */
	getAllDeformations(params?: HttpParams): Observable<Deformation[]> {
		return this._http.get<Deformation[]>('/api/deformations', {
			params: params,
		});
	}

	/**
	 * Gets a specific deformation.
	 * @param id - [[Deformation]] Id.
	 */
	getDeformation(id: string): Observable<Deformation> {
		return this._http.get<Deformation>('/api/deformations/' + id);
	}

	/**
	 * Creates a deformation.
	 * @param deformation - Deformation to create.
	 */
	createDeformation(deformation: DeformationCreate): Observable<Deformation> {
		return this._http.post<Deformation>('/api/deformations', deformation);
	}

	/**
	 * Gets all deformations created by the authenticated user.
	 */
	getMyDeformations(): Observable<Deformation[]> {
		return this._http.get<Deformation[]>('/api/deformations/me');
	}
}
