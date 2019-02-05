import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DeformationListComponent } from './deformation-list.component';

describe('DeformationListComponent', () => {
	let component: DeformationListComponent;
	let fixture: ComponentFixture<DeformationListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeformationListComponent],
			imports: [RouterTestingModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeformationListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
