import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeformerComponent } from './deformer.component';

describe('DeformerComponent', () => {
	let component: DeformerComponent;
	let fixture: ComponentFixture<DeformerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeformerComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeformerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
