import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service to handle loading spinner state.
 */
@Injectable({
	providedIn: 'root',
})
export class LoadingService {
	/**
	 * BehaviorSubject to track loading status.
	 */
	readonly loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	/**
	 * Set loading state
	 * @param state - New state
	 */
	setState(state: boolean): void {
		this.loading.next(state);
	}
}
