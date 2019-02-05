import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewComponent } from './view.component';

describe('ViewComponent', () => {
	let component: ViewComponent;
	let fixture: ComponentFixture<ViewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ViewComponent],
			imports: [
				HttpClientTestingModule,
				FormsModule,
				RouterTestingModule,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
