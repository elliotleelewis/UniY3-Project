import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DeformationCreate } from '../models/api/deformation-create';
import { Deformation } from '../models/deformation';

@Injectable({
	providedIn: 'root',
})
export class DeformationsService {
	constructor(private http: HttpClient) {}

	getAllDeformations(): Observable<Deformation[]> {
		return this.http.get<Deformation[]>('/api/deformations');
	}

	getDeformation(id: string): Observable<Deformation> {
		return this.http.get<Deformation>('/api/deformations/' + id);
	}

	saveDeformation(deformation: DeformationCreate): Observable<Deformation> {
		return this.http.post<Deformation>('/api/deformations', deformation);
	}
}
