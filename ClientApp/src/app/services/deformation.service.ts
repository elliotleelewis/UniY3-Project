import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DeformationCreate } from '../models/api/deformation-create';
import { Deformation } from '../models/deformation';

@Injectable({
	providedIn: 'root',
})
export class DeformationService {
	constructor(private _http: HttpClient) {}

	getAllDeformations(params?: HttpParams): Observable<Deformation[]> {
		return this._http.get<Deformation[]>('/api/deformations', {
			params: params,
		});
	}

	getDeformation(id: string): Observable<Deformation> {
		return this._http.get<Deformation>('/api/deformations/' + id);
	}

	saveDeformation(deformation: DeformationCreate): Observable<Deformation> {
		return this._http.post<Deformation>('/api/deformations', deformation);
	}

	getMyDeformations(): Observable<Deformation[]> {
		return this._http.get<Deformation[]>('/api/deformations/me');
	}
}
