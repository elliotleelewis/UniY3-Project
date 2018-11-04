import { Component, HostBinding } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	@HostBinding('class')
	class = 'd-block my-3 m-sm-5';
}
