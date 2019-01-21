import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TransformationsService {
	constructor(private http: HttpClient) {}

	getAllTransformations(): Observable<object[]> {
		return this.http.get<object[]>('/api/transformations');
	}
}
