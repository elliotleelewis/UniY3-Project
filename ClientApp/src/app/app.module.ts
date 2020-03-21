import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';

import { AppComponent } from './app.component';
import { DeformationListComponent } from './components/deformation-list/deformation-list.component';
import { DeformerComponent } from './components/deformer/deformer.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AccountComponent } from './pages/account/account.component';
import { CreateComponent } from './pages/create/create.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ViewComponent } from './pages/view/view.component';
import { AccountService } from './services/account.service';
import { DeformationService } from './services/deformation.service';
import { MatchesValidator } from './validators/matches.validator';

/**
 * Root module for application.
 */
@NgModule({
	declarations: [
		AppComponent,
		// Components
		DeformationListComponent,
		DeformerComponent,
		LayoutComponent,
		// Pages
		AccountComponent,
		CreateComponent,
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
			{
				path: 'create',
				component: CreateComponent,
				canActivate: [AuthGuard],
			},
			{
				path: 'create/:id',
				component: CreateComponent,
				canActivate: [AuthGuard],
			},
		]),
		NgbCollapseModule,
		Ng5SliderModule,
	],
	providers: [
		{ provide: 'LOCAL_STORAGE', useFactory: getLocalStorage },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		AccountService,
		DeformationService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

/**
 * Factory for getting a Local Storage instance.
 */
export function getLocalStorage(): Storage {
	return typeof window !== 'undefined' ? window.localStorage : null;
}
