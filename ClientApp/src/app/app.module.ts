import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AccountComponent } from './pages/account/account.component';
import { EditorComponent } from './pages/editor/editor.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ViewComponent } from './pages/view/view.component';
import { AccountService } from './services/account.service';
import { TransformationsService } from './services/transformations.service';
import { MatchesValidator } from './validators/matches.validator';

@NgModule({
	declarations: [
		AppComponent,
		// Components
		LayoutComponent,
		// Pages
		AccountComponent,
		EditorComponent,
		HomeComponent,
		LoginComponent,
		RegisterComponent,
		ViewComponent,
		// Validators
		MatchesValidator,
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot([
			{ path: '', pathMatch: 'full', component: HomeComponent },
			{
				path: 'login',
				component: LoginComponent,
				canActivate: [NoAuthGuard],
			},
			{
				path: 'register',
				component: RegisterComponent,
				canActivate: [NoAuthGuard],
			},
			{
				path: 'account',
				component: AccountComponent,
				canActivate: [AuthGuard],
			},
			{ path: 'view/:id', component: ViewComponent },
			{ path: 'editor', component: EditorComponent },
			{ path: 'editor/:id', component: EditorComponent },
		]),
		FontAwesomeModule,
		NgbModule,
	],
	providers: [
		{ provide: 'LOCAL_STORAGE', useFactory: getLocalStorage },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		AccountService,
		TransformationsService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {
		library.add(fas);
	}
}

export function getLocalStorage(): Storage {
	return typeof window !== 'undefined' ? window.localStorage : null;
}
