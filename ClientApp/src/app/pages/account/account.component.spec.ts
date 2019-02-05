import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
	let component: AccountComponent;
	let fixture: ComponentFixture<AccountComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AccountComponent],
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				{ provide: 'LOCAL_STORAGE', useValue: window.localStorage },
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AccountComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});